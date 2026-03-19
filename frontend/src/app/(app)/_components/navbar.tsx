import { Book, LayoutDashboard } from "lucide-react"
import mentoraLogo from "../../../../public/mentora_logo_transparent.png"
import Link from "next/link"


import Image from "next/image"
import { CoursesDrawer } from "./coursesDrawer"
import { Course } from "../dashboard/page"

type Props = {
    courses: Course[]
}
export default function NavBar({courses}: Props) {
    return (
        <nav className="flex flex-col min-h-screen bg-slate-700 items-center">
            <Link href={"/dashboard"}>
                <Image 
                src={mentoraLogo}
                alt="Mentora Logo"
                className=" h-auto w-28 bg-slate-700"
                />
            </Link>
            <ul className="w-full text-center">
                <li className="text-white my-15 ">
                    <Link href={"/dashboard"} className="flex items-center flex-col">
                        <span><LayoutDashboard  /></span>
                        <span>Dashboard</span>
                    </Link>
                    
                </li>
                <li className="text-white my-15 ">
                    <div className="flex flex-col items-center">
                        <Book  />
                        <span><CoursesDrawer courses={courses}/></span>
                    </div>
                </li>
            </ul>
        </nav>
    )
}