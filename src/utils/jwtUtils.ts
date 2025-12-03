interface JwtPayload {
    exp?: number;
    iat?: number;
    jti?: string;
    nameidentifier?: string;
}

export const decodeJwt = (token: string): JwtPayload | null => {
    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;

        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
};

export const isTokenExpired = (token: string): boolean => {
    const payload = decodeJwt(token);
    if (!payload || !payload.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
};

export const getTokenExpirationTime = (token: string): Date | null => {
    const payload = decodeJwt(token);
    if (!payload || !payload.exp) return null;

    return new Date(payload.exp * 1000);
};

export const shouldRefreshToken = (token: string, bufferSeconds: number = 60): boolean => {
    const payload = decodeJwt(token);
    if (!payload || !payload.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp - currentTime < bufferSeconds;
};
