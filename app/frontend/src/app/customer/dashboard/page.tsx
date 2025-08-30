'use client';

import { useLoader } from "@/context/LoaderContext";
import { useEffect } from "react";

function CustomerDashboard() {
  const { loading, hide } = useLoader();

  useEffect(() => {
    if (loading) hide();
  }, []);

  return (
    <div>Customer Dashboard</div>
  )
}

export default CustomerDashboard;
