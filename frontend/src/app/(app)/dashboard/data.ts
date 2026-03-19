import { cookies } from "next/headers";
import { Course } from "./page";

export async function getCourses(): Promise<Course[]> {
    const cookiesStore = await cookies();
    const cookieHeader = cookiesStore.toString();

    const response = await fetch("http://localhost:3600/api/v1/dashboard", {
        headers: {
            Cookie: cookieHeader,
        }
    });
    if (!response.ok) {
        throw new Error("Failed to fetch dashboard data")
    }

    return response.json();
}