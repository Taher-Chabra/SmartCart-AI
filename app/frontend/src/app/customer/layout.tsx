import { verifyUserAndRole } from "@/lib/auth/verifyUserAndRole";

export default async function CustomerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
   await verifyUserAndRole({ requiredRole: 'customer' });

   return (
      <div>
         <h1>Customer Panel</h1>
         <p>Welcome to the customer dashboard.</p>
         {children}
      </div>
   );
}