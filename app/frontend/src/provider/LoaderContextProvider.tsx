import { useState, ReactNode } from 'react';
import { LoaderContext } from '@/context/LoaderContext';
import RippleLoader from '@/components/ui/RippleLoader';

export const LoaderContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [loading, setLoading] = useState(false);

  const show = () => setLoading(true);
  const hide = () => setLoading(false);

  return (
    <LoaderContext.Provider value={{ loading, show, hide }}>
      {children}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle,rgba(0,0,0,0.9)_10%,rgba(0,0,0,0.5)_15%,rgba(0,0,0,0.0)_20%)] backdrop-blur-xs z-50">
          <RippleLoader />
        </div>
      )}
    </LoaderContext.Provider>
  );
};
