// src/components/NoteCard.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase-client";
import { Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface NoteCardProps {
    id: string;
    title: string;
    content: string;
    slug: string;
    created_at: string;
    subjectName?: string;
}

export default function NoteCard({
    id,
    title,
    content,
    slug,
    created_at,
    subjectName,
}: NoteCardProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this note?")) return;
        setLoading(true);
        const { error } = await supabase.from("notes").delete().eq("id", id);
        setLoading(false);
        if (error) {
            alert("Error deleting note");
            console.error(error);
        } else {
            router.refresh();
        }
    };

    return (
        <article className="flex flex-col justify-between bg-white rounded-2xl shadow p-6 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 leading-tight">
                        {title}
                    </h3>
                    <time className="text-xs text-gray-500">
                        {new Date(created_at).toLocaleDateString()}
                    </time>
                </div>
                <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="text-gray-400 hover:text-red-500 p-1"
                    title="Delete note"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            {/* Excerpt (3 lines max) */}
            <div className="text-gray-700 mb-4 overflow-hidden" style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
            }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                </ReactMarkdown>
            </div>

            {/* Footer: Tags + View Link */}
            <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                    {subjectName && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {subjectName}
                        </span>
                    )}
                    {/* If you also want to show tags beyond subject:
          tags.map(t => <TagPill key={t} label={t} />) */}
                </div>
                <Link
                    href={`/notes/${slug}`}
                    className="text-pink-500 text-sm font-medium hover:underline"
                >
                    View →
                </Link>
            </div>
        </article>
    );
}
