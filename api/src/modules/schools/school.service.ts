import type { insertSchools } from "@/db/schema.js";

import type { SchoolRepository } from "./school.repo.js";

import { fetchSchoolPrimaryColor } from "./school.client.js";

export class SchoolService {
    constructor(
        private readonly repo: SchoolRepository,
        private readonly apiToken: string,
        private readonly canvasBaseUrl: string,
    ) {};

    async upsertSchool(schoolData: insertSchools) {
        return await this.repo.upsertSchool(schoolData);
    };

    async ensureSchoolExistsFacade() {
        const [schoolInfo] = await this.repo.fetchOneSchoolByUrl(this.canvasBaseUrl);
        if (schoolInfo) {
            return schoolInfo;
        };
        const color = await fetchSchoolPrimaryColor(this.apiToken, this.canvasBaseUrl);
        const school: insertSchools = {
            canvasBaseUrl: this.canvasBaseUrl,
            schoolColor: color,
        };
        const [newSchool] = await this.repo.upsertSchool(school);
        return newSchool;
    }

    static normalizeCanvasUrl(rawUrl: string) {
        const urlString = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;
        try {
            const parsedUrl = new URL(urlString);
            return parsedUrl.origin;
        }
        catch (error: any) {
            throw new Error(`Unable to parse URL: ${error.message}`);
        }
    };

    static buildCanvasUrl(origin: string, path: string) {
        return new URL(`/api/v1/${path}`, origin);
    }
}