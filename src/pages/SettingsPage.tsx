import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/components/ui/theme-provider'; // Import useTheme
import ConfirmDialog from '@/components/ConfirmDialog'; // Import ConfirmDialog
import { dataApi, fileApi } from '../lib/tauri'; // Import dataApi and fileApi
import { Github } from 'lucide-react'; // Import Github icon

// Helper to get the data store (Tauri API)
const getDataStore = () => {
    return dataApi;
};

const SettingsPage: React.FC = () => {
    const { heightCm, setHeightCm, records, setRecords, metrics, setMetrics, setAlertMessage } = useAppContext();
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
    const { theme, setTheme } = useTheme(); // Use the useTheme hook

    const handleExportData = async () => {
        const data = {
            heightCm,
            records,
            metrics,
        };
        const jsonString = JSON.stringify(data, null, 2);
        const fileName = 'fitness_tracker_data.json';

        try {
            // 检查是否在 Tauri 环境中
            const isTauri = '__TAURI__' in window;

            if (isTauri) {
                // 使用 Tauri 后端 API 导出文件
                const filePath = await fileApi.exportData(jsonString, fileName);
                console.log('文件已保存到:', filePath);

                // 检查是否在 Android 上，如果是则触发分享
                const userAgent = navigator.userAgent.toLowerCase();
                if (userAgent.includes('android')) {
                    try {
                        await fileApi.shareFile(
                            filePath,
                            '健身追踪器数据',
                            '这是您的健身追踪器数据备份。'
                        );
                        setAlertMessage('数据已导出并可分享！');
                    } catch (shareError) {
                        console.error('分享失败:', shareError);
                        setAlertMessage(`数据已保存到: ${filePath}`);
                    }
                } else {
                    setAlertMessage(`数据已保存到: ${filePath}`);
                }
            } else {
                // 在 Web 浏览器上使用传统下载方式
                const blob = new Blob([jsonString], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                setAlertMessage('数据已成功导出！');
            }
        } catch (error) {
            console.error('数据导出失败:', error);
            setAlertMessage('数据导出失败。');
        }
    };
    const handleClearAllData = async () => {
        const store = getDataStore();
        try {
            await store.clearCollection('training');
            await store.clearCollection('metrics');
            setRecords([]);
            setMetrics([]);
            setAlertMessage('所有数据已清除！');
        } catch (error) {
            console.error('清除数据失败:', error);
            setAlertMessage('清除数据失败。');
        }
    };

    const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            setAlertMessage('未选择文件。');
            setSelectedFileName(null);
            return;
        }

        setSelectedFileName(file.name);
        const reader = new FileReader();
        reader.onload = async (e) => { // Make the onload handler async
            try {
                const content = e.target?.result as string;
                const importedData = JSON.parse(content);

                console.log('Imported Data:', importedData); // Add this line for debugging

                if (importedData.heightCm !== undefined) {
                    setHeightCm(importedData.heightCm);
                }
                if (importedData.records) {
                    setRecords(importedData.records);
                }
                if (importedData.metrics) {
                    setMetrics(importedData.metrics);
                }

                // 持久化导入的数据
                const store = getDataStore();
                if (importedData.records) {
                    await store.clearCollection('training');
                    await store.bulkInsert('training', importedData.records);
                }
                if (importedData.metrics) {
                    await store.clearCollection('metrics');
                    await store.bulkInsert('metrics', importedData.metrics);
                }
                // heightCm 是一个单独的值，直接设置即可，不需要通过 store
                // setHeightCm 已经在上面调用，这里不需要再次调用
                // if (importedData.heightCm !== undefined) {
                // }

                setAlertMessage('数据已成功导入！');
            } catch (error) {
                console.error('导入数据失败:', error);
                setAlertMessage('导入数据失败，请检查文件格式。');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>个人信息与偏好</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <Label htmlFor="heightCm">身高 (CM)</Label>
                            <Input
                                id="heightCm"
                                type="number"
                                value={heightCm === '' ? '' : heightCm}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHeightCm(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                min="0" step="0.5"
                                className="w-full"
                                placeholder="用于计算 BMI（基于最新体重）"
                            />

                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            <p>训练记录数: {records.length}</p>
                            <p>围度记录数: {metrics.length}</p>
                        </div>
                        <div>
                            <Label>主题设置</Label>
                            <div className="mt-2 flex space-x-2"> {/* Use flex and space-x for button layout */}
                                <Button onClick={() => {
                                    setTheme("light");
                                }} variant={theme === "light" ? "default" : "outline"}>浅色</Button>
                                <Button onClick={() => {
                                    setTheme("dark");
                                }} variant={theme === "dark" ? "default" : "outline"}>深色</Button>
                                <Button onClick={() => {
                                    setTheme("system");
                                }} variant={theme === "system" ? "default" : "outline"}>系统</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>数据管理</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            您可以导出所有训练和围度数据，以便备份或迁移。
                            也可以导入之前导出的数据。
                        </p>
                        <Button onClick={handleExportData} className="w-full">导出数据</Button>
                        <div>
                            <Label htmlFor="importData">导入数据</Label>
                            <div className="flex w-full items-center space-x-2">
                                <Input
                                    id="importDataDisplay"
                                    type="text"
                                    readOnly
                                    value={selectedFileName || '选择 JSON 文件'}
                                    className="flex-grow"
                                    placeholder="选择 JSON 文件"
                                    onClick={() => document.getElementById('importData')?.click()}
                                />
                                <input
                                    id="importData"
                                    type="file"
                                    accept=".json"
                                    onChange={handleImportData}
                                    className="hidden"
                                />
                                <Button onClick={() => document.getElementById('importData')?.click()}>
                                    浏览
                                </Button>
                            </div>
                        </div>
                        <ConfirmDialog
                            title="确认清除所有数据"
                            description="此操作将永久删除所有训练和围度数据。您确定要继续吗？"
                            onConfirm={handleClearAllData}
                        >
                            <Button variant="destructive" className="w-full">清除所有数据</Button>
                        </ConfirmDialog>
                    </CardContent>
                </Card>
            </div>

            {/* About Section */}
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>关于</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p className="mb-2">SilentFit - 您的个人健身追踪助手</p>
                        <p>版本: 1.1.0-Alpha</p>
                        <p>作者: yzfqplx</p>
                    </div>
                    <div className="pt-2">
                        <Button
                            variant="outline"
                            className="w-full sm:w-auto flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            onClick={() => window.open('https://github.com/yzfqplx/SilentFit', '')}
                        >
                            <Github className="w-5 h-5" />
                            <span>查看 GitHub 仓库</span>
                        </Button>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500 pt-2">
                        <p>© 2025 SilentFit. 使用 Tauri + React 构建。</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SettingsPage;
