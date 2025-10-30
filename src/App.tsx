import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LineChart, Line, Legend } from 'recharts';

// --- 类型定义 (Types) ---

type Page = 'dashboard' | 'records' | 'metrics' | 'settings';

// 训练记录类型
interface TrainingRecord {
  _id: string;
  type: 'Running' | 'Cycling' | 'Weightlifting' | 'Other';
  activity: string; // 例如: '平板卧推', '高位下拉'
  date: string; // YYYY-MM-DD
  sets: number; // 力量训练 - 组数
  reps: number; // 力量训练 - 次数
  weightKg: number; // 力量训练 - 重量
  distanceKm?: number;
  notes: string;
  createdAt: Date;
}

// 围度记录类型
interface MetricRecord {
    _id: string;
    date: string; // YYYY-MM-DD
    shoulderCm: number;
    chestCm: number;
    armCm: number;
    waistCm: number;
    weightKg: number;
    notes: string;
    createdAt: Date;
}

// ----------------------------------------------------
// Data API 接口定义
// ----------------------------------------------------
interface DataAPI {
  find: (collection: string, query: object) => Promise<any[]>;
  insert: (collection: string, doc: object) => Promise<any>;
  update: (collection: string, query: object, update: object, options: object) => Promise<number>;
  remove: (collection: string, query: object, options: object) => Promise<number>;
}

declare global {
  interface Window {
    api: DataAPI;
  }
}

// 预设力量训练项目
const STRENGTH_ACTIVITIES = [
    '平板卧推',
    '坐姿推胸',
    '双杠臂屈伸',
    '高位下拉',
    '坐姿划船',
    '引体向上',
    '其他'
];

const normalizeActivity = (name: string) => name.replace(/\s*\([^)]*\)\s*$/, '');


// --- 内联 SVG 图标组件 ---
const IconWrapper: React.FC<{ size?: number; className?: string; children: React.ReactNode }> = ({ size = 24, className = '', children }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {children}
  </svg>
);

