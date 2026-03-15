import "@/globals.css"

import NavBar from "./_components/navbar"

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return(
        <html lang="en" data-theme="slate-scholar">
            <body>
                <main className=" flex min-h-screen bg-background">
                    <section className="shrink-0">
                        <NavBar />
                    </section>
                    <section className="flex-1">
                        {children}
                    </section>
                    <section className="w-56 flex flex-col items-center m-8 shrink-0">
                        <aside>Aside</aside>
                    </section>
                </main>
            </body>
        </html>
    )
}