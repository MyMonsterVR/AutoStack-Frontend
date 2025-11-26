import axios from "axios";
import { GUID } from "../global";

export enum StackType
{
    FRONTEND,
    BACKEND,
    FULLSTACK
}

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
    packageName: string;
    packageLink: string;
    isVerified: boolean;
}

export interface StackInfo {
    id: GUID,
    name: string,
    description: string
    type: number|"FRONTEND"|"BACKEND"|"FULLSTACK",
    downloads: number,
    stackInfo: PackageInfo[]
}

export interface StackResponseSuccess {
    success: boolean;
    data: {
        items: StackInfo[];
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
        const url = `/api/stack/getStacks${queryString ? `?${queryString}` : ''}`;

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