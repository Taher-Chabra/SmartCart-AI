'use client';

import { useLoader } from '@/context/LoaderContext';
import { useEffect } from 'react'

function adminDashboard() {
  const { loading, hide } = useLoader();

  useEffect(() => {
    if (loading) hide();
  }, []);

  return (
    <div>Admin Dashboard</div>
  )
}

export default adminDashboard