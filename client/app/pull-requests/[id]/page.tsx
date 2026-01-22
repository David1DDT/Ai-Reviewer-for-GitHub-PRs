"use client"

import { use, useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"

export default function PrReviewPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const link = searchParams.get("link")
    const prAuthorUsername = searchParams.get("prAuthorUsername")
    const id = searchParams.get("id")

    const [review, setReview] = useState<any>(null)
    const [meta, setMeta] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    useEffect(() => {
        if (!link) {
            setError("Missing pull request link")
            setLoading(false)
            return
        }

        fetch("http://46.183.113.13/api/pullRequest/review", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: id, link, prAuthorUsername: prAuthorUsername }),
        })
            .then(res => {
                if (res.status === 401) {
                    window.location.href = "/login"
                    return null
                }
                return res.json()
            })
            .then(data => {
                if (!data?.createdPr) {
                    setError("Failed to fetch PR analysis")
                    return
                }
                setMeta(data.createdPr)
                setReview(JSON.parse(data.createdPr.prJson))
            })
            .catch(() => setError("Something went wrong"))
            .finally(() => setLoading(false))
    }, [params.id, link])

    if (loading)
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-gray-900 animate-spin" />
                    <p className="text-gray-600 text-sm tracking-wide">
                        Analyzing pull request…
                    </p>
                </div>
            </div>
        )

    if (error)
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                        <span className="text-red-600 text-2xl font-bold">!</span>
                    </div>

                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Something went wrong
                    </h2>

                    <p className="text-gray-600 mb-6">
                        {error}
                    </p>

                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition"
                    >
                        Try again
                    </button>
                </div>
            </div>
        )


    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <div className="max-w-5xl mx-auto p-8 space-y-10">
                {/* HEADER */}
                <div className="flex justify-between items-center bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Pull Request Review
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Author: {meta?.prAuthorUsername} • Repo Owner: {meta?.repoOwnerUsername}
                        </p>
                    </div>

                    <span
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold ${review?.overall_status === "right"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                    >
                        {review?.overall_status?.toUpperCase() ?? "UNKNOWN"}
                    </span>
                </div>

                {/* SUMMARY */}
                <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-3">Summary</h2>
                    <p className="text-gray-700 leading-relaxed">{review?.summary}</p>
                    <div className="mt-4 text-sm text-gray-500">
                        Confidence Score:{" "}
                        <span className="font-semibold text-gray-900">
                            {review?.confidence_score ?? 0}%

                        </span>
                    </div>
                </section>

                {/* AUTHOR FEEDBACK */}
                {review?.author_feedback && (
                    <section className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <h2 className="text-lg font-semibold mb-3 text-blue-900">
                            Feedback for Author
                        </h2>

                        <p className="mb-4 text-gray-700">
                            {review.author_feedback.message}
                        </p>

                        <ul className="list-disc ml-6 mb-4 text-gray-700 space-y-1">
                            {(review.author_feedback.main_problems ?? []).map(
                                (p: string, i: number) => (
                                    <li key={i}>{p}</li>
                                )
                            )}
                        </ul>

                        <p className="font-semibold text-blue-900">
                            Fix first: {review.author_feedback.what_to_fix_first}
                        </p>
                    </section>
                )}

                {/* ISSUES */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">Issues</h2>

                    {(!review?.issues || review.issues.length === 0) && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 font-medium">
                            No issues detected 🎉
                        </div>
                    )}

                    {(review?.issues ?? []).map((issue: any, index: number) => (
                        <div
                            key={index}
                            className="bg-white border border-gray-200 rounded-xl p-5 mb-4 shadow-sm"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold">{issue?.type}</span>
                                <span className="text-sm font-semibold text-red-600">
                                    {issue?.severity}
                                </span>
                            </div>

                            <p className="text-xs text-gray-500 mb-2">
                                {issue?.file}:{issue?.line}
                            </p>

                            <div className="space-y-1 text-sm text-gray-700">
                                <p><strong>What’s wrong:</strong> {issue?.what_is_wrong}</p>
                                <p><strong>Why:</strong> {issue?.why_it_is_wrong}</p>
                                <p><strong>How to fix:</strong> {issue?.how_to_fix}</p>
                            </div>
                        </div>
                    ))}
                </section>

                {/* POSITIVE POINTS */}
                {(review?.positive_points ?? []).length > 0 && (
                    <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-3">Positive Points</h2>
                        <ul className="list-disc ml-6 text-gray-700 space-y-1">
                            {review.positive_points.map((p: any, i: number) => (
                                <li key={i}>
                                    <strong>{p?.file}</strong>: {p?.description}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* RECOMMENDATIONS */}
                {(review?.recommendations ?? []).length > 0 && (
                    <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-3">Recommendations</h2>
                        <ul className="list-disc ml-6 text-gray-700 space-y-1">
                            {review.recommendations.map((r: string, i: number) => (
                                <li key={i}>{r}</li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* READY TO MERGE */}
                <section className="text-center pt-6">
                    <span
                        className={`inline-block px-8 py-3 rounded-xl font-bold text-lg shadow-sm ${review?.ready_to_merge
                            ? "bg-green-600 text-white"
                            : "bg-yellow-500 text-white"
                            }`}
                    >
                        {review?.ready_to_merge
                            ? "Ready to Merge 🚀"
                            : "Not Ready to Merge ⚠️"}
                    </span>
                </section>
            </div>
        </div>
    )


}
