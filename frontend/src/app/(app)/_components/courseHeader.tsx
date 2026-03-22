import { getCourses } from "../dashboard/data";

type Props = {
    canvasCourseId: number;
}
export default async function CourseHeader(props: Props) {
    const courses = await getCourses();
    const [course] = courses.filter(element => element.canvasCourseId === props.canvasCourseId)
    
    return (
        <section className="text-2xl mx-15 font-semibold p-3 py-5 border-b-2">{course.courseCode}</section>
    )
}