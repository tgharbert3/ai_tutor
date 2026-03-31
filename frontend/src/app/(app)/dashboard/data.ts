import { cookies } from "next/headers";
import { Course } from "./page";
import { redirect } from "next/navigation";

export async function getCourses(): Promise<Course[]> {
    const cookiesStore = await cookies();
    const cookieHeader = cookiesStore.toString();

    const response = await fetch("http://localhost:3600/api/v1/dashboard", {
        headers: {
            Cookie: cookieHeader,
        }
    });
    if (response.status === 401) {
            redirect("/login")
        }
    if (!response.ok) {
        throw new Error("Failed to fetch dashboard data")
    }

    return response.json();
}