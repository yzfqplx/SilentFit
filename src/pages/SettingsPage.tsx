import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/components/ui/theme-provider'; // Import useTheme

const SettingsPage: React.FC = () => {
    const { heightCm, setHeightCm, records, setRecords, metrics, setMetrics, setAlertMessage } = useAppContext();
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
    const { theme, setTheme } = useTheme(); // Use the useTheme hook

    const handleExportData = () => {
        const data = {
            heightCm,
            records,
            metrics,
        };
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'fitness_tracker_data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            setAlertMessage('未选择文件。');
            setSelectedFileName(null);
            return;
        }

        setSelectedFileName(file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const importedData = JSON.parse(content);

                if (importedData.heightCm !== undefined) {
                    setHeightCm(importedData.heightCm);
                }
                if (importedData.records) {
                    setRecords(importedData.records);
                }
                if (importedData.metrics) {
                    setMetrics(importedData.metrics);
                }
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
                                onChange={(e) => setHeightCm(e.target.value === '' ? '' : parseFloat(e.target.value))}
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
                                <Button onClick={() => setTheme("light")} variant={theme === "light" ? "default" : "outline"}>浅色</Button>
                                <Button onClick={() => setTheme("dark")} variant={theme === "dark" ? "default" : "outline"}>深色</Button>
                                <Button onClick={() => setTheme("system")} variant={theme === "system" ? "default" : "outline"}>系统</Button>
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
                                                                />                                <input
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
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SettingsPage;
