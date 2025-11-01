import React, { useState } from 'react';
import type { MetricRecord } from '../types/data';
import MetricForm from '../components/MetricForm';
import MetricHistoryChart from '../components/charts/MetricHistoryChart';
import MetricRecordCard from '../components/MetricRecordCard';

interface MetricsPageProps {
    metrics: MetricRecord[];
    metricFormData: Partial<MetricRecord>;
    editingMetricId: string | null;
    handleMetricChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleMetricSubmit: (e: React.FormEvent) => Promise<void>;
    handleMetricEdit: (metric: MetricRecord) => void;
    handleMetricDelete: (id: string) => Promise<void>;
    handleCancelEdit: () => void;
}

const ITEMS_PER_PAGE = 5; // Number of items to display per page

const MetricsPage: React.FC<MetricsPageProps> = ({
    metrics,
    metricFormData,
    editingMetricId,
    handleMetricChange,
    handleMetricSubmit,
    handleMetricEdit,
    handleMetricDelete,
    handleCancelEdit,
}) => {
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate pagination values
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = metrics.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(metrics.length / ITEMS_PER_PAGE);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-extrabold text-white">身体围度追踪</h1>

            {/* Metric Input Form */}
            <MetricForm 
                metricFormData={metricFormData}
                editingMetricId={editingMetricId}
                handleMetricChange={handleMetricChange}
                handleMetricSubmit={handleMetricSubmit}
                handleCancelEdit={handleCancelEdit}
            />
            
            {/* Metric History Chart */}
            <MetricHistoryChart metrics={metrics} />

            {/* Metric Records List */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 transition-all duration-300 transform hover:scale-[1.01]">
                <h2 className="text-xl font-semibold mb-4 text-white">围度历史记录 ({metrics.length})</h2>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {currentItems.map(metric => (
                        <MetricRecordCard 
                            key={metric._id} 
                            metric={metric} 
                            handleEdit={handleMetricEdit} 
                            handleDelete={handleMetricDelete}
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
        </div>
    );
};

export default MetricsPage;
