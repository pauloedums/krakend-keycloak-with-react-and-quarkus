import { Form, json, redirect, useActionData, useNavigation } from "react-router-dom";
import Logos from "../ui/Logos";

export default function LoginPage() {
    const data = useActionData();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';
    return(
        <div className="w-full h-auto max-w-sm p-2 pt-6 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-white-800 dark:border-gray-700  mx-auto ">
            <div className="flex min-h-full flex-col justify-center px-6 py-3 lg:px-8">
                <Logos />
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <Form className="space-y-6" method="POST">
                        {data && data.errors && (
                            <ul>
                            {Object.values(data.errors).map((err) => (
                                <li key={err}>{err}</li>
                            ))}
                            </ul>
                        )}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">Username</label>
                            <div className="mt-2">
                                <input id="username" name="username" type="username" autoComplete="username" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                            <div className="mt-2">
                                <input id="password" name="password" type="password" autoComplete="current-password" required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>

                        <div>
                            <button  disabled={isSubmitting} className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">{isSubmitting ? 'Submitting...' : 'Log in'}</button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export async function action({request}) {
    const method = request.method;
    const data = await request.formData();

    const url = import.meta.env.VITE_KEYCLOAK_TOKEN_URL;
    const grant_type = import.meta.env.VITE_KEYCLOAK_GRANT_TYPE;
    const client_id = import.meta.env.VITE_KEYCLOAK_CLIENT_ID;

    let detailsBody = {
        url,
        client_id,
        grant_type,
        username: data.get('username'),
        password: data.get('password')
    };
    let requestBody = [];
    for(var property in detailsBody) {
        const encondedKey = encodeURIComponent(property);
        const encodedValue = encodeURIComponent(detailsBody[property]);
        requestBody.push(`${encondedKey}=${encodedValue}`);
    }
    requestBody = requestBody.join('&');


    const response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: requestBody
    })

    if (response.status === 422) {
        return response;
    }

    if (!response.ok) {
        throw json({ message: 'Could not save event.' }, { status: 500 });
    }
    
    return redirect('/member');
}