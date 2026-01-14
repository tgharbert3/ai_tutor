export class PasswordService {
    static async hashPassword(unsafePassowrd: string): Promise<string> {
        return await Bun.password.hash(unsafePassowrd, {
            algorithm: "argon2id",
            timeCost: 3,
        });
    }

    static async comparePassword(password: string, hash: string): Promise<boolean> {
        return await Bun.password.verify(password, hash);
    }
}
