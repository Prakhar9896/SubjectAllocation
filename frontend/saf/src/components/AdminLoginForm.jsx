import { useState } from "react"

export default function AdminLoginForm(){
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
        let result = await fetch("/api/auth/faculty/register", {
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


            <div className="hidden sm:flex bg-linear-to-br from-blue-300 to-blue-500 w-full h-1/4 md:w-1/2 md:h-full flex-col items-center justify-center">
                <h2 className="text-4xl font-bold mb-4 text-black">Admin Panel</h2>
                <p className="text-black text-lg">Secure access to your dashboard</p>
            </div>


            <div className="rightblock h-3/4 sm:h-full w-full md:w-1/2 flex flex-col justify-center items-center bg-white p-12">
                <div className="w-full max-w-xs text-center mb-8">
                    <h1 className="text-3xl font-semibold text-gray-800">Welcome Back Admin</h1>
                    <p className="text-sm text-gray-500 mt-1">Please sign in to continue.</p>
                </div>

                {submitted && (
                    <div className="w-full max-w-xs mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
                        Loading...
                    </div>
                )}

                <div className="card flex flex-col w-full max-w-xs gap-5">
                    <div className="flex flex-col">
                        <label htmlFor="email-input" className="text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                            id="email-input"
                            type="email" 
                            placeholder="Username or email" 
                            value={email}

                            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition duration-150 text-gray-800 placeholder-gray-400 
                                ${emailError 
                                    ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
                                    : 'border-gray-300 focus:ring-blue-100 focus:border-blue-500'
                            }`}
                            onChange={handleEmailChange}
                        />
                        {emailError && (
                            <span className="text-red-500 text-sm mt-1">Email is required</span>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="password-input" className="text-sm font-medium text-gray-700 mb-1">Password</label>            
                        <input 
                            id="password-input"
                            type="password"
                            placeholder="••••••••" 
                            value={password}
                            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition duration-150 text-gray-800 placeholder-gray-400 ${
                                passwordError 
                                    ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
                                    : 'border-gray-300 focus:ring-blue-100 focus:border-blue-500'
                            }`}
                            onChange={handlePasswordChange}
                        />
                        {passwordError && (
                            <span className="text-red-500 text-sm mt-1">Password is required</span>
                        )}
                    </div>

                    <button 
                        onClick={handleSubmit}
                        className="w-full mt-2 py-3 bg-gray-800 text-white font-semibold rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 transition duration-200 text-lg"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}