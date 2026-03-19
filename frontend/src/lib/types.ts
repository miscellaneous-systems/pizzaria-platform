export interface User {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "STAFF";
    createdAt: string;
}

export interface AuthResponse {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "STAFF";
    token: string;
}

export interface Category{
    id: string,
    name: string,
    createdAt: string;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    banner: string;
    disabled: boolean;
    category_id: string;
    category?: {
        id: string;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface Item {
    id: string;
    amount: number;
    product: {
        id: string;
        name: string;
        price: number;
        description: string;
        banner: string;
    }
}

export interface Order {
    id: string;
    table: number;
    name?: string;
    status: boolean;
    draft: boolean;
    paymentMethod?: string;
    tip?: number;
    createdAt: string;
    items?: Item[];
}

export interface OrderWithTotal {
    id: string;
    table: number;
    name: string | null;
    total: number;
    paymentMethod: string;
    tip: number;
    createdAt: string;
}

export interface DailyCashFlow {
    date: string;
    total: number;
    totalMoney: number;
    totalPix: number;
    totalCard: number;
    totalTip: number;
    ordersCount: number;
    orders: OrderWithTotal[];
}
