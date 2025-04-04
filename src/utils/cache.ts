export const getRefreshTokenKey = (userId: string) => {
    return 'refresh-token-' + userId;
};

export const getTokenKiotVietKey = () => {
    return 'token-kiot-viet';
};

export const getResetPasswordKey = (name: string) => {
    return 'reset-password-' + name;
};