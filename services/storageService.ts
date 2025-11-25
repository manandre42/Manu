import { MenuItem, RestaurantInfo } from '../types';
import { INITIAL_MENU, INITIAL_RESTAURANT_INFO } from '../constants';

const MENU_KEY = 'menufacil_items';
const INFO_KEY = 'menufacil_info';
const VIEWS_KEY = 'menufacil_views';

export const storageService = {
  getMenu: (): MenuItem[] => {
    const stored = localStorage.getItem(MENU_KEY);
    if (!stored) {
      localStorage.setItem(MENU_KEY, JSON.stringify(INITIAL_MENU));
      return INITIAL_MENU;
    }
    return JSON.parse(stored);
  },

  saveMenu: (menu: MenuItem[]) => {
    localStorage.setItem(MENU_KEY, JSON.stringify(menu));
  },

  getRestaurantInfo: (): RestaurantInfo => {
    const stored = localStorage.getItem(INFO_KEY);
    if (!stored) {
        localStorage.setItem(INFO_KEY, JSON.stringify(INITIAL_RESTAURANT_INFO));
        return INITIAL_RESTAURANT_INFO;
    }
    return JSON.parse(stored);
  },

  saveRestaurantInfo: (info: RestaurantInfo) => {
      localStorage.setItem(INFO_KEY, JSON.stringify(info));
  },

  incrementViews: () => {
      const today = new Date().toISOString().split('T')[0];
      const views = JSON.parse(localStorage.getItem(VIEWS_KEY) || '{}');
      views[today] = (views[today] || 0) + 1;
      localStorage.setItem(VIEWS_KEY, JSON.stringify(views));
  },

  getTodayViews: (): number => {
      const today = new Date().toISOString().split('T')[0];
      const views = JSON.parse(localStorage.getItem(VIEWS_KEY) || '{}');
      return views[today] || 0;
  }
};