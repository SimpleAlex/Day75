var BackgroundAnimation = (function() {

  function Blob(attr) {
    this.drawStyle = attr.drawStyle;
    this.points = attr.points;
    this.color = attr.color;
  }

  Blob.prototype.render = function(ctx) {
    var firstPoint, ctrlPoint, nextPoint,
        that = this;

    firstPoint = this.points[0];

    ctx.save();
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;
    ctx.lineWidth = 0.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    this.points.forEach(function(p, i) {

      nextPoint = that.points[i + 1];
      if (nextPoint) {
        ctrlPoint = {
          x: (p.x + nextPoint.x) / 2,
          y: (p.y + nextPoint.y) / 2
        };
        ctx.quadraticCurveTo(p.x, p.y, ctrlPoint.x, ctrlPoint.y);
      } else {
        ctrlPoint = {
          x: (that.points[that.points.length - 1].x + firstPoint.x) / 2,
          y: (that.points[that.points.length - 1].y + firstPoint.y) / 2
        };
        ctx.quadraticCurveTo(
          that.points[that.points.length - 1].x,
          that.points[that.points.length - 1].y,
          ctrlPoint.x, ctrlPoint.y
        ) ;
      }
    });
    ctx.closePath();
    if (this.drawStyle === 'stroke') {
      ctx.stroke();
    } else if (this.drawStyle === 'fill') {
      ctx.fill();
    }
    ctx.restore();
  };

  var width, height,
      canvas, ctx,
      blobs;

  function init(size, cnvs) {
    width = size.width;
    height = size.height;
    canvas = cnvs;
    ctx = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;

    blobs = generateBlobs(8);

    ctx.fillStyle = '#1d1719';
  }

  function generateBlobs(num) {
    var i, blob, blobs,
        point, x, y,
        angle, radius,
        drawStyle, color,
        offset,
        divider;

    blobs = [];
    divider = 9;

    for (i = 1; i < num; i += 1) {
      blob = [];
      for (angle = 0; angle <= Math.PI * 2; angle += 0.45) {
        offset = -20 + Math.random() * 20;
        if (i === 1) {
          radius = height / divider * (i * 1.5);
          drawStyle = 'fill';
          color = '#212020';
        } else if (i === 2) {
          radius = height / divider * (i * 1.2);
          drawStyle = 'stroke';
          color = '#25ad43';
        } else if (i === 3) {
          radius = height / divider * (i * 0.8);
          drawStyle = 'stroke';
          color = '#25ad43';
        }
        x = width / 2 + Math.sin(angle) * radius;
        y = height / 2 + Math.cos(angle) * radius;
        point = {
          x: x, y: y,
          targetX: x + offset, targetY: y + offset,
          angle: Math.random() * (Math.PI * 2),
          speed: 0.05 + Math.random() * 0.05
        };
        blob.push(point);
      }
      blobs.push(new Blob({
        drawStyle: drawStyle,
        points: blob,
        color: color
      }));
    }
    return blobs;
  }

  function render() {
    ctx.fillRect(0, 0, width, height);
    blobs.forEach(renderBlob);
  }

  function renderBlob(blob) {
    blob.points.forEach(updatePoint);
    blob.render(ctx);
  }

  function updatePoint(p, i) {
    var radius;
    radius = 0.5;
    p.x = p.x + Math.sin(p.angle) * radius;
    p.y = p.y + Math.cos(p.angle) * radius;
    i % 2 === 0 ? p.angle += p.speed : p.angle -= p.speed;
  }

  return {
    init: init,
    render: render
  };
}());

BackgroundAnimation.init(
  { width: window.innerWidth, height: window.innerHeight },
  document.querySelector('canvas')
);

(function renderFrame() {
  window.requestAnimationFrame(renderFrame);
  BackgroundAnimation.render();
}());
