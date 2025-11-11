import type { DataAPI } from '../types/data';

/**
 * Web 存储后备方案（用于移动端/浏览器无 Electron API 时）
 * 实现了 DataAPI 接口，使用 localStorage 模拟数据库操作。
 */
export const webStore: DataAPI = {
  find: async (collection: string, _query: object) => {
    let key = '';
    if (collection === 'training') {
      key = 'training';
    } else if (collection === 'metrics') {
      key = 'metrics';
    } else if (collection === 'trainingPlan') {
      key = 'trainingPlan';
    } else {
      return []; // Unknown collection
    }
    try {
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      console.log(`webStore.find: Collection: ${collection}, Found:`, list);
      return list;
    } catch (e) {
      console.error(`webStore.find: Error parsing localStorage for ${collection}:`, e);
      return [];
    }
  },
  insert: async (collection: string, doc: any) => {
    let key = '';
    if (collection === 'training') {
      key = 'training';
    } else if (collection === 'metrics') {
      key = 'metrics';
    } else if (collection === 'trainingPlan') {
      key = 'trainingPlan';
    } else {
      throw new Error('Unknown collection');
    }
    const load = () => {
      try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
    };
    const save = (data: any[]) => localStorage.setItem(key, JSON.stringify(data));
    const ensureId = (d: any) => ({ _id: d._id || Math.random().toString(36).slice(2), ...d });

    const list = load();
    const withId = ensureId({ ...doc, createdAt: doc.createdAt || new Date() });
    console.log(`webStore.insert: Collection: ${collection}, Item with ID:`, withId);
    list.push(withId);
    save(list);
    return withId;
  },
  update: async (collection: string, query: any, update: any) => {
    let key = '';
    if (collection === 'training') {
      key = 'training';
    } else if (collection === 'metrics') {
      key = 'metrics';
    } else if (collection === 'trainingPlan') {
      key = 'trainingPlan';
    } else {
      throw new Error('Unknown collection');
    }
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
    let key = '';
    if (collection === 'training') {
      key = 'training';
    } else if (collection === 'metrics') {
      key = 'metrics';
    } else if (collection === 'trainingPlan') {
      key = 'trainingPlan';
    } else {
      throw new Error('Unknown collection');
    }
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

  clearCollection: async (collection: string) => {
    let key = '';
    if (collection === 'training') {
      key = 'training';
    } else if (collection === 'metrics') {
      key = 'metrics';
    } else if (collection === 'trainingPlan') {
      key = 'trainingPlan';
    } else {
      throw new Error('Unknown collection');
    }
    localStorage.removeItem(key);
    return 1; // Indicate that something was "removed"
  },

  bulkInsert: async (collection: string, docs: any[]) => {
    let key = '';
    if (collection === 'training') {
      key = 'training';
    } else if (collection === 'metrics') {
      key = 'metrics';
    } else if (collection === 'trainingPlan') {
      key = 'trainingPlan';
    } else {
      throw new Error('Unknown collection');
    }
    const ensureId = (d: any) => ({ _id: d._id || Math.random().toString(36).slice(2), ...d });
    const docsWithIds = docs.map(doc => ensureId({ ...doc, createdAt: doc.createdAt || new Date() }));
    localStorage.setItem(key, JSON.stringify(docsWithIds));
    return docsWithIds;
  },
};
