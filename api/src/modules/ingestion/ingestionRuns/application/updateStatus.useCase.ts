import type { ingestionStatus } from "../domain/types.js";
import type { IngestionRunPort } from "../ports/ingestionRun.port.js";

export class UpdateIngestionRunStatusUseCase {
    constructor(
        private readonly ingestionRunsRepo: IngestionRunPort,
    ) {};

    async execute(ingestionId: string, newStatus: ingestionStatus): Promise<void> {
        await this.ingestionRunsRepo.updateRunStatus(newStatus, ingestionId);
    }
}