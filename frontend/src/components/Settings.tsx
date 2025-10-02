import { ToastContainer } from 'react-toastify';
import { I18nextProvider } from 'react-i18next';
import { useMemo, useState } from 'react';

import i18n from '@frontend/locales';
import { App } from '@frontend/components/App';
import { SubmitContext } from '@frontend/components/Context';

export const Settings = () => {
  const [isSubmit, setIsSubmit] = useState(false); // submit spinner

  const submitService = useMemo(() => ({ isSubmit, setIsSubmit }), [isSubmit]);

  return (
    <I18nextProvider i18n={i18n}>
      <SubmitContext.Provider value={submitService}>
        <ToastContainer />
        <App />
      </SubmitContext.Provider>
    </I18nextProvider>
  );
};
