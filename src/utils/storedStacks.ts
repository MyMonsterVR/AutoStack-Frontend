import { GUID } from "./global";
import { StackInfoType } from "./Api/Stacks";

export const stackInfo: Map<string, StackInfoType> = new Map();

export const addToStacks = (key: GUID, info: StackInfoType) => {
    stackInfo.set(key.toString(), info);
};

export const getStackInfo = (key: GUID): StackInfoType | undefined => {
    return stackInfo.get(key);
};

export const clearStacks = () =>
{
    stackInfo.clear();
}
