import { EnsureSchoolExists } from "@/modules/schools/applications/useCases/ensureSchoolExists.useCase.js";

import type { InsertUserInput, SyncUserDeps } from "../../types.js";

export class SyncUserUseCase {
    constructor(private deps: SyncUserDeps) {};

    // TODO: add a check for making sure this is only one active run at a time
    async execute() {
        const existingUser = await this.deps.userRepo.fetchOneUserById(this.deps.userId);
        if (existingUser) {
            return await this.deps.ingestionRunRepo.create({
                status: "queued",
                userId: existingUser.id,
                schoolId: existingUser.schoolId,
            });
        }
        const ensureSchoolExists = new EnsureSchoolExists({
            schoolRepo: this.deps.schoolRepo,
            canvasClient: this.deps.canvasClient,
            canvasBaseUrl: this.deps.canvasBaseUrl,
        });
        const schoolInfo = await ensureSchoolExists.execute();
        const userToInsert: InsertUserInput = {
            id: this.deps.userId,
            email: this.deps.email,
            schoolId: schoolInfo.schoolId,
        };

        const upsertedUser = await this.deps.userRepo.upsertUser(userToInsert);
        return await this.deps.ingestionRunRepo.create(
            {
                status: "queued",
                userId: upsertedUser.id,
                schoolId: upsertedUser.schoolId,
            },
        );
    }
}