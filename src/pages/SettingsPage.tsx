import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/components/ui/theme-provider'; // Import useTheme
import { webStore } from '../utils/webStore'; // Import webStore
import type { DataAPI } from '../types/data'; // Import DataAPI
import ConfirmDialog from '@/components/ConfirmDialog'; // Import ConfirmDialog
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem'; // Re-import Filesystem
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
// Helper to get the data store (Electron API or webStore)
const getDataStore = (): DataAPI => {
  return (window.api as unknown as DataAPI) ? (window.api as unknown as DataAPI) : webStore;
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

        if (Capacitor.isNativePlatform()) {
            let tempFilePath: string | undefined;
            try {
                // 1. 将数据写入临时文件
                const result = await Filesystem.writeFile({
                    path: fileName,
                    data: jsonString,
                    directory: Directory.Cache, // 保存到缓存目录
                    encoding: Encoding.UTF8,
                    recursive: true,
                });
                tempFilePath = result.uri; // 获取临时文件的 URI

                // 2. 使用 Capacitor Share 插件分享临时文件
                await Share.share({
                    title: '健身追踪器数据',
                    text: '这是您的健身追踪器数据备份。',
                    url: tempFilePath, // 分享临时文件的 URI
                    dialogTitle: '分享数据',
                });
                setAlertMessage('数据已通过分享功能导出！');
            } catch (error) {
                console.error('Capacitor 文件导出失败:', error);
                setAlertMessage('数据导出失败。');
            } finally {
                // 3. 删除临时文件
                if (tempFilePath) {
                    try {
                        await Filesystem.deleteFile({
                            path: fileName,
                            directory: Directory.Cache,
                        });
                        console.log('临时文件已删除。');
                    } catch (deleteError) {
                        console.error('删除临时文件失败:', deleteError);
                    }
                }
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
                                    setTimeout(() => window.location.reload(), 100);
                                }} variant={theme === "light" ? "default" : "outline"}>浅色</Button>
                                <Button onClick={() => {
                                    setTheme("dark");
                                    setTimeout(() => window.location.reload(), 100);
                                }} variant={theme === "dark" ? "default" : "outline"}>深色</Button>
                                <Button onClick={() => {
                                    setTheme("system");
                                    setTimeout(() => window.location.reload(), 100);
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
        </div>
    );
};

export default SettingsPage;
