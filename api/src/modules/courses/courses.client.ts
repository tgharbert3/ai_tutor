import env from "@/env.js";

export async function fetchCoursesFromCanvas() {
    try {
        const courses = await fetch(`${env.CANVAS_BASE_URL}/courses?per_page=75&include[]=syllabus_body`, {
            method: "GET",
            headers: { Authorization: `Bearer ${env.API_TOKEN}` },
        });
        return courses.json();
    }
    catch (error: any) {
        console.error(error);
        throw new Error("Unable to fetch courses from canvas");
    }
}
