import { GUID } from "./global";
import { StackInfoType } from "./Api/Stacks";

type Subscriber = () => void;

export const stackInfo: Map<string, StackInfoType> = new Map();

const subscribers = new Set<Subscriber>();

export const subscribeStacks = (callback: Subscriber) => {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
};

const notifySubscribers = () => {
    subscribers.forEach(cb => cb());
};

export const addToStacks = (key: GUID, info: StackInfoType) => {
    stackInfo.set(key.toString(), info);
    notifySubscribers();
};

export const getStackInfo = (key: GUID): StackInfoType | undefined => {
    return stackInfo.get(key);
};

export const clearStacks = () =>
{
    stackInfo.clear();
}
