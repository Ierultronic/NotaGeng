// src/app/notes/[slug]/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import { notFound, redirect } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import Link from "next/link";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { db: { schema: "public" } }
);

export default async function NotePage({
    params,
}: {
    // Declare params as a Promise
    params: Promise<{ slug: string }>;
}) {
    // Await to extract slug
    const { slug } = await params;
    
    const session = await getServerSession(authOptions);
    
    if (!session) {
        // Unauthenticated users only see shared notes
        const { data: note, error } = await supabaseAdmin
            .from("notes")
            .select("*")
            .eq("slug", slug)
            .eq("visibility", "shared")
            .single();
        if (error || !note) return notFound();
        return renderNote(note, false);
    }

    // Authenticated: see own or shared
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
    // fetch subject
    const { data: subject } = await supabaseAdmin
        .from("subjects")
        .select("name")
        .eq("id", note.subject_id)
        .maybeSingle();

    // fetch tags
    const { data: tagRecs } = await supabaseAdmin
        .from("note_tags")
        .select("tags(name)")
        .eq("note_id", note.id);
    const tags = tagRecs?.map((r) => r.tags.name) ?? [];

    return (
        <main className="pt-16 min-h-screen bg-[#FFE1E9] p-6">
            <div className="max-w-3xl mx-auto bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-8">
                {/* Title & Actions */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{note.title}</h1>
                        <p className="text-sm text-gray-600">
                            {new Date(note.created_at).toLocaleDateString()} ·{" "}
                            <span
                                className={`px-2 py-1 rounded-full text-xs ${note.visibility === "shared"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                            >
                                {note.visibility === "shared" ? "Shared 🌐" : "Private 🔒"}
                            </span>
                        </p>
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
                    <div className="mb-4">
                        <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                            {subject.name}
                        </span>
                    </div>
                )}

                {/* Tags */}
                {tags.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                        {tags.map((t) => (
                            <span
                                key={t}
                                className="text-sm bg-pink-100 text-pink-700 px-3 py-1 rounded-full"
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
        </main>
    );
}
