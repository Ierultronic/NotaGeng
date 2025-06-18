// src/components/Sidebar.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Tag, Plus, Sun, Moon } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";

export default function Sidebar() {
    const { data: session } = useSession();
    const [tags, setTags] = useState<{ id: number; name: string }[]>([]);
    const [openItem, setOpenItem] = useState<string | null>(null);
    const [darkMode, setDarkMode] = useState(false);
    const router = useRouter();

    useEffect(() => {
        document.documentElement.classList.toggle("dark", darkMode);
    }, [darkMode]);

    useEffect(() => {
        const fetchTags = async () => {
            if (session?.user?.id) {
                const { data, error } = await supabase
                    .from("tags")
                    .select(
                        `
                        id,
                        name,
                        note_tags!inner(
                            notes!inner(author_id)
                        )
                    `
                    )
                    .eq("note_tags.notes.author_id", session.user.id);

                if (error) {
                    console.error("Error fetching tags:", error);
                } else {
                    // Deduplicate tags
                    const uniqueTags = Array.from(new Map(data.map((t) => [t.id, t])).values());
                    setTags(uniqueTags);
                }
            }
        };

        fetchTags();
    }, [session]);

    return (
        <aside className="fixed top-16 bottom-0 left-0 w-16 flex flex-col items-center py-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-r border-gray-200 dark:border-gray-700 space-y-4">
            {/* Tag Cloud */}
            <div className="relative">
                <button
                    onClick={() => setOpenItem(openItem === "tags" ? null : "tags")}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded"
                    title="Tag Cloud"
                >
                    <Tag size={20} />
                </button>
                {openItem === "tags" && (
                    <div className="absolute left-16 top-0 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 space-y-1 z-10">
                        {tags.length > 0 ? (
                            tags.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => {
                                        router.push(`/notes?tag=${t.name}`);
                                        setOpenItem(null);
                                    }}
                                    className="block w-full text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded"
                                >
                                    {t.name}
                                </button>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">No tags found.</p>
                        )}
                    </div>
                )}
            </div>

            {/* Quick Add */}
            <div className="relative">
                <button
                    onClick={() => setOpenItem(openItem === "add" ? null : "add")}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded"
                    title="Quick Add"
                >
                    <Plus size={20} />
                </button>
                {openItem === "add" && (
                    <div className="absolute left-16 top-0 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 space-y-1 z-10">
                        <button
                            onClick={() => {
                                router.push("/notes/new");
                                setOpenItem(null);
                            }}
                            className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded"
                        >
                            + New Note
                        </button>
                        <button
                            onClick={() => {
                                alert("Scan Photo coming soon");
                                setOpenItem(null);
                            }}
                            className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded"
                        >
                            📷 Scan Photo
                        </button>
                        <button
                            onClick={() => {
                                alert("Import PDF coming soon");
                                setOpenItem(null);
                            }}
                            className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded"
                        >
                            📄 Import PDF
                        </button>
                    </div>
                )}
            </div>

            {/* Theme Toggle */}
            <button
                onClick={() => setDarkMode((v) => !v)}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded"
                title="Toggle Theme"
            >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
        </aside>
    );
}
