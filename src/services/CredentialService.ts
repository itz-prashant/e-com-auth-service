import bcrypt from "bcryptjs";

export class CredentialService {
    async comparePasssword(userPassword: string, passwordHash: string) {
        return await bcrypt.compare(userPassword, passwordHash);
    }
}
