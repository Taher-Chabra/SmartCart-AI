import { createContext, useContext } from 'react';

type LoaderContextType = {
  loading?: boolean;
  show: () => void;
  hide: () => void;
};

export const LoaderContext = createContext<LoaderContextType>({
  show: () => {},
  hide: () => {},
});

export const useLoader = () => {
  return useContext(LoaderContext);
};
