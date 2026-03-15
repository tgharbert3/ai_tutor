import ClassCard from "../_components/classCard";
import DashboardHeader from "../_components/dashboardHeader";

export default function Page() {
    return (
        <div className="p-6">
            <div className="w-full p-4">
                <DashboardHeader />
            </div>
            <div className="pt-4">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(262px,1fr))] gap-6">
                    <ClassCard />
                    <ClassCard />
                    <ClassCard />
                    <ClassCard />
                    <ClassCard />
                </div>
            </div>
        </div> 
    )
}