'strict';
import config from './js/config.json';
import ChartItem from './js/ChartItem';
import { isJson } from './js/helpers';

const $ = require('jquery');
window.jQuery = $;
window.$ = $;

import './scss/main.scss';
import './js/assets';

(function () {
  window.addEventListener('DOMContentLoaded', () => {

    const chartMain = new ChartItem('main');
    chartMain.init('line');

    const socket = new WebSocket(config.SocketLink);

    socket.addEventListener('open', (e) => {
      socket.send('Connected to wss');
    });

    socket.addEventListener('message', e => {
      if (isJson(e.data)) {
        const data = JSON.parse(e.data);
        chartMain.updateMain(data);
      } else {
        console.log(e.data);
      }


    });
  });

})();