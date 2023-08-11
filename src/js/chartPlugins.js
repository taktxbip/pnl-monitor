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

    ctx.strokeStyle = 'green';
    ctx.lineWidth = 1;

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


export {
  linesPlugin,
  horizonalLinesPlugin,
  manyHorizonalLinesPlugin,
  rectanglesPlugin,
  slopeLinesPlugin,
  pointsPlugin,
  verticalLinesPlugin
};