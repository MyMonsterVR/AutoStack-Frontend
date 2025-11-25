export type Type = "Frontend" | "Backend" | "Fullstack";

export interface TemplateInfo {
    id: number,
    name: string,
    author: string,
    authorImg: string,
    downloads: number,
    description: string,
    type: Type
}

export const templateInfo: Map<string, TemplateInfo> = new Map();

export const addToTemplates = (key: number, info: TemplateInfo) => {
    templateInfo.set(key.toString(), info);
}

export const getToTemplates = (key: number): TemplateInfo | undefined => {
    return templateInfo.get(key.toString());
}