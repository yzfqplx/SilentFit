import React from 'react';
import { TrainingRecord } from '../types/data';
import TrainingForm from '../components/TrainingForm';
import TrainingRecordCard from '../components/TrainingRecordCard';

interface RecordsPageProps {
    records: TrainingRecord[];
    formData: Partial<TrainingRecord>;
    editingId: string | null;
    handleRecordChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleRecordSubmit: (e: React.FormEvent) => Promise<void>;
    handleRecordEdit: (record: TrainingRecord) => void;
    handleRecordDelete: (id: string) => Promise<void>;
    handleCancelEdit: () => void;
}

const RecordsPage: React.FC<RecordsPageProps> = ({
    records,
    formData,
    editingId,
    handleRecordChange,
    handleRecordSubmit,
    handleRecordEdit,
    handleRecordDelete,
    handleCancelEdit,
}) => (
    <div className="space-y-8">
        <h1 className="text-3xl font-extrabold text-white">管理训练记录</h1>
        
        {/* Form */}
        <TrainingForm 
            formData={formData}
            editingId={editingId}
            handleRecordChange={handleRecordChange}
            handleRecordSubmit={handleRecordSubmit}
            handleCancelEdit={handleCancelEdit}
        />

        {/* Records List */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 transition-all duration-300 transform hover:scale-[1.01]">
            <h2 className="text-xl font-semibold mb-4 text-white">所有训练记录 ({records.length})</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {records.map(record => (
                    <TrainingRecordCard 
                        key={record._id} 
                        record={record} 
                        handleEdit={handleRecordEdit} 
                        handleDelete={handleRecordDelete}
                    />
                ))}
            </div>
        </div>
    </div>
);

export default RecordsPage;