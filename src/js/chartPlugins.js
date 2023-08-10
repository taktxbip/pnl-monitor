import {
  totwo,
  timestampsToColor
} from '../helpers';

const zonesPlugin = {
  id: 'zonesPlugin',
  beforeDatasetsDraw(chart, args, options) {
    const { zones } = options;
    const {
      ctx,
      chartArea: { top, right, bottom, left, width, height },
      scales: { x, y }
    } = chart;

    ctx.save();

    if (typeof zones !== 'undefined' && zones.length) {
      zones.forEach(({ minPrice, maxPrice, minTimestamp, levels }) => {
        ctx.fillStyle = 'rgba(248,184,120, 0.5)';

        // draw strength
        const startFrom = left < x.getPixelForValue(minTimestamp) ? x.getPixelForValue(minTimestamp) : left;
        ctx.fillRect(
          startFrom,
          y.getPixelForValue(maxPrice),
          width,
          Math.abs(y.getPixelForValue(maxPrice) - y.getPixelForValue(minPrice))
        );

      });

    }

    ctx.restore();
  }
};

const tunnelsPlugin = {
  id: 'tunnelsPlugin',
  beforeDatasetsDraw(chart, args, options) {
    const { tunnels } = options;
    const {
      ctx,
      chartArea: { top, right, bottom, left, width, height },
      scales: { x, y }
    } = chart;

    ctx.save();

    ctx.lineWidth = 2;
    // ctx.strokeStyle = '#333';

    const slopesNames = ['slopeMin', 'slopeMax'];

    if (tunnels) {
      const lastTime = x.ticks.at(-1).value;

      tunnels.forEach(tunnel => {
        if (Object.keys(tunnel).length) {

          const c = timestampsToColor(tunnel.slopeMin.timeStart, tunnel.slopeMin.timeEnd);
          const color = `rgb(${c.r}, ${c.g}, ${c.b})`;
          const colorOpacity = `rgba(${c.r}, ${c.g}, ${c.b}, 0.05)`;

          slopesNames.forEach(slopeName => {
            const l = tunnel[slopeName];

            const p1 = [l.timeStart, l.slope * l.timeStart + l.yIntercept];
            const p2 = [l.timeEnd, l.slope * l.timeEnd + l.yIntercept];
            const p2Infinite = [lastTime, l.slope * lastTime + l.yIntercept];

            ctx.lineWidth = 1;
            ctx.strokeStyle = 'black';
            ctx.beginPath();
            ctx.moveTo(x.getPixelForValue(p1[0]), y.getPixelForValue(p1[1]));
            ctx.lineTo(x.getPixelForValue(p2Infinite[0]), y.getPixelForValue(p2Infinite[1]));
            ctx.stroke();

            ctx.strokeStyle = color;
            ctx.lineWidth = 2;

            ctx.beginPath();
            ctx.moveTo(x.getPixelForValue(p1[0]), y.getPixelForValue(p1[1]));
            ctx.lineTo(x.getPixelForValue(p2[0]), y.getPixelForValue(p2[1]));
            ctx.stroke();

            // draw text
            ctx.fillStyle = '#333';
            ctx.font = 'normal 9px sans-serif';
            const normalisedSlope = l.slopeNormalised;
            const text = `${normalisedSlope} (${l.pointsQty})`;
            const textSize = ctx.measureText(text);
            const yPos = slopeName === 'slopeMax' ? -20 : 20;
            ctx.fillText(text, x.getPixelForValue(l.timeEnd) - 2 * textSize.width, y.getPixelForValue(p2[1]) + yPos);

          });

          ctx.beginPath();
          ctx.fillStyle = colorOpacity;

          const p1 = [tunnel.slopeMax.timeStart, tunnel.slopeMax.slope * tunnel.slopeMax.timeStart + tunnel.slopeMax.yIntercept];
          const p2 = [lastTime, tunnel.slopeMax.slope * lastTime + tunnel.slopeMax.yIntercept];
          const p3 = [lastTime, tunnel.slopeMin.slope * lastTime + tunnel.slopeMin.yIntercept];
          const p4 = [tunnel.slopeMin.timeStart, tunnel.slopeMin.slope * tunnel.slopeMin.timeStart + tunnel.slopeMin.yIntercept];

          ctx.moveTo(x.getPixelForValue(p1[0]), y.getPixelForValue(p1[1]));
          ctx.lineTo(x.getPixelForValue(p2[0]), y.getPixelForValue(p2[1]));
          ctx.lineTo(x.getPixelForValue(p3[0]), y.getPixelForValue(p3[1]));
          ctx.lineTo(x.getPixelForValue(p4[0]), y.getPixelForValue(p4[1]));

          ctx.fill();
        }
      });
    }

    ctx.restore();
  }
};

