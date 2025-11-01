// src/types/Training.ts

export interface TrainingRecord {
  _id?: string;
  
  type: 'Running' | 'Cycling' | 'Weightlifting' | 'Yoga' | 'Other';
  date: string; // YYYY-MM-DD
  
  durationMinutes: number;
  distanceKm?: number;
  sets?: number;
  reps?: number;
  weightKg?: number;
  
  notes?: string;
  
  createdAt?: Date; 
}
// src/types/Training.d.ts (添加以下内容)

// ----------------------------------------------------
// Data API 接口定义
// ----------------------------------------------------
export interface DataAPI {
  find: (collection: string, query: object) => Promise<any[]>;
  insert: (collection: string, doc: object) => Promise<any>;
  update: (collection: string, query: object, update: object, options: object) => Promise<number>;
  remove: (collection: string, query: object, options: object) => Promise<number>;
}

// ----------------------------------------------------
// 全局 window 声明
// ----------------------------------------------------
declare global {
  interface Window {
    api: DataAPI;
  }
}