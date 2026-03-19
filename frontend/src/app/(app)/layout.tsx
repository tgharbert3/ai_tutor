import "@/globals.css"


export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {

    return(
        <html lang="en" data-theme="slate-scholar">
            <body>
                <main>
                        {children}
                </main>
            </body>
        </html>
    )
}