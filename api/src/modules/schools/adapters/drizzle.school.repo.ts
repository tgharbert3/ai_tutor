import { eq } from "drizzle-orm";

import type { db } from "@/lib/types.js";

import { schools } from "@/infrastructure/db/schema.js";

import type { SchoolDto, UpsertSchoolInput } from "../domain/types.js";
import type { SchoolRepositoryPort } from "../ports/school.repo.port.js";

export class DrizzleSchoolRepository implements SchoolRepositoryPort {
    constructor(private db: db) {}

    async upsertSchool(schoolData: UpsertSchoolInput): Promise<SchoolDto> {
        const [school] = await this.db.insert(schools).values(schoolData).returning().onConflictDoUpdate({
            target: schools.canvasBaseUrl,
            set: {
                updated_at: new Date(),
            },
        });

        return {
            schoolId: school.id,
            canvasBaseUrl: school.canvasBaseUrl,
            schoolColor: school.schoolColor,
        };
    };

    async fetchOneSchoolByUrl(url: string): Promise<SchoolDto> {
        const [school] = await this.db.select({
            schoolId: schools.id,
            canvasBaseUrl: schools.canvasBaseUrl,
            schoolColor: schools.schoolColor,
        })
            .from(schools)
            .where(eq(schools.canvasBaseUrl, url));
        return school;
    }
}