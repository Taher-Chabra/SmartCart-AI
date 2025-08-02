import { setGlobalRouter } from "@/lib/router";
import { useRouter } from "next/compat/router";
import { useEffect } from "react";

export default function RouterProvider({ children }: { children: React.ReactNode }) {
   const router = useRouter();

   useEffect(() => {
      if (router) setGlobalRouter(router.push)
   }, [router])
   
  return (
    <>
      {children}
    </>
  );
}