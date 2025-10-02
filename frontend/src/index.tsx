import ReactDOM from 'react-dom/client';

import '@frontend/scss/app.scss';
import { Settings } from '@frontend/components/Settings';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<Settings />);
