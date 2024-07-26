import {jwtDecode} from 'jwt-decode';
import { useNavigate } from "react-router-dom";

export default function MemberPage() {
    const navigate = useNavigate();
    const token = jwtDecode(localStorage.getItem("token"));
    const tokenStringify = JSON.stringify(token, undefined, 2);

    const {name, realm_access, picture} = token;
    const isAdmin = realm_access["roles"].includes("ADMIN");
    const isClient = realm_access["roles"].includes("CLIENT");
    
    function handleLogout(){
        navigate('/logout');
    }
    
    return (<>
    
    <div className="min-h-full">
        <header className="bg-white shadow">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex justify-between">
                    <div><h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1></div>
                    <div><button onClick={handleLogout} className="my-auto p-2 rounded text-white bg-indigo-500 font-semibold">logout</button></div>
                </div>
            </div>
        </header>
        <main>
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex mx-auto py-16 sm:py-24 lg:max-w-none lg:py-32">
                    <div className="w-1/2 mt-6 space-y-12 lg:gap-x-6 lg:space-y-0">
                        <div className="group relative">
                            <div className="relative h-200 w-full overflow-hidden rounded-lg bg- group-hover:opacity-75">
                            <pre className="text-white text-xs">{tokenStringify}</pre>
                            </div>
                            <h3 className="mt-6 text-sm text-gray-500">
                                <span className="absolute inset-0"></span>
                                Code
                            </h3>
                        </div>
                    </div>
                    <div className="w-1/2 mt-6 space-y-12 lg:gap-x-6 lg:space-y-0">
                        <div className="group relative">
                            <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                                <div className="flex -space-x-2 overflow-hidden px-10 pt-10">
                                    <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                        <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white mr-2" src={picture} alt="" />
                                        {name}
                                    </span>
                                </div>
                                {isClient ? <p className="text-black-500 px-10 pt-2">Welcome back, my best client.</p> : <p className="text-black-500 px-10 pt-2">isAdmin: <strong>{isAdmin ? 'Yes' : 'No'}</strong></p>}
                            </div>
                            <h3 className="mt-6 text-sm text-gray-500">
                                <span className="absolute inset-0"></span>
                                Badge example
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
    </>);
}