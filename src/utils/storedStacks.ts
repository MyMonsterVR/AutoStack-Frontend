export type Type = "Frontend" | "Backend" | "Fullstack";

export interface StackInfo {
    id: number,
    name: string,
    author: string,
    authorImg: string,
    downloads: number,
    description: string,
    type: Type
}

export const stackInfo: Map<string, StackInfo> = new Map();

export const addToStacks = (key: number, info: StackInfo) => {
    stackInfo.set(key.toString(), info);
}

export const getStackInfo = (key: number): StackInfo | undefined => {
    console.log(stackInfo);
    return stackInfo.get(key.toString());
}