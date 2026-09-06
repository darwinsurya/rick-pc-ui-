import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { APP_REGISTRY } from './apps';
import { setRegistry } from './os/store';

setRegistry(APP_REGISTRY);

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);