const slopeLinesPlugin = {
  id: 'slopeLinesPlugin',
  beforeDatasetsDraw(chart, args, options) {
    const { lines } = options;
    const {
      ctx,
      chartArea: { top, right, bottom, left, width, height },
      scales: { x, y }
    } = chart;

    ctx.save();

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'red';

    const lastTime = x.ticks.at(-1).value;

    for (const type in lines) {

      lines[type].forEach(l => {

        const p1 = [l.timeStart, l.slope * l.timeStart + l.yIntercept];
        const p2 = [l.timeEnd, l.slope * l.timeEnd + l.yIntercept];
        const p2Infinite = [lastTime, l.slope * lastTime + l.yIntercept];

        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(x.getPixelForValue(p1[0]), y.getPixelForValue(p1[1]));
        ctx.lineTo(x.getPixelForValue(p2Infinite[0]), y.getPixelForValue(p2Infinite[1]));
        ctx.stroke();

        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(x.getPixelForValue(p1[0]), y.getPixelForValue(p1[1]));
        ctx.lineTo(x.getPixelForValue(p2[0]), y.getPixelForValue(p2[1]));
        ctx.stroke();

        // draw text
        ctx.fillStyle = '#333';
        ctx.font = 'normal 9px sans-serif';

        const normalisedSlope = l.slopeNormalised;
        const text = `${normalisedSlope} (${l.pointsQty})`;
        const textSize = ctx.measureText(text);
        const yPos = type === 'slopeMax' ? -20 : 20;
        ctx.fillText(text, x.getPixelForValue(l.timeEnd) - 2 * textSize.width, y.getPixelForValue(p2[1]) + yPos);

      });
    }

    ctx.restore();
  }
};

const linesPlugin = {
  id: 'linesPlugin',
  beforeDatasetsDraw(chart, args, options) {
    const { lines } = options;
    const {
      ctx,
      chartArea: { top, right, bottom, left, width, height },
      scales: { x, y }
    } = chart;

    ctx.save();

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#333';

    if (typeof lines !== 'undefined') {
      lines.forEach(line => {

        ctx.beginPath();
        ctx.moveTo(x.getPixelForValue(line.x1), y.getPixelForValue(line.y1));
        ctx.lineTo(x.getPixelForValue(line.x2), y.getPixelForValue(line.y2));
        ctx.stroke();

      });
    }

    ctx.restore();
  }
};


const localExtremumsPluginSimple = {
  id: 'localExtremumsPluginSimple',
  beforeDatasetsDraw(chart, args, options) {
    const { locals } = options;
    const {
      ctx,
      chartArea: { top, right, bottom, left, width, height },
      scales: { x, y }
    } = chart;

    ctx.save();

    if (typeof locals !== 'undefined') {

      const width = 6;
      ctx.lineWidth = 2;
      for (let mode in locals) {
        locals[mode].forEach((ext) => {
          ctx.beginPath();
          ctx.moveTo(x.getPixelForValue(ext.x) - width, y.getPixelForValue(ext.y));
          ctx.lineTo(x.getPixelForValue(ext.x) + width, y.getPixelForValue(ext.y));
          ctx.stroke();
        });
      }

    }

    ctx.restore();
  }
};

