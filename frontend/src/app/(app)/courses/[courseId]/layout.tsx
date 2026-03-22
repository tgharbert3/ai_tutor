type Params = Promise<{ courseId: string }>

export default async function Layout({
    children,
    params,
}: {
    children: React.ReactNode, 
    params: Params,
}) {
    const { courseId} = await params;
    console.log(courseId);
     return (
        <div className="flex flex-col min-h-screen">
            <section className="text-2xl mx-15 font-semibold p-3 py-5 border-b-2">class name</section>
            <div className="flex mt-5 flex-1">
                <section className="shrink-0 w-48 flex justify-center border-r-2">tabs</section>
                <section className="flex-1 flex justify-center">{children}</section>
            </div>
        </div>
    );
}