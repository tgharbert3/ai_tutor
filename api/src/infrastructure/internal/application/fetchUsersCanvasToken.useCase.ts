import type { ClientApiPortFactory } from "../fetch.port.js";

export class FetchUsersCanvasToken {
    constructor(
        private readonly fetchClientFactory: ClientApiPortFactory,
    ) {};

    async execute(userId: string): Promise<string> {
        const client = this.fetchClientFactory.create(userId);
        return await client.getUsersCanvasToken();
    };
}