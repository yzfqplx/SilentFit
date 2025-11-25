import { invoke } from '@tauri-apps/api/core';

// Data API
export const dataApi = {
  find: (collection: string, query: object) => invoke('nedb_find', { collection, query }),
  insert: (collection: string, doc: object) => invoke('nedb_insert', { collection, doc }),
  update: (collection: string, query: object, update: object, options: object) => invoke('nedb_update', { collection, query, update, options }),
  remove: (collection: string, query: object, options: object) => invoke('nedb_remove', { collection, query, options }),
  clearCollection: (collection: string) => invoke('nedb_clear_collection', { collection }),
  bulkInsert: (collection: string, docs: any[]) => invoke('nedb_bulk_insert', { collection, docs }),
};

// Theme API
export const themeApi = {
  set: (theme: string) => invoke('theme_set', { theme }),
  get: () => invoke('theme_get'),
};

// File API
export const fileApi = {
  exportData: (data: string, filename: string) => invoke<string>('export_data', { data, filename }),
  shareFile: (filePath: string, title: string, text: string) => invoke('share_file', { filePath, title, text }),
};