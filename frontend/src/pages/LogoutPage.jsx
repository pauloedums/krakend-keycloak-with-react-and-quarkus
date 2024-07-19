import { Link } from "react-router-dom";

export default function LogoutPage(){
    return(<>
    
    <div className="min-h-full">
        <header className="bg-white shadow">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <h1>Thank you for your visit.</h1>
                <p>Please, <Link to="/login" className="font-bold text-black-200">login</Link> to access your data.</p>    
            </div>
        </header>
    </div>
    </>)
}

export async function action() {
    const method = "GET";
    const token = localStorage.getItem("token");
    const url = import.meta.env.VITE_API + '/v1/logout';

    const response = await fetch(url, {
        method,
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })

    if (response.status === 422) {
        return response;
    }

    if (!response.ok) {
        throw json({ message: 'Could not save event.' }, { status: 500 });
    }

    const res = await response.json();
    localStorage.removeItem("token");

    return res;
    
}