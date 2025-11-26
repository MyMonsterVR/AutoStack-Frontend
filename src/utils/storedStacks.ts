import { GUID } from "./global";
import { StackInfo } from "./Api/Stacks";

type Subscriber = () => void;

export const stackInfo: Map<string, StackInfo> = new Map();

const subscribers = new Set<Subscriber>();

export const subscribeStacks = (callback: Subscriber) => {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
};

const notifySubscribers = () => {
    subscribers.forEach(cb => cb());
};

export const addToStacks = (key: GUID, info: StackInfo) => {
    stackInfo.set(key.toString(), info);
    notifySubscribers();
};

export const getStackInfo = (key: GUID): StackInfo | undefined => {
    return stackInfo.get(key);
};