const DumbbellIcon = (props: { size?: number; className?: string }) => (
    <IconWrapper {...props}><path d="M14.4 14.4 9.6 9.6" /><path d="m18 10-4-4" /><path d="m6 18 4-4" /><path d="M19 19a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" /><path d="M5 5a2 2 0 1 1 4 0 2 2 0 0 1-4 0Z" /></IconWrapper>
);
const TapeMeasureIcon = (props: { size?: number; className?: string }) => (
    <IconWrapper {...props}><path d="M21 16H3a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2z" /><path d="M4 12h16" /><path d="M7 10v4" /><path d="M11 10v4" /><path d="M15 10v4" /><path d="M19 10v4" /></IconWrapper>
);
const ListChecksIcon = (props: { size?: number; className?: string }) => (
    <IconWrapper {...props}><path d="m3 16 2 2 4-4" /><path d="m3 12 2 2 4-4" /><path d="m3 8 2 2 4-4" /><path d="M14 4h7" /><path d="M14 8h7" /><path d="M14 12h7" /><path d="M14 16h7" /></IconWrapper>
);
const SettingsIcon = (props: { size?: number; className?: string }) => (
    <IconWrapper {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.22c-.63.26-1.22.58-1.74.95l-.26.12a2 2 0 0 0-1 1.74l-.22.44a2 2 0 0 0-.95 1.74l-.12.26a2 2 0 0 0-1.74 1l-.44.22a2 2 0 0 0-2 2v.44a2 2 0 0 0 2 2l.44.22c.26.63.58 1.22.95 1.74l.12.26a2 2 0 0 0 1.74 1l.22.44a2 2 0 0 0 2 2v.44a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.44a2 2 0 0 0 1.74-1l.22-.44c.63-.26 1.22-.58 1.74-.95l.26-.12a2 2 0 0 0 1.74-1l.22-.44a2 2 0 0 0 .95-1.74l.12-.26a2 2 0 0 0 1.74-1l.44-.22a2 2 0 0 0 2-2v-.44a2 2 0 0 0-2-2l-.44-.22c-.26-.63-.58-1.22-.95-1.74l-.12-.26a2 2 0 0 0-1.74-1l-.22-.44a2 2 0 0 0-2-2v-.44a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></IconWrapper>
);
const Trash2Icon = (props: { size?: number; className?: string }) => (
    <IconWrapper {...props}><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></IconWrapper>
);
const Edit2Icon = (props: { size?: number; className?: string }) => (
    <IconWrapper {...props}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></IconWrapper>
);
const CalendarIcon = (props: { size?: number; className?: string }) => (
    <IconWrapper {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></IconWrapper>
);
const WeightIcon = (props: { size?: number; className?: string }) => (
    <IconWrapper {...props}><path d="M12 2a4 4 0 0 1 4 4v5h-4z" /><path d="M8 6a4 4 0 0 0-4 4v5h4z" /><path d="M16 15h4v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-5z" /><path d="M4 15h4v5a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-5z" /></IconWrapper>
);
// --- End of SVG Icons ---



// --- 组件: KPI 概览卡片 ---
const KpiCard: React.FC<{ icon: React.ReactNode; title: string; value: string; unit: string; color: string }> = ({ icon, title, value, unit, color }) => (
  <div className={`p-5 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] border border-gray-700/50`} style={{ backgroundColor: '#1F2937' }}>
    <div className={`text-${color}-400 mb-2`}>{icon}</div>
    <div className="text-sm font-semibold text-gray-400">{title}</div>
    <div className="mt-1 flex items-end">
      <div className="text-3xl font-bold text-white">
        {value}
      </div>
      <div className="ml-1 text-base text-gray-400">{unit}</div>
    </div>
  </div>
);

// --- 主应用组件 (App) ---

const App: React.FC = () => {
  // --- 状态管理 ---
  const [records, setRecords] = useState<TrainingRecord[]>([]);
  const [metrics, setMetrics] = useState<MetricRecord[]>([]);
  const [formData, setFormData] = useState<Partial<TrainingRecord>>({
    type: 'Weightlifting',
    activity: STRENGTH_ACTIVITIES[0],
    date: new Date().toISOString().substring(0, 10),
    sets: 4,      // 默认组数
    reps: 12,     // 默认次数
    weightKg: 0,  // 默认重量
    notes: '',
  });
  const [metricFormData, setMetricFormData] = useState<Partial<MetricRecord>>({
    date: new Date().toISOString().substring(0, 10),
    shoulderCm: 0,
    chestCm: 0,
    armCm: 0,
    waistCm: 0,
    weightKg: 0,
    notes: '',
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingMetricId, setEditingMetricId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [authReady, setAuthReady] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<string>(STRENGTH_ACTIVITIES[0]);

  // --- Web 存储后备方案（用于移动端/浏览器无 Electron API 时）---
  const webStore: DataAPI = useMemo(() => {
    const load = (key: string) => {
      try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
    };
    const save = (key: string, data: any[]) => localStorage.setItem(key, JSON.stringify(data));
    const ensureId = (doc: any) => ({ _id: doc._id || Math.random().toString(36).slice(2), ...doc });
    const resolveKey = (collection: string) => (collection === 'training' ? 'training' : 'metrics');
    return {
      find: async (collection: string, _query: object) => load(resolveKey(collection)),
      insert: async (collection: string, doc: any) => {
        const key = resolveKey(collection);
        const list = load(key);
        const withId = ensureId({ ...doc, createdAt: doc.createdAt || new Date() });
        list.push(withId); save(key, list); return withId;
      },
      update: async (collection: string, query: any, update: any) => {
        const key = resolveKey(collection);
        const list = load(key);
        let count = 0;
        const next = list.map((item: any) => {
          if (item._id && query._id && item._id === query._id) {
            count += 1; return { ...item, ...(update.$set || update) };
          }
          return item;
        });
        save(key, next); return count;
      },
      remove: async (collection: string, query: any) => {
        const key = resolveKey(collection);
        const list = load(key);
        const next = list.filter((item: any) => !(item._id && query._id && item._id === query._id));
        const removed = list.length - next.length; save(key, next); return removed;
      },
    };
  }, []);
  // Settings: 身高（厘米），用于 BMI
  const [heightCm, setHeightCm] = useState<number | ''>('');
  useEffect(() => {
    const saved = localStorage.getItem('heightCm');
    if (saved) {
      const v = parseFloat(saved);
      if (!Number.isNaN(v) && v > 0) setHeightCm(v);
    }
  }, []);
  useEffect(() => {
    if (typeof heightCm === 'number' && heightCm > 0) {
      localStorage.setItem('heightCm', String(heightCm));
    }
  }, [heightCm]);

  // --- 通用数据获取 (Find) ---
  const fetchRecords = useCallback(async (collection: 'training' | 'metrics', setter: Function) => {
    if (!authReady || !window.api) return;
    try {
      const store = (window as any).api ? window.api : webStore;
      const foundRecords: any[] = await store.find(collection, {});
      const normalized = foundRecords.map(r => {
        if (collection === 'metrics') {
          return {
            shoulderCm: 0,
            chestCm: 0,
            armCm: 0,
            waistCm: 0,
            weightKg: 0,
            ...r,
          };
        }
        if (collection === 'training') {
          return {
            sets: r.sets ?? 0,
            reps: r.reps ?? 0,
            weightKg: r.weightKg ?? 0,
            ...r,
          };
        }
        return r;
      });
      setter(normalized.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (e) {
      console.error(`Failed to fetch ${collection} records:`, e);
    }
  }, [authReady, webStore]);

  useEffect(() => {
    fetchRecords('training', setRecords);
    fetchRecords('metrics', setMetrics);
    
    // 模拟实时数据刷新
    const interval = setInterval(() => {
      fetchRecords('training', setRecords);
      fetchRecords('metrics', setMetrics);
    }, 5000); 
    return () => clearInterval(interval);
  }, [fetchRecords]);

  useEffect(() => {
    // 假设 auth/db 初始化完成
    setAuthReady(true);
  }, []);

  // --- 训练记录处理 ---
  const handleRecordChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? undefined : parseFloat(value)) : value,
    }));
  };

  const handleRecordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 校验
    const missing: string[] = [];
    if (!formData.activity) missing.push('训练项目');
    if (!formData.date) missing.push('日期');
    if (formData.weightKg === undefined || (formData.weightKg as number) < 0) missing.push('重量');
    if (formData.sets === undefined || (formData.sets as number) < 1) missing.push('组数');
    if (formData.reps === undefined || (formData.reps as number) < 1) missing.push('次数');
    if (missing.length) {
      alert(`请检查以下字段：${missing.join('、')}`);
      return;
    }
    const store = (window as any).api ? window.api : webStore;

    try {
      const recordToSave = { 
        ...formData, 
        type: 'Weightlifting', // 强制设置为力量训练
        sets: formData.sets ?? 4,
        reps: formData.reps ?? 12,
        weightKg: formData.weightKg ?? 0,
        notes: formData.notes || ''
      };

      if (editingId) {
        const { createdAt, ...updateData } = recordToSave;
        await store.update('training', { _id: editingId }, { $set: { ...updateData, updatedAt: new Date() } }, {});
        setEditingId(null);
        console.log("Training Record updated successfully!");
      } else {
        await store.insert('training', { ...recordToSave, createdAt: new Date() });
        console.log("Training Record added successfully!");
      }

      // Reset form and refetch data
      setFormData({
        type: 'Weightlifting',
        activity: STRENGTH_ACTIVITIES[0],
        date: new Date().toISOString().substring(0, 10),
        sets: 4,
        reps: 12,
        weightKg: 0,
        notes: '',
      });
      fetchRecords('training', setRecords);

    } catch (error) {
      console.error("Error saving training record:", error);
    }
  };

  const handleRecordEdit = (record: TrainingRecord) => {
    setEditingId(record._id);
    const { createdAt, ...formRecord } = record;
    setFormData(formRecord); 
    setCurrentPage('records');
  };

  const handleRecordDelete = async (id: string) => {
    const store = (window as any).api ? window.api : webStore;
    if (!store || !window.confirm(`确认删除此训练记录吗?`)) return;
    try {
      await store.remove('training', { _id: id }, {});
      console.log("Training Record deleted successfully!");
      fetchRecords('training', setRecords);
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  // --- 身体围度处理 ---
  const handleMetricChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setMetricFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };
  
  const handleMetricSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 校验：至少一个测量有值，且均 >= 0
    if (!metricFormData.date) {
      alert('请选择日期');
      return;
    }
    const nums = [metricFormData.shoulderCm, metricFormData.chestCm, metricFormData.armCm, metricFormData.waistCm, metricFormData.weightKg]
      .map(v => (v === undefined || v === null ? 0 : Number(v)));
    if (nums.some(v => v < 0)) {
      alert('测量值需为非负数');
      return;
    }
    if (nums.every(v => v === 0)) {
      alert('至少填写一项非 0 的测量值');
      return;
    }
    const store = (window as any).api ? window.api : webStore;

    try {
        const metricToSave = {
            ...metricFormData,
            shoulderCm: metricFormData.shoulderCm || 0,
            chestCm: metricFormData.chestCm || 0,
            armCm: metricFormData.armCm || 0,
            waistCm: metricFormData.waistCm || 0,
            weightKg: metricFormData.weightKg || 0,
            notes: metricFormData.notes || '',
        };

        if (editingMetricId) {
            const { createdAt, ...updateData } = metricToSave;
            await store.update('metrics', { _id: editingMetricId }, { $set: { ...updateData, updatedAt: new Date() } }, {});
            setEditingMetricId(null);
            console.log("Metric Record updated successfully!");
        } else {
            await store.insert('metrics', { ...metricToSave, createdAt: new Date() });
            console.log("Metric Record added successfully!");
        }

        // Reset form and refetch data
        setMetricFormData({
            date: new Date().toISOString().substring(0, 10),
            shoulderCm: 0, chestCm: 0, armCm: 0, waistCm: 0, weightKg: 0, notes: ''
        });
        fetchRecords('metrics', setMetrics);

    } catch (error) {
        console.error("Error saving metric record:", error);
    }
  };

  const handleMetricEdit = (metric: MetricRecord) => {
    setEditingMetricId(metric._id);
    const { createdAt, ...formMetric } = metric;
    setMetricFormData(formMetric);
  };
  
  const handleMetricDelete = async (id: string) => {
    const store = (window as any).api ? window.api : webStore;
    if (!store || !window.confirm(`确认删除此围度记录吗?`)) return;
    try {
      await store.remove('metrics', { _id: id }, {});
      console.log("Metric Record deleted successfully!");
      fetchRecords('metrics', setMetrics);
    } catch (error) {
      console.error("Error deleting metric record:", error);
    }
  };
  
  // --- 派生数据 (KPIs) ---
  const totalWeightliftingSessions = records.filter(r => r.type === 'Weightlifting').length;
  const totalSets = records.reduce((sum, r) => sum + (r.sets || 0), 0);
  
  
  
  const latestMetrics = metrics.length > 0 ? metrics[0] : null;
  const shoulderWaistRatio = latestMetrics && latestMetrics.waistCm > 0
    ? (latestMetrics.shoulderCm / latestMetrics.waistCm)
    : null;
  const bmi = latestMetrics && typeof heightCm === 'number' && heightCm > 0 && latestMetrics.weightKg > 0
    ? (latestMetrics.weightKg / Math.pow(heightCm / 100, 2))
    : null;
  
  // --- 训练项目可视化: 各项目最大重量 ---
  const maxWeightByActivity = useMemo(() => {
    const map: Record<string, number> = {};
    records.forEach(r => {
      if (!r.activity) return;
      const key = normalizeActivity(r.activity);
      map[key] = Math.max(map[key] || 0, r.weightKg || 0);
    });
    return Object.entries(map)
      .map(([activity, maxW]) => ({ activity, maxW }))
      .sort((a, b) => b.maxW - a.maxW)
      .slice(0, 10);
  }, [records]);

  // 预测逻辑已移除（当前未使用）

  // --- 训练项目趋势数据: 某项目的重量与次数随时间 ---
  const [trendRange, setTrendRange] = useState<'30' | '90' | 'all'>('all');
  const activityTrendData = useMemo(() => {
    const target = selectedActivity;
    let data = records
      .filter(r => normalizeActivity(r.activity) === target)
      .slice()
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(r => ({ date: r.date, weightKg: r.weightKg || 0, reps: r.reps || 0 }));
    if (trendRange !== 'all') {
      const days = trendRange === '30' ? 30 : 90;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      data = data.filter(d => new Date(d.date) >= cutoff);
    }
    return data;
  }, [records, selectedActivity, trendRange]);


  // --- 渲染辅助函数 ---

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-extrabold text-white">力量训练仪表板</h1>
            
            {/* KPI Cards Section - unified grid of 5 for consistent alignment */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <KpiCard 
                icon={<DumbbellIcon size={24} />} 
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
              />
              <KpiCard 
                icon={<WeightIcon />} 
                title="BMI" 
                value={bmi ? bmi.toFixed(2) : 'N/A'} 
                unit="" 
                color="emerald" 
              />
            </div>

            {/* Removed: 训练时长趋势图表 */}

            {/* Activity Visualization */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 transition-all duration-300 transform hover:scale-[1.01]">
              <h2 className="text-xl font-semibold mb-4 text-white">各训练项目最大重量</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={maxWeightByActivity} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="activity" stroke="#9CA3AF" interval={0} angle={-20} textAnchor="end" height={80} />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} labelStyle={{ color: '#E5E7EB' }} formatter={(value: number) => [`${value} KG`, '最大重量']} />
                  <Bar dataKey="maxW" fill="#60A5FA" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Activity Trend */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 transition-all duration-300 transform hover:scale-[1.01]">
              <div className="flex items-center justify-between mb-4 gap-4">
                <h2 className="text-xl font-semibold text-white">训练项目趋势</h2>
                <div className="flex items-center gap-2">
                  <select
                    className="bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500 transition duration-150"
                    value={selectedActivity}
                    onChange={(e) => setSelectedActivity(e.target.value)}
                  >
                    {STRENGTH_ACTIVITIES.map(act => (
                      <option key={act} value={act}>{act}</option>
                    ))}
                  </select>
                  <select
                    className="bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500 transition duration-150"
                    value={trendRange}
                    onChange={(e) => setTrendRange(e.target.value as any)}
                  >
                    <option value="30">近30天</option>
                    <option value="90">近90天</option>
                    <option value="all">全部</option>
                  </select>
                </div>
              </div>
              {activityTrendData.length < 2 ? (
                <div className="text-center p-8 text-gray-500">该项目至少需要两条记录以显示趋势。</div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={activityTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} labelStyle={{ color: '#E5E7EB' }} />
                    <Line type="monotone" dataKey="weightKg" name="重量 (KG)" stroke="#34D399" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="reps" name="次数" stroke="#FBBF24" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Quick Add Form and Metric Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderTrainingFormCard()}
                {renderMetricPreviewCard()}
            </div>
          </div>
        );

      case 'records':
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-extrabold text-white">管理训练记录</h1>
            
            {/* Form */}
            {renderTrainingFormCard()}

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

      case 'metrics':
        return (
            <div className="space-y-8">
                <h1 className="text-3xl font-extrabold text-white">身体围度追踪</h1>

                {/* Metric Input Form */}
                {renderMetricFormCard()}
                
                {/* Metric History Chart */}
                {renderMetricHistoryChart()}

                {/* Metric Records List */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 transition-all duration-300 transform hover:scale-[1.01]">
                    <h2 className="text-xl font-semibold mb-4 text-white">围度历史记录 ({metrics.length})</h2>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {metrics.map(metric => (
                            <MetricRecordCard 
                                key={metric._id} 
                                metric={metric} 
                                handleEdit={handleMetricEdit} 
                                handleDelete={handleMetricDelete}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );

      case 'settings':
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-extrabold text-white">设置</h1>
      <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 text-gray-400 space-y-4 transition-all duration-300 transform hover:scale-[1.01]">
        <div>
          <label htmlFor="heightCm" className="block text-sm font-medium text-gray-400 mb-1">身高 (CM)</label>
          <input
            id="heightCm"
            type="number"
            className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            value={heightCm === '' ? '' : heightCm}
            onChange={(e) => setHeightCm(e.target.value === '' ? '' : parseFloat(e.target.value))}
            min="0" step="0.5"
          />
          <p className="text-xs text-gray-500 mt-1">用于计算 BMI（基于最新体重）</p>
        </div>
        <div className="text-sm">
          <p>训练记录数: {records.length}</p>
          <p>围度记录数: {metrics.length}</p>
        </div>
      </div>
          </div>
        );
      default:
        return null;
    }
  };

  // --- 训练记录表单卡片 ---
  const renderTrainingFormCard = () => (
      <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 transition-all duration-300 transform hover:scale-[1.01]">
        <h2 className="text-xl font-semibold mb-4 text-emerald-400">
          {editingId ? '编辑训练记录' : '添加力量训练记录'}
        </h2>
        <form onSubmit={handleRecordSubmit} className="space-y-4">
          
          {/* Row 1: Activity and Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label htmlFor="activity" className="block text-sm font-medium text-gray-400 mb-1">训练项目</label>
              <select
                id="activity"
                name="activity"
                value={formData.activity || ''}
                onChange={handleRecordChange}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500 transition duration-150 appearance-none"
              >
                {STRENGTH_ACTIVITIES.map(activity => (
                  <option key={activity} value={activity}>{activity}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <label htmlFor="date" className="block text-sm font-medium text-gray-400 mb-1">日期</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date || new Date().toISOString().substring(0, 10)}
                onChange={handleRecordChange}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500 transition duration-150"
                required
              />
              <CalendarIcon className="absolute right-3 top-[34px] w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Row 2: Weight, Sets, Reps */}
          <div className="grid grid-cols-3 gap-4">
            <div className="relative">
              <label htmlFor="weightKg" className="block text-sm font-medium text-gray-400 mb-1">重量 (KG)</label>
              <input
                type="number"
                id="weightKg"
                name="weightKg"
                value={formData.weightKg || ''}
                onChange={handleRecordChange}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 pl-10 pr-3 focus:ring-emerald-500 focus:border-emerald-500 transition duration-150"
                required
                min="0"
                step="0.5"
              />
              <WeightIcon className="absolute left-3 top-[34px] w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <label htmlFor="sets" className="block text-sm font-medium text-gray-400 mb-1">组数</label>
              <input
                type="number"
                id="sets"
                name="sets"
                value={formData.sets === undefined || formData.sets === null ? '' : formData.sets}
                onChange={handleRecordChange}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500 transition duration-150"
                required
                min="1"
              />
            </div>
            <div className="relative">
              <label htmlFor="reps" className="block text-sm font-medium text-gray-400 mb-1">次数</label>
              <input
                type="number"
                id="reps"
                name="reps"
                value={formData.reps === undefined || formData.reps === null ? '' : formData.reps}
                onChange={handleRecordChange}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500 transition duration-150"
                required
                min="1"
              />
            </div>
          </div>
          
          {/* Notes */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-400 mb-1">备注</label>
              <textarea
                id="notes"
                name="notes"
                rows={2}
                value={formData.notes || ''}
                onChange={handleRecordChange as any}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500 transition duration-150"
              />
            </div>
          </div>


          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-lg text-lg font-semibold 
                       bg-emerald-600 hover:bg-emerald-500 text-white 
                       shadow-xl shadow-emerald-900/50 
                       transition-all duration-300 transform hover:scale-[1.01]"
          >
            {editingId ? '保存更改' : '添加训练记录'}
          </button>
        </form>
        {editingId && (
            <button
                onClick={() => { setEditingId(null); setFormData({ type: 'Weightlifting', activity: STRENGTH_ACTIVITIES[0], date: new Date().toISOString().substring(0, 10), sets: 4, reps: 12, weightKg: 0, notes: '' }); }}
                className="mt-2 w-full text-center py-1 text-sm font-medium text-gray-400 hover:text-white transition duration-150"
            >
                取消编辑
            </button>
        )}
      </div>
  );
  
  // --- 身体围度表单卡片 ---
  const renderMetricFormCard = () => (
      <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 transition-all duration-300 transform hover:scale-[1.01] mb-8">
        <h2 className="text-xl font-semibold mb-4 text-indigo-400">
          {editingMetricId ? '编辑围度记录' : '记录身体围度'}
        </h2>
        <form onSubmit={handleMetricSubmit} className="space-y-4">
          
          {/* Row 1: Date / Shoulder / Chest / Arm / Waist / Weight */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="relative">
              <label htmlFor="date" className="block text-sm font-medium text-gray-400 mb-1">日期</label>
              <input
                type="date"
                id="date"
                name="date"
                value={metricFormData.date || new Date().toISOString().substring(0, 10)}
                onChange={handleMetricChange}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                required
              />
            </div>
            <div className="relative">
              <label htmlFor="shoulderCm" className="block text-sm font-medium text-gray-400 mb-1">肩围 (CM)</label>
              <input
                type="number"
                id="shoulderCm"
                name="shoulderCm"
                value={metricFormData.shoulderCm || ''}
                onChange={handleMetricChange}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                min="0" step="0.1" required
              />
            </div>
            <div className="relative">
              <label htmlFor="chestCm" className="block text-sm font-medium text-gray-400 mb-1">胸围 (CM)</label>
              <input
                type="number"
                id="chestCm"
                name="chestCm"
                value={metricFormData.chestCm || ''}
                onChange={handleMetricChange}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                min="0" step="0.1" required
              />
            </div>
            <div className="relative">
              <label htmlFor="armCm" className="block text-sm font-medium text-gray-400 mb-1">臂围 (CM)</label>
              <input
                type="number"
                id="armCm"
                name="armCm"
                value={metricFormData.armCm || ''}
                onChange={handleMetricChange}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                min="0" step="0.1"
              />
            </div>
            <div className="relative">
              <label htmlFor="waistCm" className="block text-sm font-medium text-gray-400 mb-1">腰围 (CM)</label>
              <input
                type="number"
                id="waistCm"
                name="waistCm"
                value={metricFormData.waistCm || ''}
                onChange={handleMetricChange}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                min="0" step="0.1"
              />
            </div>
            <div className="relative">
              <label htmlFor="weightKg" className="block text-sm font-medium text-gray-400 mb-1">体重 (KG)</label>
              <input
                type="number"
                id="weightKg"
                name="weightKg"
                value={metricFormData.weightKg || ''}
                onChange={handleMetricChange}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                min="0" step="0.1"
              />
            </div>
          </div>

          {/* Row 2: Notes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="relative col-span-2 md:col-span-4">
              <label htmlFor="metricNotes" className="block text-sm font-medium text-gray-400 mb-1">备注</label>
              <textarea
                id="metricNotes"
                name="notes"
                rows={1}
                value={metricFormData.notes || ''}
                onChange={handleMetricChange as any}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              />
            </div>
          </div>
          

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-lg text-lg font-semibold 
                       bg-indigo-600 hover:bg-indigo-500 text-white 
                       shadow-xl shadow-indigo-900/50 
                       transition-all duration-300 transform hover:scale-[1.01]"
          >
            {editingMetricId ? '保存围度更改' : '记录围度数据'}
          </button>
        </form>
        {editingMetricId && (
            <button
                onClick={() => { setEditingMetricId(null); setMetricFormData({ date: new Date().toISOString().substring(0, 10), shoulderCm: 0, chestCm: 0, armCm: 0, waistCm: 0, weightKg: 0, notes: '' }); }}
                className="mt-2 w-full text-center py-1 text-sm font-medium text-gray-400 hover:text-white transition duration-150"
            >
                取消编辑
            </button>
        )}
      </div>
  );

  // --- 围度预览卡片 ---
  const renderMetricPreviewCard = () => (
    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 transition-all duration-300 transform hover:scale-[1.01]">
        <h2 className="text-xl font-semibold mb-4 text-indigo-400 flex items-center">
            <TapeMeasureIcon size={20} className="mr-2"/> 最新身体围度 ({latestMetrics?.date || 'N/A'})
        </h2>
        
        {latestMetrics ? (
            <div className="grid grid-cols-2 gap-4 text-sm">
                <MetricDisplay label="肩围" value={latestMetrics.shoulderCm} unit="cm" />
                <MetricDisplay label="胸围" value={latestMetrics.chestCm} unit="cm" />
                <MetricDisplay label="臂围" value={latestMetrics.armCm} unit="cm" />
                <MetricDisplay label="腰围" value={latestMetrics.waistCm} unit="cm" />
                <MetricDisplay label="体重" value={latestMetrics.weightKg} unit="kg" />
            </div>
        ) : (
            <div className="text-gray-500 text-center py-4">暂无围度数据。</div>
        )}

        <button
            onClick={() => setCurrentPage('metrics')}
            className="mt-6 w-full py-2 text-sm rounded-lg font-semibold bg-indigo-700 hover:bg-indigo-600 text-white transition duration-150"
        >
            前往追踪围度历史
        </button>
    </div>
  );

  // --- 围度历史图表 ---
  const renderMetricHistoryChart = () => {
    const data = metrics.slice().reverse(); // 反转，使图表从最老数据开始

    if (data.length < 2) {
        return (
            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
                <h2 className="text-xl font-semibold mb-4 text-white">围度趋势</h2>
                <div className="text-center p-8 text-gray-500">
                    至少需要两条记录才能绘制趋势图。
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 transition-all duration-300 transform hover:scale-[1.01]">
            <h2 className="text-xl font-semibold mb-4 text-white">围度趋势 (CM)</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" domain={['auto', 'auto']} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                        labelStyle={{ color: '#E5E7EB' }}
                        formatter={(value: number) => [`${value.toFixed(1)} cm`]}
                    />
                    <Legend wrapperStyle={{ color: '#E5E7EB' }} />
                    <Line type="monotone" dataKey="shoulderCm" name="肩围" stroke="#60A5FA" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="chestCm" name="胸围" stroke="#A78BFA" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="armCm" name="臂围" stroke="#FBBF24" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="waistCm" name="腰围" stroke="#F87171" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
  };
  

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans antialiased">
      
      {/* 1. Sidebar Navigation */}
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* 2. Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        {renderContent()}
      </main>

    </div>
  );
};

// --- 子组件: 围度数据显示单元 ---
const MetricDisplay: React.FC<{ label: string; value: number | null | undefined; unit: string }> = ({ label, value, unit }) => {
    const isNumber = typeof value === 'number' && isFinite(value);
    const displayValue = isNumber ? (value as number).toFixed(1) : 'N/A';
    return (
        <div className="flex justify-between items-center py-1 border-b border-gray-700/50 last:border-b-0">
            <span className="text-gray-400 font-light">{label}:</span>
            <span className="text-lg font-bold text-white">
                {displayValue} <span className="text-sm font-normal text-gray-400">{unit}</span>
            </span>
        </div>
    );
};


// --- 子组件: 侧边栏 ---
const Sidebar: React.FC<{ currentPage: Page; setCurrentPage: React.Dispatch<React.SetStateAction<Page>> }> = ({ currentPage, setCurrentPage }) => {
    
    const navItems = [
        { id: 'dashboard', icon: DumbbellIcon, label: '仪表板' },
        { id: 'records', icon: ListChecksIcon, label: '训练记录' },
        { id: 'metrics', icon: TapeMeasureIcon, label: '身体围度' }, // 新增
        { id: 'settings', icon: SettingsIcon, label: '设置' },
    ];
    
    return (
        <aside className="w-20 md:w-64 bg-gray-800 p-4 shadow-2xl flex flex-col border-r border-gray-700">
            <div className="flex items-center p-2 mb-8 mt-2">
                <DumbbellIcon className="w-8 h-8 text-emerald-400 mr-2" />
                <h1 className="hidden md:block text-xl font-bold text-white">SilentFit</h1>
            </div>
            
            <nav className="flex-1 space-y-2">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setCurrentPage(item.id as Page)}
                        className={`
                            flex items-center w-full py-3 px-3 rounded-xl 
                            text-sm font-medium transition duration-200 bg-gray-700
                            ${currentPage === item.id 
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50 bg-indigo-700' 
                                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                            }
                        `}
                    >
                        <item.icon className="w-5 h-5 mr-3" />
                        <span className="hidden md:block">{item.label}</span>
                    </button>
                ))}
            </nav>
        </aside>
    );
};

