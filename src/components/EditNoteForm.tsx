// src/components/EditNoteForm.tsx
"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase-client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Bold, Italic, Strikethrough } from "lucide-react";

// Helper to slugify strings
function slugify(str: string) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

interface EditNoteFormProps {
    note: {
        id: string;
        title: string;
        content: string;
        visibility: "private" | "shared";
        subject: string;
        tags: string[];
        slug: string;
    };
}

export default function EditNoteForm({ note }: EditNoteFormProps) {
    const { data: session } = useSession();
    const router = useRouter();

    const [title, setTitle] = useState(note.title);
    const [subject, setSubject] = useState(note.subject);
    const [visibility, setVisibility] = useState(note.visibility);
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>([...note.tags]);
    const [content, setContent] = useState(note.content);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Sync textarea -> state
    useEffect(() => {
        const ta = textareaRef.current;
        if (!ta) return;
        const onInput = () => setContent(ta.value);
        ta.addEventListener("input", onInput);
        // initialize
        ta.value = note.content;
        return () => ta.removeEventListener("input", onInput);
    }, [note.content]);

    // Markdown wrapper helper
    const wrapSelection = (wrapper: string) => {
        const ta = textareaRef.current;
        if (!ta) return;
        const { selectionStart, selectionEnd, value } = ta;
        const before = value.slice(0, selectionStart);
        const selected = value.slice(selectionStart, selectionEnd);
        const after = value.slice(selectionEnd);
        const newText = before + wrapper + selected + wrapper + after;
        setContent(newText);
        setTimeout(() => {
            const pos = selectionEnd + wrapper.length * 2;
            ta.setSelectionRange(pos, pos);
            ta.focus();
        }, 0);
    };

    const handleAddTag = () => {
        const t = tagInput.trim();
        if (t && !tags.includes(t)) setTags((p) => [...p, t]);
        setTagInput("");
    };
    const handleRemoveTag = (t: string) =>
        setTags((p) => p.filter((x) => x !== t));

    // Save updates
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!session) {
            alert("Please log in to edit your note.");
            router.push("/login");
            return;
        }

        // Upsert subject
        let subjectId: string | null = null;
        if (subject.trim()) {
            const baseSlug = slugify(subject);
            const { data: existing } = await supabase
                .from("subjects")
                .select("id")
                .eq("slug", baseSlug)
                .maybeSingle();
            if (existing) subjectId = existing.id;
            else {
                const { data: newSub } = await supabase
                    .from("subjects")
                    .insert({
                        name: subject,
                        slug: baseSlug,
                        created_by_user_id: session.user.id,
                    })
                    .select("id")
                    .single();
                subjectId = newSub?.id!;
            }
        }

        // Generate new slug if title changed
        const baseSlug = slugify(title) || note.slug;
        let newSlug = baseSlug;
        if (baseSlug !== note.slug) {
            let i = 1;
            while (true) {
                const { data: conflict } = await supabase
                    .from("notes")
                    .select("id")
                    .eq("slug", newSlug)
                    .maybeSingle();
                if (!conflict) break;
                i += 1;
                newSlug = `${baseSlug}-${i}`;
            }
        }

        // Update note
        const { error: updErr } = await supabase
            .from("notes")
            .update({
                title,
                content,
                subject_id: subjectId,
                visibility,
                slug: newSlug,
            })
            .eq("id", note.id);
        if (updErr) {
            console.error("Update note error:", updErr);
            alert("Failed to update note.");
            return;
        }

        // Replace tags
        await supabase.from("note_tags").delete().eq("note_id", note.id);
        for (const t of tags) {
            const { data: existingTag } = await supabase
                .from("tags")
                .select("id")
                .eq("name", t)
                .maybeSingle();
            let tagId = existingTag?.id;
            if (!tagId) {
                const { data: newTag } = await supabase
                    .from("tags")
                    .insert({ name: t })
                    .select("id")
                    .single();
                tagId = newTag?.id!;
            }
            await supabase
                .from("note_tags")
                .insert({ note_id: note.id, tag_id: tagId });
        }

        // Redirect to updated note
        router.push(`/notes/${newSlug}`);
    };

    return (
        <div className="pt-16 fixed inset-0 flex flex-col bg-[#FFE1E9]">
            {/* Toolbar */}
            <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-md px-6 py-3 border-b flex items-center space-x-4">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Untitled note"
                    className="flex-grow text-2xl font-bold bg-transparent text-gray-900 outline-none placeholder-gray-400"
                />
                <button onClick={() => wrapSelection("**")} title="Bold" className="p-1 text-gray-900 hover:bg-gray-200 rounded">
                    <Bold size={18} />
                </button>
                <button onClick={() => wrapSelection("_")} title="Italic" className="p-1 text-gray-900 hover:bg-gray-200 rounded">
                    <Italic size={18} />
                </button>
                <button onClick={() => wrapSelection("~~")} title="Strikethrough" className="p-1 text-gray-900 hover:bg-gray-200 rounded">
                    <Strikethrough size={18} />
                </button>
                <input
                    type="text"
                    list="subject-list"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Subject…"
                    className="px-3 py-1 bg-white border rounded-full text-sm text-gray-900 focus:ring-2 focus:ring-pink-300"
                />
                <datalist id="subject-list">
                    <option value="Matematik" />
                    <option value="Sejarah" />
                    <option value="Sains" />
                    <option value="English" />
                </datalist>
                <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as any)}
                    className="px-3 py-1 bg-white border rounded-full text-sm text-gray-900 focus:ring-2 focus:ring-pink-300"
                >
                    <option value="private">Private 🔒</option>
                    <option value="shared">Shared 🌐</option>
                </select>
                <Link href={`/notes/${note.slug}`}>
                    <button className="text-pink-500 hover:underline text-sm">Cancel</button>
                </Link>
                <button onClick={handleSubmit} className="px-4 py-1 bg-pink-500 text-white rounded-full text-sm">
                    Save
                </button>
            </header>

            {/* Tag Bar */}
            <div className="flex items-center space-x-2 px-6 py-2 bg-white/50 backdrop-blur-md border-b border-gray-200">

                {tags.map((t) => (
                    <span key={t} className="flex items-center bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm">
                        {t} <button onClick={() => handleRemoveTag(t)} className="ml-1">&times;</button>
                    </span>
                ))}
                <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                    placeholder="Add tag…"
                    className="flex-grow max-w-xs px-3 py-1 bg-white border rounded-full text-sm text-gray-900 focus:ring-2 focus:ring-pink-300"
                />
                <button onClick={handleAddTag} className="px-3 py-1 bg-pink-500 text-white rounded-full text-sm">
                    Add
                </button>
            </div>

            {/* Editor & Preview */}
            <div className="flex flex-1 overflow-hidden">
                <textarea
                    ref={textareaRef}
                    className="w-1/2 h-full p-6 bg-transparent text-gray-900 caret-black outline-none resize-none"
                />
                <div className="w-1/2 h-full p-6 overflow-auto prose prose-pink bg-white/20 text-gray-900">
                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                        {content}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
}
