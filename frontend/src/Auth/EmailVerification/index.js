import React from 'react';
import ReactDOM from 'react-dom';
import EmailVerification from './EmailVerification.js';
import registerServiceWorker from '../../registerServiceWorker';

ReactDOM.render(<EmailVerification />, document.getElementById('root'));
registerServiceWorker();
