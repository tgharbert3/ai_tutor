import type { Enrollment } from "@/lib/types.js";

import { SchoolService } from "../schools/school.service.js";

export async function fetchUserEnrollmentsFromCanvas(API_TOKEN: string, canvasBaseUrl: string): Promise<Enrollment[]> {
    const builtUrl = SchoolService.buildCanvasUrl(canvasBaseUrl, "users/self/enrollments");
    try {
        const enrollments = await fetch(builtUrl, {
            method: "GET",
            headers: { Authorization: `Bearer ${API_TOKEN}` },
        });
        return await enrollments.json();
    }
    catch (error: any) {
        console.error(error.message);
        throw new Error("Unable to fetch user enrollments fro, canvas");
    }
}