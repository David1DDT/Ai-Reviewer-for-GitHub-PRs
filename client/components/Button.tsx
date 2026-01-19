"use client"
import { GitPullRequest, Sparkles } from "lucide-react";


const Button = ({ link }: { link: string }) => {
    const prHandler = async (link: string) => {
        const prRes = await fetch("http://127.0.0.1:4000/pullRequest/prs", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                link: link
            })
        })
        console.log((await prRes.json()))
    }
    return (
        <button
            onClick={() => prHandler(link)} // cleaned URL from backend                                    
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 mt-2 md:mt-0 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
            View PRs
            <GitPullRequest className="w-4 h-4" />
        </button>
    )
}

export default Button