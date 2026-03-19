import { cookies } from "next/headers";
import ClassCard from "../_components/classCard";
import DashboardHeader from "../_components/dashboardHeader";
import SyncData from "../_components/syncData";

type Course = {
    courseCode: string;
    name: string;
    canvasCourseId: number;
}

export default async function Page() {
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
    const coursesArray = await response.json()
    console.log(coursesArray);

    return (
        <div className="p-6">
            <div className="w-full p-4">
                <DashboardHeader />
                <SyncData />
            </div>
            <div className="pt-4">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(262px,1fr))] gap-6">
                   {coursesArray.map((course: Course) => <ClassCard courseCode={course.courseCode} name={course.name} key={course.canvasCourseId}/>)}
                </div>
            </div>
        </div> 
    )
}