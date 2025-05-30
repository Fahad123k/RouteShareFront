import axios from 'axios';
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router'
import { useSnackbar } from "notistack";

import BeatLoader from "react-spinners/BeatLoader";





const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { enqueueSnackbar } = useSnackbar();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();

    const handleSubmit = async (e) => {


        setLoading(true)
        const BACKEND_API = import.meta.env.VITE_BACKEND_URL

        e.preventDefault();
        setError("")

        // console.log(email, "and ", password)

        setTimeout(async () => {

            try {

                const response = await axios.post(`${BACKEND_API}/user/login`, { email, password });
                // console.log("resp - ", response)
                if (response.data.success) {
                    enqueueSnackbar("Login successful!", { variant: "success" }); // ✅ Success Notification
                    setLoading(false)
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("user", JSON.stringify(response.data.user));
                    navigate("/profile")
                } else {
                    enqueueSnackbar("Invalid credentials!", { variant: "error" }); // ❌ Error Notification
                    setLoading(false)
                }


            } catch (error) {
                enqueueSnackbar("Login failed. Please try again.", { variant: "error" }); // ❌ Error Notification
                setError(error.response?.data?.message || "Login failed");
                setLoading(false)
            }
        }, 2000)



    }




    return (
        <section className="bg-gray-50 dark:bg-gray-900 p-4">
            <div className="flex flex-col items-center justify-center p-4  mx-auto m-10 h-full  lg:py-0">
                <a href="#" className="flex items-center mb-6 text-2xl p-4 font-semibold text-gray-900 dark:text-white">
                    RouteShare
                </a>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Sign in to your account
                        </h1>
                        {error && <p className="text-red-500">{error}</p>}
                        <form className="space-y-4 md:space-y-6" action="#" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <input type="email" name="email" id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="" />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input type="password" name="password" id="password" placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="" />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                                    </div>
                                </div>
                                <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                            </div>
                            <button
                                type="submit" className="w-full text-white bg-gray-800 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                disabled={loading}
                            >
                                {/* Sign in */}
                                {loading ?
                                    (<div>
                                        <BeatLoader
                                            color='white'
                                            size={10}
                                        />
                                        <p>Signing In</p>
                                    </div>) : 'Sign in'}
                            </button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Don’t have an account yet? <NavLink to="/sign-up" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</NavLink>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section >
    )
}

export default Login