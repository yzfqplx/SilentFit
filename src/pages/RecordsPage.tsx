import React, { useState, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import TrainingForm from '../components/TrainingForm';
import TrainingRecordCard from '../components/TrainingRecordCard';

const RecordsPage: React.FC = () => {
    const {
        records,
        formData,
        editingId,
        handleRecordChange,
        handleRecordSubmit,
        handleRecordEdit,
        handleRecordDelete: handleRecordDeleteWithContext,
        handleCancelRecordEdit,
        handleMarkAsComplete, // 新增
        recommendation,
        setFormData
    } = useAppContext();

    const [selectedDate, setSelectedDate] = useState<string>(formData.date || new Date().toISOString().substring(0, 10));

    // 创建包装函数以匹配 TrainingRecordCard 期望的签名
    const handleRecordDelete = (id: string) => {
        handleRecordDeleteWithContext(id);
    };

    const handleFilterDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setSelectedDate(newDate);
        setFormData(prev => ({ ...prev, date: newDate }));
    };

    const filteredRecords = useMemo(() => {
        if (!selectedDate) {
            return records;
        }
        return records.filter(record => record.date === selectedDate);
    }, [records, selectedDate]);

    // Group filtered records by date
    const groupedRecords = filteredRecords.reduce((acc, record) => {
        const date = record.date; // Assuming record.date is already a YYYY-MM-DD string
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(record);
        return acc;
    }, {} as Record<string, typeof records>);

    // Sort dates in descending order
    const sortedDates = Object.keys(groupedRecords).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    return (
        <div className="space-y-8">
            
            {/* Form */}
            <TrainingForm 
                formData={formData}
                editingId={editingId}
                handleRecordChange={handleRecordChange}
                handleRecordSubmit={handleRecordSubmit}
                handleCancelEdit={handleCancelRecordEdit}
                recommendation={recommendation}
            />

            {/* Records List */}
            <div 
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border dark:border-gray-700 transition-all duration-300 transform hover:scale-[1.01]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">所有训练记录 ({filteredRecords.length})</h2>
                    {/* Date Picker */}
                    <input
                        type="date"
                        id="recordDate"
                        value={selectedDate}
                        onChange={handleFilterDateChange}
                        className="mt-1 block p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white ml-auto"
                    />
                </div>
                <div className="space-y-6 max-h-96 overflow-y-scroll hide-scrollbar pr-2">
                    {sortedDates.length > 0 ? (
                        sortedDates.map(date => (
                            <div key={date} className="space-y-3">
                                {groupedRecords[date].map(record => (
                                    <TrainingRecordCard 
                                        key={record._id} 
                                        record={record} 
                                        handleEdit={(rec) => handleRecordEdit(rec)} 
                                        handleDelete={handleRecordDelete}
                                        handleMarkAsComplete={handleMarkAsComplete} // 新增
                                    />
                                ))}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">没有找到该日期的训练记录。</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecordsPage;
