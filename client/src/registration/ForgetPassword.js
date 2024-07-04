//Forgetpassword.js
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ForgetPassword() {
    const notify = (message) => toast.success(message);
    const notifyFail = (message) => toast.error(message);

    const [email, setEmail] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await axios.post('http://192.168.43.120:5000/api/resetPassword', { email });
            console.log(response);
            console.log(response.data);
            notify(response.data.message);
        } catch (error) {
            console.error(error);
            notifyFail('Password reset failed. Please try again.');
        }
    }
    return (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-[#e6f6ff] px-4 py-12 dark:bg-[#003b4d]">
            <div className="w-full max-w-md space-y-4">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-[#003b4d] dark:text-[#e6f6ff]">
                        Forgot Your Password?
                    </h2>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-[#003b4d] dark:text-[#e6f6ff]" htmlFor="email">
                            Email
                        </label>
                        <div className="mt-1">
                            <input
                                autoComplete="email"
                                className="block w-full appearance-none rounded-md border border-[#b3d9e6] px-3 py-2 placeholder-[#80b3c2] shadow-sm focus:border-[#00a3d9] focus:outline-none focus:ring-[#00a3d9] dark:border-[#006680] dark:bg-[#003b4d] dark:text-[#e6f6ff] dark:placeholder-[#80b3c2]"
                                id="email"
                                name="email"
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <button
                        className="w-full justify-center rounded-md bg-[#00a3d9] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#00b8f2] focus:outline-none focus:ring-2 focus:ring-[#00a3d9] focus:ring-offset-2 dark:bg-[#00d9ff] dark:hover:bg-[#00b8f2] dark:focus:ring-[#00d9ff]"
                        type="submit"
                    >
                        Reset Password
                    </button>
                </form>

            </div>
            <div className="mt-8">
                <p className="text-sm text-[#4d4d4d] dark:text-[#80b3c2]">
                    Remember your password?
                    <Link
                        className="font-medium text-[#00a3d9] hover:underline dark:text-[#00d9ff]"
                        to={`/login`}
                    >
                        Log in
                    </Link>
                </p>
            </div>
            <ToastContainer />
        </div>
    )
}

export default ForgetPassword
