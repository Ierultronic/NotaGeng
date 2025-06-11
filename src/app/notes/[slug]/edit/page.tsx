// src/app/notes/[slug]/edit/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import { redirect, notFound } from "next/navigation";
import EditNoteForm from "@/components/EditNoteForm";
import { supabase as supabaseAdmin } from "@/lib/supabase-client";

export default async function EditNotePage({
    params,
}: {
    params: { slug: string };
}) {
    const { slug } = params;
    const session = await getServerSession(authOptions);
    if (!session) return redirect("/login");

    // Fetch the note, only if owner or shared
    const { data: note, error } = await supabaseAdmin
        .from("notes")
        .select("id, title, content, visibility, author_id, subject_id, slug")
        .eq("slug", slug)
        .single();
    if (error || !note || note.author_id !== session.user.id) {
        return notFound();
    }

    // Fetch its tags
    const { data: tagRows } = await supabaseAdmin
        .from("note_tags")
        .select("tags(name)")
        .eq("note_id", note.id);
    const tags = tagRows?.map((r) => r.tags.name) ?? [];

    // Fetch subject name
    const { data: sub } = await supabaseAdmin
        .from("subjects")
        .select("name")
        .eq("id", note.subject_id)
        .maybeSingle();
    const subjectName = sub?.name ?? "";

    // Render the client‐side form with initial data
    return (
        <EditNoteForm
            note={{
                id: note.id,
                title: note.title,
                content: note.content,
                visibility: note.visibility,
                subject: subjectName,
                tags,
                slug: note.slug,
            }}
        />
    );
}
