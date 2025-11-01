import { DataAPI } from '../types/data';

/**
 * Web 存储后备方案（用于移动端/浏览器无 Electron API 时）
 * 实现了 DataAPI 接口，使用 localStorage 模拟数据库操作。
 */
export const webStore: DataAPI = {
  find: async (collection: string, _query: object) => {
    const key = collection === 'training' ? 'training' : 'metrics';
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
      return [];
    }
  },
  insert: async (collection: string, doc: any) => {
    const key = collection === 'training' ? 'training' : 'metrics';
    const load = () => {
      try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
    };
    const save = (data: any[]) => localStorage.setItem(key, JSON.stringify(data));
    const ensureId = (d: any) => ({ _id: d._id || Math.random().toString(36).slice(2), ...d });

    const list = load();
    const withId = ensureId({ ...doc, createdAt: doc.createdAt || new Date() });
    list.push(withId);
    save(list);
    return withId;
  },
  update: async (collection: string, query: any, update: any) => {
    const key = collection === 'training' ? 'training' : 'metrics';
    const load = () => {
      try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
    };
    const save = (data: any[]) => localStorage.setItem(key, JSON.stringify(data));

    const list = load();
    let count = 0;
    const next = list.map((item: any) => {
      if (item._id && query._id && item._id === query._id) {
        count += 1;
        return { ...item, ...(update.$set || update) };
      }
      return item;
    });
    save(next);
    return count;
  },
  remove: async (collection: string, query: any) => {
    const key = collection === 'training' ? 'training' : 'metrics';
    const load = () => {
      try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
    };
    const save = (data: any[]) => localStorage.setItem(key, JSON.stringify(data));

    const list = load();
    const next = list.filter((item: any) => !(item._id && query._id && item._id === query._id));
    const removed = list.length - next.length;
    save(next);
    return removed;
  },
};