const localExtremumsPlugin = {
  id: 'localExtremumsPlugin',
  beforeDatasetsDraw(chart, args, options) {
    const { locals } = options;
    const {
      ctx,
      chartArea: { top, right, bottom, left, width, height },
      scales: { x, y }
    } = chart;

    ctx.save();

    if (typeof locals !== 'undefined') {

      const width = 10;
      ctx.lineWidth = 3;
      for (let mode in locals) {
        locals[mode].forEach(({ timestamp, price, belowSlow, higherSlow }) => {

          if (higherSlow) ctx.strokeStyle = '#782424';
          if (belowSlow) ctx.strokeStyle = '#277824';

          ctx.beginPath();
          ctx.moveTo(x.getPixelForValue(timestamp) - width, y.getPixelForValue(price));
          ctx.lineTo(x.getPixelForValue(timestamp) + width, y.getPixelForValue(price));
          ctx.stroke();

          // draw text
          const textSize = ctx.measureText(price);
          const xVertical = textSize.width / 2;
          ctx.font = 'normal 9px sans-serif';
          const yPos = mode === 'max' ? -10 : 10;
          ctx.fillText(price, x.getPixelForValue(timestamp) - xVertical, y.getPixelForValue(price) + yPos);
        });
      }

    }

    ctx.restore();
  }
};

const levelPlugin = {
  id: 'levelPlugin',
  beforeDatasetsDraw(chart, args, options) {
    const { levels } = options;
    const {
      ctx,
      chartArea: { top, right, bottom, left, width, height },
      scales: { x, y }
    } = chart;

    ctx.save();

    const dashes = 4;
    if (typeof levels !== 'undefined') {
      levels.forEach(level => {

        const { timestamp, price, reboundType, reboundStrength } = level;

        const color = reboundType === 'up' ? '#277824' : '#782424';
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = color;
        ctx.fillStyle = color;

        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x.getPixelForValue(timestamp), y.getPixelForValue(price));
        ctx.lineTo(right, y.getPixelForValue(price));
        ctx.stroke();

        // draw strength
        ctx.lineWidth = 1;
        ctx.setLineDash([]);
        let strength = Math.abs(y.getPixelForValue(price - reboundStrength) - y.getPixelForValue(price));
        strength = reboundType === 'down' ? strength : -strength;

        for (let i = 0; i < dashes; i++) {
          const startFrom = left < x.getPixelForValue(timestamp) ? x.getPixelForValue(timestamp) : left;
          ctx.fillRect(startFrom + i * width / dashes, y.getPixelForValue(price), 1, strength);
        }

        // draw point
        ctx.beginPath();
        ctx.arc(x.getPixelForValue(timestamp), y.getPixelForValue(price), 3, 0, 2 * Math.PI);
        ctx.fill();

        // draw text
        const text = `${price} (${totwo(100 * reboundStrength / price)})`;
        ctx.font = 'normal 12px sans-serif';
        const startFrom = left < x.getPixelForValue(timestamp) ? x.getPixelForValue(timestamp) : left;
        ctx.fillText(text, startFrom + 10, y.getPixelForValue(price) - 10);

      });

    }

    ctx.restore();
  }
};

const manyHorizonalLinesPlugin = {
  id: 'manyHorizonalLinesPlugin',
  beforeDatasetsDraw(chart, args, options) {
    const { lines } = options;
    const {
      ctx,
      chartArea: { top, right, bottom, left, width, height },
      scales: { x, y }
    } = chart;

    ctx.save();

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    // ctx.setLineDash([2, 10]);

    if (typeof lines !== 'undefined') {
      lines.forEach(line => {
        ctx.strokeRect(left, y.getPixelForValue(line), width, 0);
        ctx.strokeRect(left, y.getPixelForValue(line), width, 0);
      });
    }

    ctx.restore();
  }
};

