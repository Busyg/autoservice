import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { CookiesProvider } from 'react-cookie';
import "regenerator-runtime/runtime";
import App from './App.jsx'
//Отрисовываем App в root
function Index () {
    ReactDOM.render(
    <CookiesProvider>
        <App />
    </CookiesProvider>,
    document.getElementById('root')
);
}
Index();