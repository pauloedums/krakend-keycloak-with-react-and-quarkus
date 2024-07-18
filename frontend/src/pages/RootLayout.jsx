import { Outlet } from "react-router-dom";

function RootLayout() {
    return(<>
    <div className="flex h-screen">
        <main className="h-auto m-auto">
            <Outlet />
        </main>
    </div>
    </>);
}

export default RootLayout;