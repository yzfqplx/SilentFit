import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import MetricForm from '../components/MetricForm';
import MetricHistoryChart from '../components/charts/MetricHistoryChart';
import MetricRecordCard from '../components/MetricRecordCard';

const MetricsPage: React.FC = () => {
    const {
        metrics,
        metricFormData,
        editingMetricId,
        handleMetricChange,
        handleMetricSubmit,
        handleMetricEdit,
        handleMetricDelete,
        handleCancelMetricEdit,
        setCurrentPage,
    } = useAppContext();

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-extrabold text-white">身体围度追踪</h1>

            {/* Metric Input Form */}
            <MetricForm 
                metricFormData={metricFormData}
                editingMetricId={editingMetricId}
                handleMetricChange={handleMetricChange}
                handleMetricSubmit={handleMetricSubmit}
                handleCancelEdit={handleCancelMetricEdit}
            />
            
            {/* Metric History Chart */}
            <MetricHistoryChart metrics={metrics} />

            {/* Metric Records List */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 transition-all duration-300 transform hover:scale-[1.01]">
                <h2 className="text-xl font-semibold mb-4 text-white">围度历史记录 ({metrics.length})</h2>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {metrics.map(metric => (
                        <MetricRecordCard 
                            key={metric._id} 
                            metric={metric} 
                            handleEdit={(met) => handleMetricEdit(met, setCurrentPage)} 
                            handleDelete={(id) => handleMetricDelete(id, window.confirm)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MetricsPage;
