import { AuthService } from "../auth/auth.service.js";

export class ServiceContainer {
    private readonly authService;
    constructor() {
        this.authService = new AuthService();
    }

    get getAuthService() {
        return this.authService;
    }
};
