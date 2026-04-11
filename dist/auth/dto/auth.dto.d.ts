export declare class LoginDto {
    email: string;
    password: string;
}
export declare class RequestOtpDto {
    email: string;
}
export declare class VerifyOtpDto {
    email: string;
    otp: string;
}
export declare class SetPasswordDto {
    email: string;
    otp: string;
    password: string;
}
export declare class RefreshTokenDto {
    refresh_token: string;
}
