import type { InsertSchool, SchoolDto } from "../domain/types.js";

export interface SchoolRepositoryPort {
    upsertSchool: (school: InsertSchool) => Promise<SchoolDto>;
    fetchOneSchoolByUrl: (url: string) => Promise<SchoolDto>;
};