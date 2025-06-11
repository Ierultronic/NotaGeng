// src/app/notes/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import Link from "next/link";
import NoteCard from "@/components/NoteCard";
import { supabase as supabaseAdmin } from "@/lib/supabase-client";


export default async function NotesPage() {
    // 1) Protect route
    const session = await getServerSession(authOptions);
    if (!session) redirect("/login");

    // 2) Fetch all notes by this user, including subject name
    const { data: notes, error } = await supabaseAdmin
        .from("notes")
        .select("id, title, content, slug, created_at, subject:subjects(name)")
        .eq("author_id", session.user.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error loading notes:", error);
        // you could show an error UI here instead
        redirect("/dashboard");
    }

    return (
        <main className="pt-20 min-h-screen bg-[#FFE1E9] px-6 pb-12">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                    <h1 className="text-4xl font-extrabold text-purple-800 mb-4 sm:mb-0">
                        My Notes 📒
                    </h1>
                    <Link href="/notes/new">
                        <button className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full shadow-md hover:scale-105 transition-transform">
                            + New Note
                        </button>
                    </Link>
                </header>

                {/* Notes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notes && notes.length > 0 ? (
                        notes.map((note) => (
                            <NoteCard
                                key={note.id}
                                id={note.id}
                                title={note.title}
                                content={note.content}
                                slug={note.slug}
                                created_at={note.created_at}
                                subjectName={note.subject?.name}
                            />
                        ))
                    ) : (
                        <div className="col-span-full p-6 bg-white rounded-2xl shadow-sm text-center text-gray-500">
                            You haven’t made any notes yet.{" "}
                            <Link href="/notes/new" className="text-pink-500 underline">
                                Create your first note
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
