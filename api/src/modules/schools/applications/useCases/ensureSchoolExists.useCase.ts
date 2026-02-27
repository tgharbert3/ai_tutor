import type { EnsureSchoolExistsDeps, InsertSchool } from "../../domain/types.js";

export class EnsureSchoolExists {
    constructor(
        private deps: EnsureSchoolExistsDeps,
    ) {};

    async execute() {
        const schoolInfo = await this.deps.schoolRepo.fetchOneSchoolByUrl(this.deps.canvasBaseUrl);
        if (schoolInfo) {
            return schoolInfo;
        };
        const primaryColor: string | undefined = await this.deps.canvasClient.getPrimaryColor();
        // Check to see if the api returned the primary color or use the default
        const school: InsertSchool = primaryColor
            ? { canvasBaseUrl: this.deps.canvasBaseUrl, schoolColor: primaryColor }
            : { canvasBaseUrl: this.deps.canvasBaseUrl };

        return await this.deps.schoolRepo.upsertSchool(school);
    }
}