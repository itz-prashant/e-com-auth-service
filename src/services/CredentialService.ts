import bcrypt from "bcrypt";

export class CredentialService {
    async comparePasssword(userPassword: string, passwordHash: string) {
        return await bcrypt.compare(userPassword, passwordHash);
    }
}
