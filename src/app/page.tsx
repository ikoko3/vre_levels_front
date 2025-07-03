"use client";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@app/context/AuthContext";
import Link from "next/link";


type Lab = {
  id: string;
  name: string;
  alias: string;
  level: number;
};

const levelColors = [
  "bg-red-200 dark:bg-red-900/40 border-red-300",
  "bg-orange-200 dark:bg-orange-900/40 border-orange-300",
  "bg-yellow-200 dark:bg-yellow-900/40 border-yellow-300",
  "bg-green-200 dark:bg-green-900/40 border-green-300",
  "bg-blue-200 dark:bg-blue-900/40 border-blue-300",
];

export default function Home() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const { user } = useContext(AuthContext);
  const keycloakRoles = user?.roles ?? [];
  const can_propose_lab = keycloakRoles.includes('vre_lab_proposer');
  const is_reviewer = keycloakRoles.includes('vre_lab_reviewer');

  useEffect(() => {
    fetch("http://localhost:3000/lab/list")
      .then((res) => res.json())
      .then(setLabs)
      .catch(console.error);
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-[color:var(--background)] text-[color:var(--foreground)] font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-10 row-start-2 items-center sm:items-start max-w-4xl w-full">
        {/* Title */}
        <section className="space-y-2 text-center sm:text-left">
          <h1 className="text-3xl font-bold">Welcome to the VL Maturity Management System</h1>
          <p className="text-base text-gray-700 dark:text-gray-300">
            This platform helps researchers track and manage the evolution of their Virtual Research Labs (VRLs).
          </p>
          <a
            href="https://naavre.net/docs/readiness_levels/"
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            Read more →
          </a>
        </section>

        {/* Carousel */}
        <section className="w-full">
          <h2 className="text-xl font-semibold mb-4">Explore Virtual Labs</h2>
          <div className="flex overflow-x-auto gap-4 p-2">
            {can_propose_lab && (
              <a
                href="/labs/propose"
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-[200px] border-2 border-dashed border-blue-400 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-left p-4 shadow hover:shadow-md hover:scale-[1.02] active:scale-[.98] transition cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">➕</span>
                  <h3 className="font-semibold text-lg text-blue-800 dark:text-blue-200">
                    Propose a new lab
                  </h3>
                </div>
                <p className="text-xs mt-1 text-gray-700 dark:text-gray-300 italic">
                  Express your interest in creating a new Virtual Lab.
                </p>
                <p className="text-xs mt-2 font-mono text-gray-600 dark:text-gray-400">
                  Your proposal will be reviewed.
                </p>
              </a>
            )}

            {labs.map((lab) => (
              <a
                key={lab.id}
                href={`/labs/${lab.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`min-w-[200px] border rounded-lg shadow p-4 text-left transition transform hover:scale-[1.02] active:scale-[.98] focus:outline-none cursor-pointer ${levelColors[lab.level]}`}
              >
                <h3 className="font-semibold text-lg">{lab.name}</h3>
                <p className="text-xs mt-1 text-gray-800 dark:text-gray-300 italic">
                  {lab.alias}
                </p>
                <p className="text-xs mt-2 font-mono text-gray-700 dark:text-gray-400">
                  Level: <strong>L{lab.level}</strong>
                </p>
              </a>
            ))}
          </div>
          
           <br></br> 


          
        </section>

        <section className="w-full mt-10">
        <h2 className="text-xl font-semibold mb-4">Lab Tools</h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Public: Associated Labs */}
          <Link
            href="/labs/by/user"
            className="block border rounded-lg shadow p-4 text-left transition transform hover:scale-[1.02] active:scale-[.98] cursor-pointer bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
          >
            <h3 className="font-semibold text-lg">Associated Labs</h3>
            <p className="text-xs mt-1 text-gray-800 dark:text-gray-300 italic">
              View labs where you're assigned based on your roles.
            </p>
          </Link>

          {/* Public: Labs History */}
          <Link
            href="/labs/history/graph"
            className="block border rounded-lg shadow p-4 text-left transition transform hover:scale-[1.02] active:scale-[.98] cursor-pointer bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
          >
            <h3 className="font-semibold text-lg">View Labs History</h3>
            <p className="text-xs mt-1 text-gray-800 dark:text-gray-300 italic">
              Browse completed or past virtual labs and track their maturity.
            </p>
          </Link>

          {/* Reviewer-only: Lab Requests */}
          {is_reviewer && (
            <Link
              href="/labs/requests"
              className="block border rounded-lg shadow p-4 text-left transition transform hover:scale-[1.02] active:scale-[.98] cursor-pointer bg-yellow-100 dark:bg-yellow-900/40 border-yellow-300"
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-lg">Review Lab Requests</h3>
                <span className="text-xs bg-yellow-300 dark:bg-yellow-700 px-2 py-0.5 rounded-full text-yellow-900 dark:text-yellow-100">
                  Reviewer
                </span>
              </div>
              <p className="text-xs text-gray-800 dark:text-gray-300 italic">
                View and approve or reject incoming VL proposals.
              </p>
            </Link>
          )}
        </div>
      </section>

      </main>

      <footer className="row-start-3 text-xs text-gray-400 dark:text-gray-500 text-center">
        Powered by NaaVRE Virtual Lab Framework
      </footer>
    </div>
  );
}
