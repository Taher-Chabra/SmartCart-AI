import { verifyUserAndRole } from "@/lib/auth/verifyUserAndRole";

export default async function SellerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
   await verifyUserAndRole({ requiredRole: 'seller' });

  return (
    <div>
      <h1>Seller Panel</h1>
      {children}
    </div>
  );
}