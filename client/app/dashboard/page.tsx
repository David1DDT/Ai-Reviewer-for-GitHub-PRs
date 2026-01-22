import { GitPullRequest, Sparkles } from "lucide-react";
import { cookies } from "next/headers";

type Repo = {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
    description: string | null;
    language: string | null;
    stargazers_count: number;
    forks_count: number;
    pulls_url: string; // cleaned in backend
};

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    // Fetch repos from your backend (pulls_url is already cleaned)
    const reposRes = await fetch("http://46.183.113.13/api/login/oauth2/code/repos", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Cookie": cookieHeader,
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "Reviewer for GitHub PRs",


        },

    });

    const repos: Repo[] = await reposRes.json();
    console.log(repos)
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-10">
            <div className="max-w-5xl mx-auto">
                {/* HEADER */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600">Review GitHub pull requests with AI</p>
                    </div>
                </div>

                {/* MAIN CARD */}
                <div className="rounded-2xl bg-white shadow-xl p-8 mb-12">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                        Your Repositories
                    </h2>
                    <div className="grid gap-4">
                        {repos.map((repo) => (
                            <div
                                key={repo.id}
                                className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg hover:shadow-lg transition"
                            >
                                <div>
                                    <h3 className="font-bold text-lg text-black">{repo.full_name}</h3>
                                    <p className="text-gray-600 text-sm">{repo.description}</p>
                                </div>
                                <a
                                    href={`/pull-requests?link=${repo.pulls_url}&repoName=${repo.full_name}`} // cleaned URL from backend
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 mt-2 md:mt-0 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                                >
                                    View PRs
                                    <GitPullRequest className="w-4 h-4" />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FEATURES */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="rounded-2xl bg-white p-6 shadow">
                        <GitPullRequest className="w-8 h-8 text-blue-600 mb-4" />
                        <h3 className="font-bold text-lg mb-2 text-black">Code Quality</h3>
                        <p className="text-gray-600 text-sm">
                            Detects bad practices, unused code, and style issues.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow">
                        <Sparkles className="w-8 h-8 text-purple-600 mb-4" />
                        <h3 className="font-bold text-lg mb-2 text-black">AI Suggestions</h3>
                        <p className="text-gray-600 text-sm">
                            Refactors and improvements explained clearly.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow">
                        <GitPullRequest className="w-8 h-8 text-green-600 mb-4" />
                        <h3 className="font-bold text-lg mb-2 text-black">PR Summary</h3>
                        <p className="text-gray-600 text-sm">
                            Ready-to-post review comments for GitHub.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
