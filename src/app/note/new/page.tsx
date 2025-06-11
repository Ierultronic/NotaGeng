// src/app/note/new/page.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function NewNotePage() {
  // Protect this page too
  const session = await getServerSession(authOptions);

  if (!session) {
    console.log("🔴 No session found, redirecting to /login");
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-4">Create a New Note</h1>
      <p className="text-gray-600">
        (The note editor will go here soon!) 
      </p>
    </main>
  );
}
