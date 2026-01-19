import Link from "next/link";
import { LogOut } from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";

export default async function Header() {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const currentUserRes = await fetch("http://127.0.0.1:4000/login/oauth2/code/me", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Cookie": cookieHeader,
        },
    })
    const user = await currentUserRes.json()

    return (
        <header className="border-b bg-white">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Brand */}
                <Link
                    href="/"
                    className="font-bold text-xl text-black tracking-tight hover:opacity-80 transition"
                >
                    PR Reviewer AI
                </Link>

                {/* Actions */}

                <div className="flex items-center gap-3">
                    {currentUserRes.status === 200 ?
                        <>
                            <Image
                                src={user.user.avatarUrl}
                                alt="user image"
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                            <Link href="http://127.0.0.1:4000/login/oauth2/code/logout">
                                <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition">
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </Link>
                        </>
                        :
                        <Link
                            href="/login"
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                        >
                            Login
                        </Link>

                    }
                </div>
            </div>
        </header>
    );
}
