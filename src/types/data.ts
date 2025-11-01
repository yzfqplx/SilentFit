export type Page = 'dashboard' | 'records' | 'metrics' | 'settings';

// 训练记录类型
export interface TrainingRecord {
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
export interface MetricRecord {
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
export interface DataAPI {
  find: (collection: string, query: object) => Promise<any[]>;
  insert: (collection: string, doc: object) => Promise<any>;
  update: (collection: string, query: object, update: object, options: object) => Promise<number>;
  remove: (collection: string, query: object, options: object) => Promise<number>;
}