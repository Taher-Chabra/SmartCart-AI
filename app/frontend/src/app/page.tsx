'use client';
import { useAuthStore } from "@/store/auth.store";

export default function Home() {
  const user = useAuthStore((state) => state.user);
  return (
    <div>
      <h1 className="text-3xl font-bold underline">
        Welcome {user?.username} to SmartCart - AI
      </h1>
      <p className="mt-4 text-lg">This is a simple Next.js application.</p>
    </div>
  );
}
