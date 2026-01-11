export class PasswordService {
    constructor() {

    }

    static async hashPassword(unsafePassowrd: string): Promise<string> {
        const hashedPassword = await Bun.password.hash(unsafePassowrd, {
            algorithm: "argon2id",
            timeCost: 3,
        });
        return hashedPassword;
    }

    static async comparePassword(password: string, hash: string): Promise<boolean> {
        const isValid = await Bun.password.verify(password, hash);
        if (isValid) {
            return true;
        }
        return false;
    }
}
