// src/app/notes/[slug]/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { ChevronLeft } from "lucide-react";
import { supabase as supabaseAdmin } from "@/lib/supabase-client";


export default async function NotePage({
    params,
}: {
    params: { slug: string };
}) {
    const { slug } = params;
    const session = await getServerSession(authOptions);

    // Unauthenticated users see only shared notes
    if (!session) {
        const { data: note, error } = await supabaseAdmin
            .from("notes")
            .select("*")
            .eq("slug", slug)
            .eq("visibility", "shared")
            .single();
        if (error || !note) return notFound();
        return renderNote(note, false);
    }

    // Authenticated: owner or any shared
    const filter = `visibility.eq.shared,author_id.eq.${session.user.id}`;
    const { data: note, error } = await supabaseAdmin
        .from("notes")
        .select("*")
        .or(filter)
        .eq("slug", slug)
        .single();
    if (error || !note) return notFound();

    return renderNote(note, true);
}

async function renderNote(note: any, isOwner: boolean) {
    const { data: subject } = await supabaseAdmin
        .from("subjects")
        .select("name")
        .eq("id", note.subject_id)
        .maybeSingle();

    const { data: tagRecs } = await supabaseAdmin
        .from("note_tags")
        .select("tags(name)")
        .eq("note_id", note.id);
    const tags = tagRecs?.map((r) => r.tags.name) ?? [];

    return (
        <main className="pt-18 min-h-screen bg-[#FFE1E9] p-6 flex justify-center">
            <div className="w-full max-w-3xl space-y-6">
                {/* Back Button */}
                <Link
                    href="/notes"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                    <ChevronLeft className="w-5 h-5" /> Back to Notes
                </Link>

                {/* Note Container */}
                <div className="bg-white/50 backdrop-blur-md rounded-2xl shadow-lg p-8">
                    {/* Title & Meta */}
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-3xl font-extrabold text-purple-800 mb-1">
                                {note.title}
                            </h1>
                            <div className="flex items-center space-x-3 text-sm text-gray-500">
                                <time>{new Date(note.created_at).toLocaleDateString()}</time>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs ${note.visibility === "shared"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-700"
                                        }`}
                                >
                                    {note.visibility === "shared" ? "Shared 🌐" : "Private 🔒"}
                                </span>
                            </div>
                        </div>
                        {isOwner && (
                            <Link
                                href={`/notes/${note.slug}/edit`}
                                className="text-pink-500 hover:underline text-sm"
                            >
                                Edit Note
                            </Link>
                        )}
                    </div>

                    {/* Subject Badge */}
                    {subject?.name && (
                        <span className="inline-block mb-4 text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                            {subject.name}
                        </span>
                    )}

                    {/* Tags */}
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {tags.map((t) => (
                                <span
                                    key={t}
                                    className="text-xs bg-pink-100 text-pink-700 px-3 py-1 rounded-full"
                                >
                                    {t}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Markdown Content */}
                    <article className="prose prose-pink max-w-none text-gray-900">
                        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                            {note.content}
                        </ReactMarkdown>
                    </article>
                </div>
            </div>
        </main>
    );
}
