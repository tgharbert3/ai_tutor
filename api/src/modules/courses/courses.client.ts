import { SchoolService } from "../schools/school.service.js";

export async function fetchCoursesFromCanvas(API_TOKEN: string, canvasBaseUrl: string) {
    const builtUrl = SchoolService.buildCanvasUrl(canvasBaseUrl, "courses?per_page=75&include[]=syllabus_body");
    try {
        const courses = await fetch(builtUrl, {
            method: "GET",
            headers: { Authorization: `Bearer ${API_TOKEN}` },
        });
        return await courses.json();
    }
    catch (error: any) {
        console.error(error);
        throw new Error("Unable to fetch courses from canvas");
    }
};