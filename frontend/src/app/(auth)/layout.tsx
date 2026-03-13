import "@/globals.css";
import { Surface, } from "@heroui/react";

import mentora_brand from "../../../public/mentora_brand_transparant.png";

import Image from "next/image";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" data-theme="slate-scholar">
            <body>
                <main className=" grid grid-cols-2 min-h-screen">
                    <section className="bg-background">
                        <div>
                           <Image 
                            src={mentora_brand}
                            alt="Mentora logo"
                            priority
                           />
                        </div>
                        <div>
                            <ul className="flex justify-center items-center flex-col">
                                <li><h1 className="text-2xl font-extrabold">Study smarter with your course-aware AI tutor</h1></li>
                                <li><h3 className="text-lg font-bold">Connect your Canvas courses to get summaries, guidance, and updates in one place.</h3></li>
                                <li className="text-lg">Course-specific AI help</li>
                                <li className="text-lg" >Study guides and summaries</li>
                                <li className="text-lg" >Track class activity and changes</li>
                            </ul>
                        </div>
                        
                    </section>
                    <section className="bg-background">
                        <div className="flex items-center justify-center rounded-3xl p-6 min-h-screen">
                            <Surface className="w-full max-w-95 p-3 bg-white shadow-lg">
                                {children}
                            </Surface>
                        </div>
                    </section>
                </main>
            </body>
        </html>
    )
}