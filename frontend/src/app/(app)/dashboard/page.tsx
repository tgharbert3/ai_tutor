import ClassCard from "../_components/classCard";
import DashboardHeader from "../_components/dashboardHeader";
import { getCourses } from "./data";


export type Course = {
    courseCode: string;
    name: string;
    canvasCourseId: number;
}

export default async function Page() {
    const coursesArray = await getCourses();

    return (
        <div className="p-6">
            <div className="w-full p-4">
                <DashboardHeader />
            </div>
             <div className="pt-4">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(262px,1fr))] gap-6">
                    {coursesArray.map((course: Course) => <ClassCard courseCode={course.courseCode} name={course.name} key={course.canvasCourseId}/>)}
                </div>
            </div>
        </div> 
           
    )
}