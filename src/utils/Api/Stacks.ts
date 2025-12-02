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
    Rating,
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
    },
    totalCount: number,
    pageNumber: number,
    pageSize: number,
    totalPages: number,
    hasPreviousPage: false,
    hasNextPage: true,
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
): Promise<{ success: boolean; message?: string; data?: { id: GUID } }> => {
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
            return { success: false, message: response.data.message };
        }
    } catch (error: any) {
        return { success: false, message: error.message };
    }
};
