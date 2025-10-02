import { createContext } from 'react';

export const SubmitContext = createContext<{
  isSubmit: boolean,
  setIsSubmit: React.Dispatch<React.SetStateAction<boolean>>,
    }>({
      isSubmit: false,
      setIsSubmit: () => undefined,
    });
