const envBase = process.env.REACT_APP_API_BASE_URL;

function ensureApiSuffix(url: string): string {
    const trimmed = url.replace(/\/+$/, ''); // remove trailing slashes
    if (trimmed.toLowerCase().endsWith('/api')) {
        return trimmed;
    }
    return `${trimmed}/api`;
}

export const API_BASE_URL = envBase
    ? ensureApiSuffix(envBase)
    : 'https://autostack.dk/api';

export default API_BASE_URL;