// --- 子组件: 训练记录卡片 ---

const TrainingRecordCard: React.FC<{ 
    record: TrainingRecord; 
    handleEdit: (record: TrainingRecord) => void;
    handleDelete: (id: string) => void;
}> = ({ record, handleEdit, handleDelete }) => {
    
    return (
        <div className={`
            p-4 rounded-xl shadow-lg border border-gray-700/50 bg-gray-800
            transition duration-300 hover:bg-gray-700/70
            flex justify-between items-center
        `}>
            {/* Left Info: Activity, Date, Volume */}
            <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full bg-emerald-600 text-white`}>
                    <DumbbellIcon size={16} />
                </div>
                <div>
                    <div className="font-semibold text-white flex items-center">
                        {record.activity}
                        <span className="ml-3 text-xs text-gray-400 font-normal">{record.date}</span>
                    </div>
                    <div className="text-sm text-gray-400">
                        <span className='text-emerald-400 font-bold mr-1'>{record.weightKg} KG</span> 
                        x {record.reps} 次 x {record.sets} 组
                    </div>
                    {record.notes && (
                        <p className="text-xs text-gray-500 mt-1 italic max-w-md truncate">备注: {record.notes}</p>
                    )}
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex space-x-2">
                <button 
                    onClick={() => handleEdit(record)}
                    className="p-2 rounded-full text-emerald-400 hover:bg-gray-600 transition duration-150"
                    title="编辑"
                >
                    <Edit2Icon size={18} />
                </button>
                <button 
                    onClick={() => handleDelete(record._id)}
                    className="p-2 rounded-full text-red-500 hover:bg-gray-600 transition duration-150"
                    title="删除"
                >
                    <Trash2Icon size={18} />
                </button>
            </div>
        </div>
    );
};

// --- 子组件: 围度记录卡片 ---

const MetricRecordCard: React.FC<{ 
    metric: MetricRecord; 
    handleEdit: (metric: MetricRecord) => void;
    handleDelete: (id: string) => void;
}> = ({ metric, handleEdit, handleDelete }) => {
    
    const measurements = [
        { label: '胸', value: metric.chestCm },
        { label: '臂', value: metric.armCm },
        { label: '腰', value: metric.waistCm },
    ];
    
    return (
        <div className={`
            p-4 rounded-xl shadow-lg border border-gray-700/50 bg-gray-800
            transition duration-300 hover:bg-gray-700/70
            flex justify-between items-center
        `}>
            {/* Left Info: Date and Measurements */}
            <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full bg-indigo-600 text-white`}>
                    <TapeMeasureIcon size={16} />
                </div>
                <div>
                    <div className="font-semibold text-white mb-1">
                        围度记录: {metric.date}
                    </div>
                    <div className="text-sm text-gray-400 flex space-x-3">
                        {measurements.map((m, index) => (
                            <span key={index}>
                                {m.label}: <span className='text-indigo-400 font-bold'>{m.value.toFixed(1)}</span> CM
                            </span>
                        ))}
                        <span>
                            体重: <span className='text-emerald-400 font-bold'>{(metric.weightKg ?? 0).toFixed(1)}</span> KG
                        </span>
                    </div>
                    {metric.notes && (
                        <p className="text-xs text-gray-500 mt-1 italic max-w-md truncate">备注: {metric.notes}</p>
                    )}
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex space-x-2">
                <button 
                    onClick={() => handleEdit(metric)}
                    className="p-2 rounded-full text-indigo-400 hover:bg-gray-600 transition duration-150"
                    title="编辑"
                >
                    <Edit2Icon size={18} />
                </button>
                <button 
                    onClick={() => handleDelete(metric._id)}
                    className="p-2 rounded-full text-red-500 hover:bg-gray-600 transition duration-150"
                    title="删除"
                >
                    <Trash2Icon size={18} />
                </button>
            </div>
        </div>
    );
};

export default App;
