import "@/globals.css";
import NavBar from "./_components/navbar";
import { getCourses } from "./dashboard/data";
import AppShell from "./_components/appShell";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const coursesArray = await getCourses();

  return (
    <html lang="en" data-theme="slate-scholar">
      <body>
        <main>
          <AppShell nav={<NavBar courses={coursesArray} />}>
            {children}
          </AppShell>
        </main>
      </body>
    </html>
  );
}