const rectanglesPlugin = {
  id: 'rectanglesPlugin',
  beforeDatasetsDraw(chart, args, options) {
    const { rectangles } = options;
    const {
      ctx,
      chartArea: { top, right, bottom, left, width, height },
      scales: { x, y }
    } = chart;

    ctx.save();

    ctx.fillStyle = 'rgba(139,69,19,0.5)';

    if (typeof rectangles !== 'undefined') {
      rectangles.forEach(rect => {
        ctx.fillRect(
          x.getPixelForValue(rect.x),
          y.getPixelForValue(rect.y),
          x.getPixelForValue(rect.x + rect.w) - x.getPixelForValue(rect.x),
          y.getPixelForValue(rect.y) - y.getPixelForValue(rect.y + rect.h)
        );
      });

    }

    ctx.restore();
  }
};


const horizonalLinesPlugin = {
  id: 'horizonalLinesPlugin',
  beforeDatasetsDraw(chart, args, options) {
    const { min, max } = options;
    const {
      ctx,
      chartArea: { top, right, bottom, left, width, height },
      scales: { x, y }
    } = chart;

    ctx.save();

    ctx.strokeStyle = 'grey';
    ctx.setLineDash([2, 10]);

    if (!isNaN(min) && min !== null) ctx.strokeRect(left, y.getPixelForValue(min), width, 0);
    if (!isNaN(max) && max !== null) ctx.strokeRect(left, y.getPixelForValue(max), width, 0);

    ctx.restore();
  }
};

const verticalLinesPlugin = {
  id: 'verticalLinesPlugin',
  beforeDatasetsDraw(chart, args, options) {
    const { lines } = options;
    const {
      ctx,
      chartArea: { top, right, bottom, left, width, height },
      scales: { x, y }
    } = chart;

    ctx.save();

    if (typeof lines !== 'undefined') {

      lines.forEach(time => {

        ctx.setLineDash([10, 10]);
        ctx.strokeStyle = 'grey';

        ctx.beginPath();
        ctx.moveTo(x.getPixelForValue(time), top);
        ctx.lineTo(x.getPixelForValue(time), bottom);
        ctx.stroke();

      });
    }

    ctx.restore();
  }
};

const cursor = {
  id: 'cursor',
  beforeDatasetsDraw(chart, args, options) {
    const { lines } = options;
    const {
      ctx,
      chartArea: { top, right, bottom, left, width, height },
      scales: { x, y }
    } = chart;

    ctx.save();

    if (typeof lines !== 'undefined') {

      lines.forEach(time => {

        ctx.strokeStyle = '#00008a';
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(x.getPixelForValue(time), top);
        ctx.lineTo(x.getPixelForValue(time), bottom);
        ctx.stroke();

      });
    }

    ctx.restore();
  }
};

const pointsPlugin = {
  id: 'pointsPlugin',
  beforeDatasetsDraw(chart, args, options) {
    const { points } = options;
    const {
      ctx,
      chartArea: { top, right, bottom, left, width, height },
      scales: { x, y }
    } = chart;

    ctx.save();

    if (typeof points !== 'undefined') {

      points.forEach(point => {

        // draw points
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x.getPixelForValue(point.x), y.getPixelForValue(point.y), 3, 0, 2 * Math.PI);
        ctx.fill();

      });
    }

    ctx.restore();
  }
};

