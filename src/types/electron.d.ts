import { ElectronAPI } from './data';
import { ThemeAPI } from '../../electron/preload';

declare global {
  interface Window {
    api: ElectronAPI;
    theme: ThemeAPI;
  }
}
