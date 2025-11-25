export type Category = 'Entradas' | 'Pratos Principais' | 'Bebidas' | 'Sobremesas';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  imageUrl?: string;
  available: boolean;
  prepTime?: number; // in minutes
  isVegetarian?: boolean;
  isSpicy?: boolean;
  isGlutenFree?: boolean;
}

export interface RestaurantInfo {
  name: string;
  slogan?: string; // New
  category?: string; // New
  phone: string;
  address: string;
  wifiName?: string;
  wifiPassword?: string;
}

export interface SalesStat {
    date: string;
    views: number;
    itemsActive: number;
}

export type RequestStatus = 'pending' | 'completed';

export interface WaiterRequest {
    id: string;
    tableId: string;
    timestamp: number;
    status: RequestStatus;
    type: 'call_waiter' | 'bill';
}

export interface CartItem extends MenuItem {
    quantity: number;
    observation?: string;
}

export interface Order {
    id: string;
    tableId: string;
    customerName?: string; // Added customer name
    items: CartItem[];
    total: number;
    status: 'pending' | 'preparing' | 'ready' | 'delivered';
    timestamp: number;
}