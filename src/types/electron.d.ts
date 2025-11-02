import { DataAPI, ThemeAPI } from '../../electron/preload';

declare global {
  interface Window {
    api: DataAPI;
    theme: ThemeAPI;
  }
}
