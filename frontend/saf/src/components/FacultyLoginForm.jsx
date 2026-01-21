import { useState } from "react"

export default function FacultyLoginForm(){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)

    const [submitted, setSubmitted] = useState(false)

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
        if (emailError && e.target.value) {
            setEmailError(false)
        }
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
        if (passwordError && e.target.value) {
            setPasswordError(false)
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        setEmailError(false)
        setPasswordError(false)
        let hasError = false

        if (!email.trim()) {
            setEmailError(true)
            hasError = true
        }

        if (!password.trim()) {
            setPasswordError(true)
            hasError = true
        }

        if (hasError) return
        let item={email,password}
        let result = await fetch("/api/auth/faculty/login", {
            method: "POST",
            body: JSON.stringify(item),
        });
        setSubmitted(true)
        
        setEmail("")
        setPassword("")
        setTimeout(() => setSubmitted(false), 4000)
    }

    return (
        <div className="w-screen h-screen flex flex-col sm:flex-row">

            <div className="hidden sm:flex bg-gradient-to-br from-blue-700 to-purple-500 w-full h-1/4 md:w-1/2 md:h-full flex-col items-center justify-center">
                <h2 className="text-4xl font-bold mb-4 text-black">Faculty Portal</h2>
                <p className="text-black text-lg">Secure access to your courses and materials</p>
            </div>

            <div className="rightblock h-3/4 sm:h-full w-full md:w-1/2 flex flex-col justify-center items-center bg-gray-50 p-8 sm:p-12">
                <div className="w-full max-w-sm">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold text-gray-900">Welcome Back</h1>
                        <p className="text-base text-gray-600 mt-2">Faculty Login</p>
                        <p className="text-sm text-gray-500 mt-1">Please sign in to your account.</p>
                    </div>

                    {submitted && (
                        <div className="w-full mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg shadow-sm flex items-center">
                            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Loading...</span>
                        </div>
                    )}

                    <div className="card flex flex-col w-full gap-6">
                        <div className="flex flex-col">
                            <label htmlFor="email-input" className="text-sm font-semibold text-gray-800 mb-2">Email Address</label>
                            <input 
                                id="email-input"
                                type="email" 
                                placeholder="you@example.com" 
                                value={email}
                                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition duration-150 text-gray-800 placeholder-gray-400 
                                    ${emailError 
                                        ? 'border-red-500 focus:ring-red-200 focus:border-red-500 bg-red-50' 
                                        : 'border-gray-300 focus:ring-indigo-200 focus:border-indigo-500 bg-white'
                                }`}
                                onChange={handleEmailChange}
                            />
                            {emailError && (
                                <span className="text-red-600 text-sm mt-2 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Email is required
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="password-input" className="text-sm font-semibold text-gray-800 mb-2">Password</label>            
                            <input 
                                id="password-input"
                                type="password"
                                placeholder="••••••••" 
                                value={password}
                                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition duration-150 text-gray-800 placeholder-gray-400 ${
                                    passwordError 
                                        ? 'border-red-500 focus:ring-red-200 focus:border-red-500 bg-red-50' 
                                        : 'border-gray-300 focus:ring-indigo-200 focus:border-indigo-500 bg-white'
                                }`}
                                onChange={handlePasswordChange}
                            />
                            {passwordError && (
                                <span className="text-red-600 text-sm mt-2 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Password is required
                                </span>
                            )}
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center text-gray-700 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                <span className="ml-2">Remember me</span>
                            </label>
                            <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">Forgot password?</a>
                        </div>

                        <button 
                            onClick={handleSubmit}
                            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-200 text-base"
                        >
                            Sign In
                        </button>
                    </div>

                    <p className="text-center text-gray-600 text-sm mt-6">
                        Don't have an account? <a href="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold">Register</a>
                    </p>
                </div>
            </div>
        </div>
    )
}