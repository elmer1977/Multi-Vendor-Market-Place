import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { server } from "../server";
import axios from 'axios';


const SellerActivationPage = () => {
    const { activation_token } = useParams();
    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const activateSeller = async () => {
            if (!activation_token) {
                setMessage("This seller activation link is invalid.");
                setStatus("error");
                return;
            }

            try {
                const { data } = await axios.post(`${server}/shop/activation`, {
                    activation_token
                });
                setMessage(data.message || "Your seller account is ready. You can now sign in.");
                setStatus("success");
            } catch (error) {
                setMessage(
                    error.response?.data?.message ||
                    "We could not activate your seller account. The link may have expired."
                );
                setStatus("error");
            }
        };

        activateSeller();
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
                    <p className="text-gray-700">Activating your seller account...</p>
                )}
                {status === "error" && (
                    <p className="text-red-800">{message}</p>
                )}
                {status === "success" && (
                    <>
                        <p className="text-green-800">{message}</p>
                        <Link to="/shop-login" className="text-blue-600 underline mt-4 inline-block">
                            Sign in to your seller account
                        </Link>
                    </>
                )}
            </div>

        </div>
    )
}

export default SellerActivationPage



