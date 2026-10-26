import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { server } from "../server";
import axios from 'axios';


const ActivationPage = () => {
    const { activation_token } = useParams();
    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const activateAccount = async () => {
            if (!activation_token) {
                setMessage("This activation link is invalid.");
                setStatus("error");
                return;
            }

            try {
                const { data } = await axios.post(`${server}/user/activation`, {
                    activation_token
                });
                setMessage(data.message || "Your account has been activated.");
                setStatus("success");
            } catch (error) {
                setMessage(
                    error.response?.data?.message ||
                    "We could not activate your account. The link may have expired."
                );
                setStatus("error");
            }
        };

        activateAccount();
    }, [activation_token]);

    return (
        <div
            style={{
                width: "100%",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}>
            <div className="text-center px-4">
                {status === "loading" && (
                    <p className="text-gray-700">Activating your account...</p>
                )}
                {status === "error" && (
                    <p className="text-red-800">{message}</p>
                )}
                {status === "success" && (
                    <>
                        <p className="text-green-800">{message}</p>
                        <Link to="/login" className="text-blue-600 underline mt-4 inline-block">
                            Sign in to your account
                        </Link>
                    </>
                )}
            </div>

        </div>
    )
}

export default ActivationPage