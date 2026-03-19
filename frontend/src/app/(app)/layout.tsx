import "@/globals.css";
import NavBar from "./_components/navbar";
import { getCourses } from "./dashboard/data";
import SyncData from "./_components/syncData";


export default async function Layout({
    children,
}: {
    children: React.ReactNode
}) {

    const coursesArray = await getCourses();
    return(
        <html lang="en" data-theme="slate-scholar">
            <body>
                <main>
                <div className="flex min-h-screen bg-background">
                            <section className="shrink-0 w-24">
                                <NavBar courses={coursesArray}/>
                            </section>
                            <section className="flex-1">
                                {children}
                            </section>
                            <section className="w-56 flex flex-col items-center m-8 shrink-0">
                                <SyncData />
                            </section>
                        </div>
                </main>
            </body>
        </html>
    )
}