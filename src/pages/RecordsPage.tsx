import React, { useState } from 'react';
import type { TrainingRecord } from '../types/data';
import TrainingForm from '../components/TrainingForm';
import TrainingRecordCard from '../components/TrainingRecordCard';
import AlertDialog from '../components/AlertDialog'; // Import AlertDialog

interface RecordsPageProps {
    records: TrainingRecord[];
    formData: Partial<TrainingRecord>;
    editingId: string | null;
    handleRecordChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleRecordSubmit: (e: React.FormEvent) => Promise<void>;
    handleRecordEdit: (record: TrainingRecord) => void;
    handleRecordDelete: (id: string) => Promise<void>;
    handleCancelEdit: () => void;
    trainingAlertMessage: string | null; // Add trainingAlertMessage prop
    handleCloseTrainingAlert: () => void; // Add handleCloseTrainingAlert prop
}

const ITEMS_PER_PAGE = 5; // Number of items to display per page

const RecordsPage: React.FC<RecordsPageProps> = ({
    records,
    formData,
    editingId,
    handleRecordChange,
    handleRecordSubmit,
    handleRecordEdit,
    handleRecordDelete,
    handleCancelEdit,
    trainingAlertMessage, // Destructure trainingAlertMessage
    handleCloseTrainingAlert, // Destructure handleCloseTrainingAlert
}) => {
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate pagination values
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = records.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(records.length / ITEMS_PER_PAGE);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
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
                    {currentItems.map(record => (
                        <TrainingRecordCard 
                            key={record._id} 
                            record={record} 
                            handleEdit={handleRecordEdit} 
                            handleDelete={handleRecordDelete}
                        />
                    ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2 mt-4">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition duration-150"
                        >
                            上一页
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => paginate(i + 1)}
                                className={`px-4 py-2 rounded-lg transition duration-150 ${
                                    currentPage === i + 1 ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition duration-150"
                        >
                            下一页
                        </button>
                    </div>
                )}
            </div>
            {/* Render custom AlertDialog */}
            <AlertDialog message={trainingAlertMessage} onClose={handleCloseTrainingAlert} />
        </div>
    );
};

export default RecordsPage;
