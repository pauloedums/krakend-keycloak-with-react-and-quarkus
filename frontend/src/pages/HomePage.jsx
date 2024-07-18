import { Link, useNavigate } from "react-router-dom";
import PageContent from "../components/PageContent";

export default function HomePage() {
    const navigate = useNavigate();

    function navigateHandler(){
        navigate('/login');
    }

    return(

        <PageContent title="Welcome to">
            <div className="m-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <img className="mx-auto h-10 w-auto" src="https://www.krakend.io/images/logo-krakend.svg" alt="Krakend" />
                <h1 className="text-center text-2xl font-bold leading-9 tracking-tight text-white">+</h1>
                <img className="mx-auto h-10 w-auto" src="https://www.keycloak.org/resources/images/logo.svg" alt="Keycloak" />
            </div>
            <p className="m-10 text-center text-1xl leading-9 tracking-tight text-slate-200">Please, <Link to="/login" onClick={navigateHandler}className="font-bold text-blue-200">login</Link> to access your data.</p>
        </PageContent>
    );
}