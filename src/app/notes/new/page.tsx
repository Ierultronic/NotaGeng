// src/app/notes/new/page.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import NewNoteForm from "@/components/NewNoteForm";

export default async function NewNotePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return <NewNoteForm />;
}
