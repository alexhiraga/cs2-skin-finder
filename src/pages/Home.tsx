import { Filter } from "../components/Filter";
import { Sidebar } from "../components/Sidebar";

export function Home() {
    return (
        <div className="content flex">
            <Sidebar />
            <div>
                <h1 className="mb-10 mt-5">CS2 Skin Finder & Builder</h1>

                <Filter />
            </div>
        </div>
    )
}