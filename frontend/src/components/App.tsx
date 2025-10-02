import { useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

import { Index } from '@frontend/pages/Index';
import { routes } from '@frontend/routes';
import { SubmitContext } from '@frontend/components/Context';

export const App = () => {
  const { isSubmit } = useContext(SubmitContext);

  return (
    <BrowserRouter basename={routes.page.base.homePage}>
      {isSubmit && <Spinner className="position-center" />}
      <hr className="mt-0" />
      <div className="container anim-show">
        <Routes>
          <Route path={routes.page.base.homePage} element={<Index />} />
        </Routes>
      </div>
      <hr className="mb-4" />
    </BrowserRouter>
  );
};
