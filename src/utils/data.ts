/**
 * 规范化训练项目名称，移除括号及其内容。
 * @param name 原始名称
 * @returns 规范化后的名称
 */
export const normalizeActivity = (name: string) => name.replace(/\s*\([^)]*\)\s*$/, '');