import { setGlobalRouter } from "@/lib/router";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function RouterProvider({ children }: { children: React.ReactNode }) {
   const router = useRouter();

   useEffect(() => {
      setGlobalRouter(router.push)
   }, [router])
   
  return (
    <>
      {children}
    </>
  );
}