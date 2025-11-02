import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import KpiCard from '../components/KpiCard';
import { ReactIcon, ListChecksIcon, TapeMeasureIcon, WeightIcon, TrendingUpIcon } from '../components/icons/Icons';
import MaxWeightChart from '../components/charts/MaxWeightChart';
import ActivityTrendChart from '../components/charts/ActivityTrendChart';
import TrainingForm from '../components/TrainingForm';
import MetricPreviewCard from '../components/MetricPreviewCard';

const DashboardPage: React.FC = () => {
    const {
        totalWeightliftingSessions,
        totalSets,
        latestMetrics,
        shoulderWaistRatio,
        bmi,
        bmiDescription,
        shoulderWaistRatioDescription,
        maxWeightByActivity,
        selectedActivity,
        setSelectedActivity,
        trendRange,
        setTrendRange,
        activityTrendData,
        oneRepMaxTrend,
        formData,
        editingId,
        handleRecordChange,
        handleRecordSubmit,
        handleCancelRecordEdit,
        setCurrentPage,
        recommendation,
    } = useAppContext();
    
    return (
        <div className="space-y-8">
            
            {/* KPI Cards Section - unified grid of 5 for consistent alignment */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <KpiCard 
                icon={<ReactIcon size={24} />} 
                title="总训练次数" 
                value={totalWeightliftingSessions.toString()} 
                unit="次" 
                color="emerald" 
              />
              <KpiCard 
                icon={<ListChecksIcon size={24} />} 
                title="总组数" 
                value={totalSets.toString()} 
                unit="组" 
                color="blue" 
              />
              <KpiCard 
                icon={<TapeMeasureIcon size={24} />} 
                title="上次围度记录" 
                value={latestMetrics?.date || 'N/A'} 
                unit="" 
                color="indigo" 
              />
              <KpiCard 
                icon={<TapeMeasureIcon size={24} />} 
                title="肩腰比" 
                value={shoulderWaistRatio ? shoulderWaistRatio.toFixed(2) : 'N/A'} 
                unit="" 
                color="purple"
                description={shoulderWaistRatioDescription ? shoulderWaistRatioDescription.adjectives : '暂无数据'}
              />
              <KpiCard 
                icon={<WeightIcon />} 
                title="BMI" 
                value={bmi ? bmi.toFixed(2) : 'N/A'} 
                unit="" 
                color="emerald"
                description={bmiDescription ? bmiDescription.category : '暂无数据'}
              />
              <KpiCard
                icon={<TrendingUpIcon/>}
                title="1RM 预估趋势"
                value={oneRepMaxTrend.latest1RM !== null ? `${oneRepMaxTrend.latest1RM.toFixed(1)}kg` : 'N/A'}
                unit={oneRepMaxTrend.trend !== null && oneRepMaxTrend.trend !== undefined ? `${oneRepMaxTrend.trend.toFixed(1)}%` : ''}
                color={oneRepMaxTrend.trend !== null && oneRepMaxTrend.trend > 0 ? 'green' : 'red'}
                description={selectedActivity}
              />
            </div>

            {/* Activity Visualization */}
            <MaxWeightChart data={maxWeightByActivity} />

            {/* Activity Trend */}
            <ActivityTrendChart 
                selectedActivity={selectedActivity}
                setSelectedActivity={setSelectedActivity}
                trendRange={trendRange}
                setTrendRange={setTrendRange}
                activityTrendData={activityTrendData}
            />

            {/* Quick Add Form and Metric Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TrainingForm 
                    formData={formData}
                    editingId={editingId}
                    handleRecordChange={handleRecordChange}
                    handleRecordSubmit={handleRecordSubmit}
                    handleCancelEdit={handleCancelRecordEdit}
                    recommendation={recommendation}
                />
                <MetricPreviewCard 
                    latestMetrics={latestMetrics}
                    setCurrentPage={setCurrentPage}
                />
            </div>
        </div>
    );
};

export default DashboardPage;
