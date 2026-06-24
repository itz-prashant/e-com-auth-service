import { Request } from "express";

export type UserData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

export interface RegisterUserRequest extends Request {
    body: UserData;
}

export interface AuthRequest extends Request {
    auth: {
        sub: string;
        role: number;
    };
}
