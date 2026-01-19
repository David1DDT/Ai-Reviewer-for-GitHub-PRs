import { GitPullRequest, ShieldCheck, Zap, MessageSquare } from "lucide-react";
import FeatureCard from "@/components/FeatureCard";
import Link from "next/link";
import { cookies } from "next/headers";

export default async function HomePage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const currentUserRes = await fetch("http://127.0.0.1:4000/login/oauth2/code/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cookie": cookieHeader,
    },
  })

  const isLoggedIn = currentUserRes.status === 200;

  // Decide where "Start" buttons go
  const startHref = isLoggedIn ? "/dashboard" : "/login";
  const startText = isLoggedIn ? "Go to Dashboard →" : "Review My PR →";

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      {/* HERO */}
      <section className="py-24 px-4 text-center">
        <span className="inline-block mb-6 rounded-full bg-blue-100 text-blue-600 px-4 py-2 text-sm font-semibold">
          🚀 FREE AI Pull Request Reviewer
        </span>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-8 text-black">
          Review Pull Requests.
          <span className="text-blue-600"> Automatically.</span>
        </h1>

        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
          Login and get instant AI-powered code reviews, security checks, and
          improvement suggestions.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={startHref}>
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-8 py-4 rounded-xl shadow-lg transition">
              {startText}
            </button>
          </Link>

          <p className="text-sm text-gray-500 self-center">
            No credit card • Instant results
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<GitPullRequest />}
            title="PR Analysis"
            description="Analyzes changed files, diffs, and commit history automatically."
          />
          <FeatureCard
            icon={<ShieldCheck />}
            title="Security Issues"
            description="Detects vulnerabilities, secrets, and risky patterns."
          />
          <FeatureCard
            icon={<Zap />}
            title="Best Practices"
            description="Suggests refactors, clean code improvements, and optimizations."
          />
          <FeatureCard
            icon={<MessageSquare />}
            title="Review Summary"
            description="Human-readable feedback ready to paste into GitHub."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-gradient-to-r from-blue-600 to-purple-700 text-white text-center">
        <h2 className="text-4xl font-bold mb-6">
          Stop Manually Reviewing Every PR
        </h2>

        <p className="text-xl mb-10 opacity-90">
          Let AI do the first pass — you focus on architecture and decisions.
        </p>

        <Link href={startHref}>
          <button className="bg-white text-blue-600 font-bold px-10 py-4 rounded-xl text-lg hover:bg-gray-100 transition">
            {isLoggedIn ? "Go to Dashboard" : "Start Reviewing PRs"}
          </button>
        </Link>
      </section>
    </div>
  );
}
