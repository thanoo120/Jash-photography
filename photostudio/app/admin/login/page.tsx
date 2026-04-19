import { redirect } from "next/navigation";

/** Admin area uses the shared login at `/login`; keep this URL from 404ing for bookmarks and old links. */
export default function AdminLoginPage() {
  redirect("/login");
}
