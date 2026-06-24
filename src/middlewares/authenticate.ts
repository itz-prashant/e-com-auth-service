import { Request } from "express";
import { expressjwt, GetVerificationKey } from "express-jwt";
import { CONFIG } from "../config";
import jwksClient from "jwks-rsa";

export default expressjwt({
    secret: jwksClient.expressJwtSecret({
        jwksUri: CONFIG.JWKS_URI!,
        cache: true,
        rateLimit: true,
    }) as GetVerificationKey,

    algorithms: ["RS256"],

    getToken(req: Request) {
        const authHeader = req.headers.authorization;
        // console.log("auth", authHeader)
        if (authHeader && authHeader.split(" ")[1] !== "undefined") {
            const token = authHeader.split(" ")[1];

            if (token) {
                return token;
            }
        }

        type AuthCookie = {
            accessToken: string;
        };

        const { accessToken } = req.cookies as AuthCookie;
        return accessToken;
    },
});
