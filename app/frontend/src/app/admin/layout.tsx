import { verifyUserAndRole } from "@/lib/auth/verifyUserAndRole";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
   await verifyUserAndRole({ requiredRole: 'admin' });

  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Welcome to the admin dashboard.</p>
      {children}
    </div>
  );
}
