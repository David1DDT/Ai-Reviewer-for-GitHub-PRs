import React from 'react'
import Link from 'next/link'

const login = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 px-4">
            <div className="w-full max-w-md text-center rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-10">
                <h1 className="text-3xl font-bold text-white mb-3">
                    Welcome Back
                </h1>

                <p className="text-white/80 mb-8">
                    Sign in to review GitHub pull requests
                </p>
                <Link href="http://127.0.0.1:4000/login/oauth2/code/github">

                    <button
                        className="w-full flex items-center justify-center gap-3 bg-black hover:bg-gray-900 transition text-white py-4 rounded-xl font-semibold text-lg shadow-lg"
                    >
                        {/* GitHub Icon */}
                        <svg
                            viewBox="0 0 24 24"
                            className="w-6 h-6 fill-white"
                            aria-hidden="true"
                        >
                            <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.1 3.29 9.42 7.86 10.95.57.1.78-.25.78-.56v-2.17c-3.2.7-3.88-1.55-3.88-1.55-.53-1.34-1.29-1.7-1.29-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.76.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.3-.52-1.52.11-3.16 0 0 .97-.31 3.18 1.18a11.06 11.06 0 012.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.64.23 2.86.11 3.16.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.4-5.25 5.68.42.36.8 1.08.8 2.18v3.23c0 .31.21.66.79.55A11.52 11.52 0 0023.5 12.02C23.5 5.74 18.27.5 12 .5z" />
                        </svg>

                        Continue with GitHub
                    </button>
                </Link>

                <p className="text-white/60 text-sm mt-6">
                    GitHub is the only supported login method
                </p>
            </div>
        </div>

    )
}

export default login