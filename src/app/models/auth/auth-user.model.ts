export interface AuthUser {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
    // ...

    token?: string;
    refreshToken?: string;
}
