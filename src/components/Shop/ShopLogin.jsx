import React, { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "../../styles/styles";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { saveSellerToken } from "../../utils/authTokens";


const ShopLogin = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [visible, setVisible] = useState(false)
    const [activationRequired, setActivationRequired] = useState(false)
    const [isResendingActivation, setIsResendingActivation] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();

        setActivationRequired(false);
        try {
            const res = await axios.post(
                `${server}/shop/login-shop`,
                {
                    email,
                    password,
                },
                { withCredentials: true }
            );
            saveSellerToken(res.data.token);
            toast.success("Login Sucess!")
            navigate("/dashboard")
            window.location.reload(true);
        } catch (error) {
            if (error.response?.data?.code === "ACCOUNT_NOT_ACTIVATED") {
                setActivationRequired(true);
                toast.error(error.response.data.message);
                return;
            }
            toast.error(error.response?.data?.message || "Login failed.");
        }
    };

    const handleResendActivation = async () => {
        setIsResendingActivation(true);
        try {
            const { data } = await axios.post(`${server}/shop/resend-activation`, {
                email,
                password,
            });
            toast.success(data.message);
            setActivationRequired(false);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Could not resend activation email."
            );
        } finally {
            setIsResendingActivation(false);
        }
    };

    return (
        <div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
            <div className='sm:mx-auto sm:w-full sm:max-w-md'>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Login to your Shop
                </h2>
            </div>
            <div className='mt-8 sm:mx-auto sw:w-full sm:max-w-md'>
                <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
                    <form className='space-y-6' onSubmit={handleSubmit} >
                        {/* Email */}
                        <div>
                            <label htmlFor="email"
                                className='block text-sm font-medium text-gray-700'
                            >
                                Email address
                            </label>
                            <div className='mt-1'>
                                <input type="email"
                                    name='email'
                                    autoComplete='email'
                                    required
                                    placeholder='Please enter valid email'
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setActivationRequired(false);
                                    }}
                                    className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                                />

                            </div>
                        </div>
                        {/* Password */}
                        <div>
                            <label htmlFor="password"
                                className='block text-sm font-medium text-gray-700'
                            >
                                password
                            </label>
                            <div className='mt-1 relative'>
                                <input type={visible ? "text" : "password"}
                                    name='password'
                                    autoComplete='password'
                                    required
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setActivationRequired(false);
                                    }}
                                    className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                                />
                                {visible ? (
                                    <AiOutlineEye
                                        className="absolute right-2 top-2 cursor-pointer"
                                        size={25}
                                        onClick={() => setVisible(false)}
                                    />
                                ) : (
                                    <AiOutlineEyeInvisible
                                        className="absolute right-2 top-2 cursor-pointer"
                                        size={25}
                                        onClick={() => setVisible(true)}
                                    />
                                )}

                            </div>
                        </div>
                        {/* password end */}

                        <div className={`${styles.noramlFlex} justify-between`}>
                            <div className={`${styles.noramlFlex}`}>
                                <input
                                    type="checkbox"
                                    name="remember-me"
                                    id="remember-me"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="remember-me"
                                    className="ml-2 block text-sm text-gray-900"
                                >
                                    Remember me
                                </label>
                            </div>
                            <div className='text-sm'>
                                 <Link
                                    to="/shop/forgot-password"
                                    className="font-medium text-blue-600 hover:text-blue-500"
                                    >
                                    Forgot your password?
                                </Link>
                            </div>
                        </div>
                        <div>
                            <button
                                type='submit'
                                className=' className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"'
                            >
                                Submit
                            </button>
                        </div>
                        {activationRequired && (
                            <div className="text-center">
                                <p className="text-sm text-gray-700 mb-2">
                                    Activate your seller account before signing in.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleResendActivation}
                                    disabled={isResendingActivation || !email || !password}
                                    className="font-medium text-blue-600 hover:text-blue-500 disabled:text-gray-400"
                                >
                                    {isResendingActivation
                                        ? "Sending activation email..."
                                        : "Resend activation email"}
                                </button>
                            </div>
                        )}

                        <div className={`${styles.noramlFlex} w-full`} >
                            <h4>Not have any account</h4>
                            <Link to="/shop-create" className="text-blue-600 pl-2">
                                Sign Up
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ShopLogin



