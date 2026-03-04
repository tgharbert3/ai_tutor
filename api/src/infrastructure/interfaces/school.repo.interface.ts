import type { InsertSchool, SchoolDto } from "@/modules/ingestion/schools/domain/types.js";

export interface ISchoolRepository {
    upsertSchool: (school: InsertSchool) => Promise<SchoolDto>;
    fetchOneSchoolByUrl: (url: string) => Promise<SchoolDto>;
};