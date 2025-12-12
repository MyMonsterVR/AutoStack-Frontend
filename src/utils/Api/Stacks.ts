import axios from "axios";
import { GUID } from "../global";
import axiosInstance from "./axiosConfig";
import { API_BASE_URL } from "./config";

export type StackType = "FRONTEND" | "BACKEND" | "FULLSTACK";

export enum SortingOrder {
    ASC,
    DESC,
}

export enum SortBy
{
    Popularity,
    PostedDate,
}

export interface PackageInfo {
    name: string;
    link: string;
    isVerified?: boolean;
}

export interface StackInfoType {
    id: GUID,
    name: string,
    description: string
    type: StackType,
    downloads: number,
    createdAt: string,
    packages: PackageInfo[],
    userId: GUID,
    username: string,
    userAvatarUrl: string
}

export interface StackResponseSuccess {
    success: boolean;
    data: {
        items: StackInfoType[];
        totalCount: number;
        pageNumber: number;
        pageSize: number;
        totalPages: number;
        hasPreviousPage: boolean;
        hasNextPage: boolean;
    }
}

interface StackResponseError {
    success: boolean;
    message: string,
    errors: Record<string, string>
}

export type StackResponse = StackResponseSuccess | StackResponseError;

export const fetchStacks = async (
    sortBy?: SortBy,
    sortOrder?: SortingOrder,
    stackType?: StackType,
    pageNumber?: number,
    pageSize?: number
): Promise<StackResponse> => {
    try {
        const params = new URLSearchParams();

        if (sortBy !== undefined) params.append('StackSortBy', sortBy.toString());
        if (sortOrder !== undefined) params.append('SortingOrder', sortOrder.toString());
        if (stackType !== undefined) params.append('StackType', stackType.toString());
        if (pageNumber !== undefined) params.append('PageNumber', pageNumber.toString());
        if (pageSize !== undefined) params.append('PageSize', pageSize.toString());

        const queryString = params.toString();
        const url = `${API_BASE_URL}/stack/getStacks${queryString ? `?${queryString}` : ''}`;

        const response = await axios.get<StackResponse>(url);
        return response.data;
    } catch (error: any) {
        return {
            success: false,
            message: error.message,
            errors: {}
        };
    }
};

export const fetchStackById = async (id: GUID): Promise<StackInfoType | null> => {
    try {
        const url = `${API_BASE_URL}/stack/getstack?id=${id}`;
        const response = await axios.get<{ success: boolean; data: StackInfoType }>(url);

        if (response.data.success) {
            return response.data.data;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching stack by ID:', error);
        return null;
    }
};

export const createStack = async (
    name: string,
    description: string,
    type: StackType,
    packages: PackageInfo[]
): Promise<{ success: boolean; message?: string; data?: { id: GUID }; errors?: Record<string, string[]> }> => {
    try {
        const url = `${API_BASE_URL}/stack/create`;
        const response = await axiosInstance.post(url, {
            name,
            description,
            type,
            packages
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.data.success) {
            return { success: true, data: { id: response.data.data.id } };
        } else {
            return { success: false, message: response.data.message, errors: response.data.errors };
        }
    } catch (error: any) {
        // Re-throw 403 errors so useProtectedAction can handle them
        if (error.response?.status === 403) {
            throw error;
        }

        if (error.response?.data) {
            return {
                success: false,
                message: error.response.data.message || error.message,
                errors: error.response.data.errors
            };
        }
        return { success: false, message: error.message };
    }
};

export const fetchVerifiedPackages = async (): Promise<{ success: boolean; data?: PackageInfo[]; message?: string }> => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}/stack/verifiedpackages`);

        if (response.data.success) {
            return { success: true, data: response.data.data };
        } else {
            return { success: false, message: response.data.message };
        }
    } catch (error: any) {
        // Re-throw 403 errors so useProtectedAction can handle them
        if (error.response?.status === 403) {
            throw error;
        }
        return { success: false, message: error.message || 'Failed to fetch verified packages' };
    }
};

export const deleteStack = async (id: GUID): Promise<{ success: boolean; message?: string }> => {
    try {
        const url = `${API_BASE_URL}/stack/deletestack`;
        const response = await axiosInstance.delete(url, {
            headers: { 'Content-Type': 'application/json' },
            data: {
                stackId: id,
                userId: null
            }
        });

        if (response.data.success) {
            return { success: true, message: response.data.message || 'Stack deleted successfully' };
        } else {
            return { success: false, message: response.data.message || 'Failed to delete stack' };
        }
    } catch (error: any) {
        if (error.response?.data) {
            return {
                success: false,
                message: error.response.data.message || error.message
            };
        }
        return { success: false, message: error.message || 'Failed to delete stack' };
    }
}
