import { cookies } from "next/headers";
import Link from "next/link";


const pullRequests = async ({ searchParams }: { searchParams: Promise<{ link: string, repoName: string }> }) => {
    const { link, repoName } = await searchParams

    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    console.log(link)

    const prRes = await fetch("http://127.0.0.1:4000/pullRequest/prs", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            "Cookie": cookieHeader
        },
        body: JSON.stringify({
            link: link
        })
    })
    const prs = await prRes.json()
    console.log(prs)
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">{repoName} Pull Requests</h1>

                {prs.length === 0 && (
                    <div className="text-gray-600 text-lg text-center py-12 border border-dashed border-gray-300 rounded-lg bg-white">
                        No pull requests found.
                    </div>
                )}

                <ul className="space-y-6">
                    {prs.map((pr: any) => (
                        <li
                            key={pr.id}
                            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="flex items-center mb-4">
                                <img
                                    src={pr.user.avatar_url}
                                    alt={pr.user.login}
                                    className="w-12 h-12 rounded-full mr-4 border border-gray-200"
                                />
                                <div>
                                    <a
                                        href={pr.user.html_url}
                                        target="_blank"
                                        className="font-semibold text-blue-600 hover:underline text-lg"
                                    >
                                        {pr.user.login}
                                    </a>
                                    <p className="text-gray-500 text-sm">Created: {new Date(pr.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <a
                                href={pr.html_url}
                                target="_blank"
                                className="block text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
                            >
                                {pr.title} #{pr.number}
                            </a>

                            {pr.body && <p className="mt-3 text-gray-700">{pr.body}</p>}

                            <div className="mt-4 flex items-center justify-between">
                                <span
                                    className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${pr.state === "open"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-200 text-gray-800"
                                        }`}
                                >
                                    {pr.state.toUpperCase()}
                                </span>
                                <Link href={`/pull-requests/${pr.id}?link=${pr.url}&prAuthorUsername=${pr.user.login}&id=${pr.id}`}>
                                    <button
                                        className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Review PR
                                    </button>
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );


}

export default pullRequests