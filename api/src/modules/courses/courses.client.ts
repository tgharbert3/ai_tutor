export async function fetchCoursesFromCanvas(API_TOKEN: string, canvasBaseUrl: string) {
    try {
        const courses = await fetch(`${canvasBaseUrl}/courses?per_page=75&include[]=syllabus_body`, {
            method: "GET",
            headers: { Authorization: `Bearer ${API_TOKEN}` },
        });
        return courses.json();
    }
    catch (error: any) {
        console.error(error);
        throw new Error("Unable to fetch courses from canvas");
    }
};

export async function fetchUserEnrollmetnsFromCanvas(API_TOKEN: string, canvasBaseUrl: string) {
    try {
        const enrollments = await fetch(`${canvasBaseUrl}/`);
    }
    catch (error: any) {
        console.error(error.message);
        throw new Error("Unable to fetch user enrollments fro, canvas");
    }
}