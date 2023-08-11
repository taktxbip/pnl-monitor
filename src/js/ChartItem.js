import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import 'chartjs-adapter-moment';

import { manyHorizonalLinesPlugin } from './chartPlugins';

class ChartItem {
  constructor(canvasID) {
    this.canvasID = canvasID;
    this.ctx = document.getElementById(canvasID).getContext('2d');
    this.chartData = {
      datasets: []
    };

    this.chart = null;
    const date = new Date();
    this.utcOffsetSeconds = date.getTimezoneOffset() * 60 * 1000;
    this.lastTimestamp = 0;
  }

  init(type = 'line') {

    const args = {
      type,
      data: this.chartData,
      options: {
        plugins: {
          tooltip: {
            enabled: false
          }
        },
        maintainAspectRatio: false,
        animations: false,
        scales: {
          x: {
            type: 'time',
            time: {
              displayFormats: {
                second: 'Do H:mm',
                minute: 'Do H:mm',
                hour: 'MMM Do H',
                day: 'MMM Do'
              }
            }
          }
        }
      },
      plugins: [manyHorizonalLinesPlugin]
    };

    this.chart = new Chart(this.ctx, args);
    this.events();
  }

  updateMain(obj) {

    const { pnlCurrent } = obj;

    const index = this.chart.data.datasets.findIndex(el => el.label === 'pnl');

    if (index === -1) {
      // insert new dataset
      this.chart.data.datasets.push({
        label: 'pnl',
        data: pnlCurrent,
        fill: false,
        borderWidth: 1,
        pointRadius: 0,
        borderColor: '#000',
        tension: 0
      });
    } else {
      // dont push if exists 
      this.chart.data.datasets[index].data = pnlCurrent;
    }

    this.chart.options.plugins.manyHorizonalLinesPlugin = { lines: [2] };
    this.chart.update();
  }

  events() {
    window.addEventListener('resize', () => {
      this.chart.update();
    });
  }
}

export default ChartItem;