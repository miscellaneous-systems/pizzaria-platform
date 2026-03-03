export interface User {
    id: string;
    name: string;
    email: string;
    role: 'STAFF' | 'ADMIN';
    createdAt?: String;
}

export interface LoginResponse {
    id: string;
    name: string;
    email: string;
    role: 'STAFF' | 'ADMIN';
    token: string;
}

export interface Category {
    id: string;
    name: string;
    createdAt: String;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    category_id: string;
    createdAt: String;
    category?: Category;
    banner: string;
    disabled: boolean;
}

export interface Order {
    id: string;
    table: number;
    name?: string | null;
    status: boolean;
    draft: boolean;
    createdAt: string;
    items?: Item[];
}


export interface Item {
    id: string;
    amount: number;
    createdAt: String;
    order_id: string;
    product_id: string;
    product: Product;
}

export interface CreateOrderRequest {
    table: number;
    name?: string;
}

export interface AddItemRequest {
    id: string;
    product_id: string;
    amount: number;
}

export interface SendOrderRequest {
    order_id: string;
}

