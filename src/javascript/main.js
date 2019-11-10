import 'bootstrap';

import React from 'react';
import ReactDOM from 'react-dom';

import Application from './application.js';

const reactEntry = document.createElement('div');
document.body.appendChild(reactEntry);

ReactDOM.render(<Application />, reactEntry);
