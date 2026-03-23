import { cookies } from "next/headers";

export async function getCourseTabs(canvasCourseId: string): Promise<string[]> {
    const cookiesStore = await cookies();
    const cookieHeader = cookiesStore.toString();

    const response = await fetch(`http://localhost:3600/api/v1/courseTabs/${canvasCourseId}`, {
        headers: {
            Cookie: cookieHeader,
        }
    });
    if (!response.ok) {
        throw new Error("Failed to fetch courseTabs")
    }

    return response.json();
}

export async function getCourseSyllabus(canvasCourseId: string): Promise<string> {
    const cookiesStore = await cookies();
    const cookieHeader = cookiesStore.toString();

    const response = await fetch(`http://localhost:3600/api/v1/courseSyllabus/${canvasCourseId}`, {
        headers: {
            Cookie: cookieHeader,
        }
    });
    if (!response.ok) {
        throw new Error("Failed to fetch courseTabs")
    }

    return response.json();
}