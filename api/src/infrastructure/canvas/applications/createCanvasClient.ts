import type { IIngestionRunRepository } from "@/infrastructure/interfaces/ingestionRun.interface.js";
import type { ClientApiPortFactory } from "@/infrastructure/internal/fetch.port.js";

import { FetchUsersCanvasToken } from "@/infrastructure/internal/application/fetchUsersCanvasToken.useCase.js";

import type { CanvasApiPort, CanvasApiPortFactory } from "../ports/canvas.api.port.js";

export class CreateCanvasClient {
    private readonly fetchUsersCanvasToken: FetchUsersCanvasToken;
    constructor(
        private readonly ingestionRuns: IIngestionRunRepository,
        private readonly canvasFactory: CanvasApiPortFactory,
        private readonly clientFactory: ClientApiPortFactory,
    ) {
        this.fetchUsersCanvasToken = new FetchUsersCanvasToken(this.clientFactory);
    }

    async execute(ingestionRunId: string, schoolId: number): Promise<CanvasApiPort> {
        const { userId, canvasBaseUrl } = await this.ingestionRuns.fetchUserIdAndUrl(ingestionRunId, schoolId);
        const usersCanvasToken = await this.fetchUsersCanvasToken.execute(userId);
        const canvasClient = this.canvasFactory.create({ apiToken: usersCanvasToken, canvasBaseUrl });
        return canvasClient;
    };
}