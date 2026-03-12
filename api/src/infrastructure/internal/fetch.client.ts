import env from "@/env.js";
import { InternalClientError } from "@/modules/ingestion/ingestionTasks/domain/errors/errorsTypes.js";

import type { ClientApiPort, ClientApiPortFactory } from "./fetch.port.js";

interface CanvasToken { canvasToken: string }
export class FetchClient implements ClientApiPort {
    constructor(
        private readonly userId: string,
    ) {};

    async getUsersCanvasToken(): Promise<string> {
        const respone = await this.get<CanvasToken>(`canvas-credentials/${this.userId}`);
        return respone.canvasToken;
    }

    private async get<T>(path: string): Promise<T> {
        const authHeaders = new Headers();
        authHeaders.append("x-internal-auth", env.INTERNAL_AUTH);
        try {
            const response = await fetch(`https://127.0.0.1:3000/internal/${path}`, {
                headers: authHeaders,
            });

            // TODO: Handle this better
            if (!response.ok) {
                throw new Error("unable to fetch canvas cred");
            }
            return await response.json() as T;
        }
        catch (error: any) {
            console.error("Unable to fetch Users API Token", error);
            throw new InternalClientError(`Failed to fetch users canvas token from auth server: ${error.message}`);
        }
    }
}

export class ClientFactory implements ClientApiPortFactory {
    create(userId: string): ClientApiPort {
        return new FetchClient(userId);
    };
}