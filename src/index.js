'strict';
import config from './js/config.json';
import { isJson } from './js/helpers';

const $ = require('jquery');
window.jQuery = $;
window.$ = $;

import './scss/main.scss';
import './js/assets';

(function () {
  window.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded');

    const socket = new WebSocket(config.SocketLink);

    socket.addEventListener('open', (e) => {
      socket.send('Connected to wss');
    });

    socket.addEventListener('message', e => {
      if (isJson(e.data)) {
        const data = JSON.parse(e.data);
        console.log(data);

      } else {
        console.log(e.data);
      }


    });
  });

})();