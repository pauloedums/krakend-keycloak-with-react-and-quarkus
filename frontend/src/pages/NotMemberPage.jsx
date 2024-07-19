import { Link } from "react-router-dom";

export default function NotMemberPage() {
    function navigateHandler(){
        navigate('/login');
    }
    return (<>
    <div className="min-h-full">
        <header className="bg-white shadow">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <h1>Sorry, you are not a member yet!</h1>
                <p>Try <Link to="/login" onClick={navigateHandler}className="font-bold text-black-200">login</Link> again.</p>    
            </div>
        </header>
    </div>
    </>);
}