const newsPlugin = {
  id: 'newsPlugin',
  beforeDatasetsDraw(chart, args, options) {
    const { news } = options;
    const {
      ctx,
      chartArea: { top, right, bottom, left, width, height },
      scales: { x, y }
    } = chart;

    ctx.save();

    if (typeof news !== 'undefined') {
      ctx.fillStyle = '#ff9b9a';

      ctx.setLineDash([10, 10]);
      ctx.strokeStyle = 'grey';

      news.forEach((p, index) => {

        ctx.beginPath();
        ctx.moveTo(x.getPixelForValue(p.timestamp), top);
        ctx.lineTo(x.getPixelForValue(p.timestamp), bottom);
        ctx.stroke();

        ctx.fillStyle = '#ff9b9a';
        ctx.beginPath();
        ctx.arc(x.getPixelForValue(p.timestamp), height - 30, 5, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = '#333';
        ctx.font = 'normal 9px sans-serif';
        const textSize = ctx.measureText(p.label);
        if (index % 2) ctx.fillText(p.label, x.getPixelForValue(p.timestamp) - textSize.width * 0.5, height - 10);
        else ctx.fillText(p.label, x.getPixelForValue(p.timestamp) - textSize.width * 0.5, height - 50);

      });
    }

    ctx.restore();
  }
};


const ordersPlugin = {
  id: 'ordersPlugin',
  beforeDatasetsDraw(chart, args, options) {
    const { orders } = options;
    const {
      ctx,
      chartArea: { top, right, bottom, left, width, height },
      scales: { x, y }
    } = chart;

    ctx.save();

    if (typeof orders !== 'undefined') {

      orders.forEach(order => {

        const { createdTime, activeTime, closeTime, priceIn, closePrice, type, sl, tp, infoTP, killPrice, reason } = order;

        ctx.setLineDash([10, 10]);
        ctx.strokeStyle = 'grey';
        ctx.beginPath();
        ctx.moveTo(x.getPixelForValue(createdTime), 0);
        ctx.lineTo(x.getPixelForValue(createdTime), height);
        ctx.stroke();

        ctx.setLineDash([]);

        if (closeTime) {
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.strokeStyle = '#000';
          ctx.moveTo(x.getPixelForValue(closeTime), 0);
          ctx.lineTo(x.getPixelForValue(closeTime), height);
          ctx.stroke();
        }

        // draw points
        ctx.fillStyle = '#000';
        if (activeTime) {
          ctx.beginPath();
          ctx.arc(x.getPixelForValue(activeTime), y.getPixelForValue(priceIn), 3, 0, 2 * Math.PI);
          ctx.fill();
        }

        if (closeTime) {
          ctx.beginPath();
          ctx.arc(x.getPixelForValue(closeTime), y.getPixelForValue(closePrice), 3, 0, 2 * Math.PI);
          ctx.fill();

          if (type === 'long') {
            if (closePrice > priceIn) {
              ctx.fillStyle = 'rgba(0, 150, 0, 0.1)';
            } else {
              ctx.fillStyle = 'rgba(150, 0, 0, 0.1)';
            }
          }

          if (type === 'short') {
            if (closePrice < priceIn) {
              ctx.fillStyle = 'rgba(0, 150, 0, 0.1)';
            } else {
              ctx.fillStyle = 'rgba(150, 0, 0, 0.1)';
            }
          }

          ctx.beginPath();
          ctx.moveTo(x.getPixelForValue(activeTime), 0);
          ctx.lineTo(x.getPixelForValue(activeTime), height);
          ctx.lineTo(x.getPixelForValue(closeTime), height);
          ctx.lineTo(x.getPixelForValue(closeTime), 0);
          ctx.fill();
        }

        // draw lines
        if (activeTime) {
          ctx.setLineDash([]);
          ctx.strokeStyle = type === 'long' ? '#277824' : '#782424';
          ctx.beginPath();
          ctx.moveTo(x.getPixelForValue(activeTime), 0);
          ctx.lineTo(x.getPixelForValue(activeTime), height);
          ctx.stroke();
        }

        if (sl) {
          ctx.strokeStyle = '#ee6b6e';
          ctx.setLineDash([]);
          if (!closeTime) {
            ctx.strokeRect(x.getPixelForValue(activeTime), y.getPixelForValue(sl), 100000, 0);
          } else {
            ctx.strokeRect(
              x.getPixelForValue(activeTime),
              y.getPixelForValue(sl),
              Math.abs(x.getPixelForValue(activeTime) - x.getPixelForValue(closeTime)),
              0);
          }
        }

        // tps
        ctx.strokeStyle = '#277824';
        ctx.setLineDash([]);
        const tps = [tp, infoTP];

        tps.forEach(el => {
          if (!closeTime) {
            ctx.strokeRect(x.getPixelForValue(activeTime), y.getPixelForValue(el), 100000, 0);
          } else {
            ctx.strokeRect(
              x.getPixelForValue(activeTime),
              y.getPixelForValue(el),
              Math.abs(x.getPixelForValue(activeTime) - x.getPixelForValue(closeTime)),
              0);
          }
        });


        ctx.fillStyle = 'red';
        ctx.font = 'normal 12px sans-serif';
        const text = [
          `priceIn: ${priceIn}`,
          `reason: ${reason}`,
          `tp: ${tp}`,
          `infoTP: ${infoTP} `,
          `SL: ${sl} `,
          `type: ${type} `,
          `killPrice: ${killPrice}`
        ];
        const increment = 20;
        text.forEach((line, i) => {
          ctx.fillText(line, x.getPixelForValue(activeTime), top + i * increment);
        });

      });
    }

    ctx.restore();
  }
};

const klinePlugin = {
  id: 'klinePlugin',
  beforeDatasetsDraw(chart, args, options) {
    const { klines } = options;
    const {
      ctx,
      chartArea: { top, right, bottom, left, width, height },
      scales: { x, y }
    } = chart;

    ctx.save();

    if (typeof klines !== 'undefined') {
      const kWidth = 3;
      klines.forEach(k => {
        // g : r 
        ctx.fillStyle = k.open <= k.close ? '#3CB371' : '#c23b22';

        // draw shadow 
        ctx.fillRect(
          x.getPixelForValue(k.openTime),
          y.getPixelForValue(k.high),
          1,
          Math.abs(y.getPixelForValue(k.high) - y.getPixelForValue(k.low))
        );

        // draw candle
        ctx.fillRect(
          x.getPixelForValue(k.openTime) - 1,
          y.getPixelForValue(Math.max(k.open, k.close)),
          kWidth,
          Math.abs(y.getPixelForValue(k.open) - y.getPixelForValue(k.close))
        );
      });
    }

    // if (typeof book !== 'undefined') {

    //   book.buy.forEach(el => {
    //     ctx.strokeStyle = `rgba(34, 139, 34, ${ el.q })`;
    //     ctx.strokeRect(left, y.getPixelForValue(el.p), width * 0.1, 0);
    //   });

    //   book.sell.forEach(el => {
    //     ctx.strokeStyle = `rgba(220, 20, 60, ${ el.q })`;
    //     ctx.strokeRect(left, y.getPixelForValue(el.p), width * 0.1, 0);
    //   });
    // }

    ctx.restore();
  }
};

const bookOrdersPlugin = {
  id: 'bookOrdersPlugin',
  beforeDatasetsDraw(chart, args, options) {
    const { book } = options;
    const {
      ctx,
      chartArea: { top, right, bottom, left, width, height },
      scales: { x, y }
    } = chart;

    ctx.save();

    if (typeof book !== 'undefined') {

      book.buy.forEach(el => {
        ctx.strokeStyle = `rgba(34, 139, 34, ${el.q})`;
        ctx.strokeRect(left, y.getPixelForValue(el.p), width * 0.1, 0);
      });

      book.sell.forEach(el => {
        ctx.strokeStyle = `rgba(220, 20, 60, ${el.q})`;
        ctx.strokeRect(left, y.getPixelForValue(el.p), width * 0.1, 0);
      });
    }

    ctx.restore();
  }
};

export {
  linesPlugin,
  horizonalLinesPlugin,
  ordersPlugin,
  bookOrdersPlugin,
  klinePlugin,
  levelPlugin,
  zonesPlugin,
  localExtremumsPlugin,
  localExtremumsPluginSimple,
  manyHorizonalLinesPlugin,
  rectanglesPlugin,
  slopeLinesPlugin,
  tunnelsPlugin,
  pointsPlugin,
  verticalLinesPlugin,
  newsPlugin,
  cursor
};