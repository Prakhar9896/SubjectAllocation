import { useState } from "react"

export default function FacultyRegisterForm() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("")

    const [nameError, setNameError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [roleError, setRoleError] = useState(false)

    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        setNameError(false)
        setEmailError(false)
        setPasswordError(false)
        setRoleError(false)

        let hasError = false

        if (!name.trim()) {
            setNameError(true)
            hasError = true
        }
        if (!email.trim()) {
            setEmailError(true)
            hasError = true
        }
        if (!password.trim()) {
            setPasswordError(true)
            hasError = true
        }
        if (!role) {
            setRoleError(true)
            hasError = true
        }

        if (hasError) return

        setSubmitted(true)

        const item = { name, email, password, role }

        await fetch("/api/auth/faculty/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
        })

        setName("")
        setEmail("")
        setPassword("")
        setRole("")
        setTimeout(() => setSubmitted(false), 4000)
    }

    return (
        <div className="w-screen h-screen flex flex-col sm:flex-row">

            {/* LEFT PANEL */}
            <div className="hidden sm:flex bg-linear-to-br from-blue-300 to-blue-500 w-full h-1/4 md:w-1/2 md:h-full flex-col items-center justify-center">
                <h2 className="text-4xl font-bold mb-4 text-black">Faculty Registration</h2>
                <p className="text-black text-lg">Create a new faculty account</p>
            </div>

            {/* RIGHT PANEL */}
            <div className="h-3/4 sm:h-full w-full md:w-1/2 flex flex-col justify-center items-center bg-white p-12">

                <div className="w-full max-w-xs text-center mb-8">
                    <h1 className="text-3xl font-semibold text-gray-800">Register Faculty</h1>
                    <p className="text-sm text-gray-500 mt-1">Fill in the details below</p>
                </div>

                {submitted && (
                    <div className="w-full max-w-xs mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
                        Registering faculty...
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-xs gap-5">

                    {/* NAME */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter full name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value)
                                if (nameError) setNameError(false)
                            }}
                            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition ${
                                nameError
                                    ? "border-red-500 focus:ring-red-200"
                                    : "border-gray-300 focus:ring-blue-100 focus:border-blue-500"
                            }`}
                        />
                        {nameError && <span className="text-red-500 text-sm mt-1">Name is required</span>}
                    </div>

                    {/* EMAIL */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                if (emailError) setEmailError(false)
                            }}
                            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition ${
                                emailError
                                    ? "border-red-500 focus:ring-red-200"
                                    : "border-gray-300 focus:ring-blue-100 focus:border-blue-500"
                            }`}
                        />
                        {emailError && <span className="text-red-500 text-sm mt-1">Email is required</span>}
                    </div>

                    {/* PASSWORD */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                if (passwordError) setPasswordError(false)
                            }}
                            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition ${
                                passwordError
                                    ? "border-red-500 focus:ring-red-200"
                                    : "border-gray-300 focus:ring-blue-100 focus:border-blue-500"
                            }`}
                        />
                        {passwordError && <span className="text-red-500 text-sm mt-1">Password is required</span>}
                    </div>

                    {/* ROLE */}
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">Professor Type</label>
                        <select
                            value={role}
                            onChange={(e) => {
                                setRole(e.target.value)
                                if (roleError) setRoleError(false)
                            }}
                            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition ${
                                roleError
                                    ? "border-red-500 focus:ring-red-200"
                                    : "border-gray-300 focus:ring-blue-100 focus:border-blue-500"
                            }`}
                        >
                            <option value="">Select role</option>
                            <option value="assistant_professor">Assistant Professor</option>
                            <option value="associate_professor">Associate Professor</option>
                            <option value="professor">Professor</option>
                        </select>
                        {roleError && <span className="text-red-500 text-sm mt-1">Select a role</span>}
                    </div>

                    {/* SUBMIT */}
                    <button
                        type="submit"
                        className="w-full mt-2 py-3 bg-gray-800 text-white font-semibold rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 transition duration-200 text-lg"
                    >
                        Register
                    </button>

                </form>
            </div>
        </div>
    )
}
