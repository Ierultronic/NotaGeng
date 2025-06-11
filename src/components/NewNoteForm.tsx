// src/components/NewNoteForm.tsx
"use client";

import { useState, FormEvent, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Bold, Italic, Strikethrough } from "lucide-react";
import { supabase } from "@/lib/supabase-client";

// 2) Slugify helper
function slugify(str: string) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export default function NewNoteForm() {
    const { data: session } = useSession();
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [subject, setSubject] = useState("");
    const [visibility, setVisibility] = useState<"private" | "shared">("private");
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [content, setContent] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Sync textarea to content state
    useEffect(() => {
        const ta = textareaRef.current;
        if (!ta) return;
        const onInput = () => setContent(ta.value);
        ta.addEventListener("input", onInput);
        return () => ta.removeEventListener("input", onInput);
    }, []);

    // Markdown wrappers
    function wrapSelection(wrapper: string) {
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
    }

    // Tag handlers
    const handleAddTag = () => {
        const t = tagInput.trim();
        if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
        setTagInput("");
    };
    const handleRemoveTag = (t: string) =>
        setTags((prev) => prev.filter((tag) => tag !== t));

    // Submit handler: upsert subject, note, tags, then redirect
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!session) {
            alert("Please log in to create notes.");
            router.push("/login");
            return;
        }

        // 1) Upsert the subject
        let subjectId: string | null = null;
        if (subject.trim()) {
            const baseSubSlug = slugify(subject);
            // try to find existing
            const { data: existingSub } = await supabase
                .from("subjects")
                .select("id")
                .eq("slug", baseSubSlug)
                .maybeSingle();
            if (existingSub) {
                subjectId = existingSub.id;
            } else {
                const { data: newSub } = await supabase
                    .from("subjects")
                    .insert({
                        name: subject,
                        slug: baseSubSlug,
                        created_by_user_id: session.user.id,
                    })
                    .select("id")
                    .single();
                subjectId = newSub?.id!;
            }
        }

        // 2) Generate a unique slug for the note
        const baseSlug = slugify(title) || Date.now().toString();
        let noteSlug = baseSlug;
        let suffix = 1;
        while (true) {
            const { data: conflict } = await supabase
                .from("notes")
                .select("id")
                .eq("slug", noteSlug)
                .maybeSingle();
            if (!conflict) break;
            suffix += 1;
            noteSlug = `${baseSlug}-${suffix}`;
        }

        // 3) Insert the note
        const { data: note, error: noteErr } = await supabase
            .from("notes")
            .insert({
                title,
                content,
                subject_id: subjectId,
                author_id: session.user.id,
                visibility,
                slug: noteSlug,
            })
            .select("id")
            .single();
        if (noteErr || !note) {
            console.error("Error creating note:", noteErr);
            alert("Error saving note.");
            return;
        }

        // 4) Upsert tags and link them
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
            await supabase.from("note_tags").insert({
                note_id: note.id,
                tag_id: tagId,
            });
        }

        // 5) Redirect to the new note page
        router.push(`/notes/${noteSlug}`);
    };


    return (
        <div className="pt-16 fixed inset-0 flex flex-col bg-[#FFE1E9]">
            {/* Sticky Toolbar */}
            <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-md px-6 py-3 border-b border-gray-200 flex items-center space-x-4">
                <input
                    type="text"
                    aria-label="Note title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Untitled note"
                    className="flex-grow text-2xl font-bold bg-transparent text-gray-900 caret-black outline-none placeholder-gray-400"
                />
                <button
                    type="button"
                    onClick={() => wrapSelection("**")}
                    className="p-1 hover:bg-gray-200 rounded text-gray-900 caret-black outline-none"
                    title="Bold"
                >
                    <Bold size={18} />
                </button>
                <button
                    type="button"
                    onClick={() => wrapSelection("_")}
                    className="p-1 hover:bg-gray-200 rounded text-gray-900 caret-black outline-none"
                    title="Italic"
                >
                    <Italic size={18} />
                </button>
                <button
                    type="button"
                    onClick={() => wrapSelection("~~")}
                    className="p-1 hover:bg-gray-200 rounded text-gray-900 caret-black outline-none"
                    title="Strikethrough"
                >
                    <Strikethrough size={18} />
                </button>
                <input
                    type="text"
                    list="subject-list"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Subject…"
                    className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-900 caret-black focus:outline-none focus:ring-2 focus:ring-pink-300 w-32"
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
                    className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-900 caret-black focus:outline-none focus:ring-2 focus:ring-pink-300"
                >
                    <option value="private">Private 🔒</option>
                    <option value="shared">Shared 🌐</option>
                </select>
                <Link href="/notes">
                    <button className="text-pink-500 hover:underline text-sm">
                        Cancel
                    </button>
                </Link>
                <button
                    onClick={handleSubmit}
                    className="px-4 py-1 bg-pink-500 text-white rounded-full text-sm hover:bg-pink-600 transition"
                >
                    Save
                </button>
            </header>

            {/* Tag Bar */}
            <div className="flex items-center space-x-2 px-6 py-2 bg-white/50 backdrop-blur-md border-b border-gray-200">
                {tags.map((t) => (
                    <span
                        key={t}
                        className="flex items-center space-x-1 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm"
                    >
                        <span>{t}</span>
                        <button
                            onClick={() => handleRemoveTag(t)}
                            className="text-pink-500 hover:text-pink-700"
                        >
                            &times;
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) =>
                        e.key === "Enter" && (e.preventDefault(), handleAddTag())
                    }
                    placeholder="Add tag…"
                    className="flex-grow max-w-xs px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-900 caret-black focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
                <button
                    onClick={handleAddTag}
                    className="px-3 py-1 bg-pink-500 text-white rounded-full text-sm hover:bg-pink-600 transition"
                >
                    Add
                </button>
            </div>

            {/* Editor & Preview */}
            <div className="flex flex-1 overflow-hidden">
                {/* Markdown Editor */}
                <textarea
                    ref={textareaRef}
                    value={content}
                    defaultValue=""
                    placeholder="Start typing in **Markdown**…"
                    className="w-1/2 h-full p-6 bg-transparent text-gray-900 caret-black outline-none resize-none"
                />

                {/* Live Preview */}
                <div className="w-1/2 h-full p-6 overflow-auto prose prose-pink max-w-none bg-white/20 text-gray-900">
                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                        {content || "_Start typing…_"}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
}
