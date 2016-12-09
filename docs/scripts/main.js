'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var edit = document.getElementById('edit');
  var mousedown = {};
  var circles = [];

  var dragging = false;
  var editMode = false;
  var moving = false;
  var drawingCircle = '';
  var editCircle = '';

  var Circle = function () {
    function Circle(x, y, r) {
      _classCallCheck(this, Circle);

      this.x = x;
      this.y = y;
      this.r = r;
    }

    _createClass(Circle, [{
      key: 'draw',
      value: function draw() {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
        ctx.fill();
      }
    }, {
      key: 'move',
      value: function move(x, y) {
        this.x = x;
        this.y = y;
        this.draw();
      }
    }]);

    return Circle;
  }();

  function windowToCanvas(x, y) {
    var bbox = canvas.getBoundingClientRect();
    return {
      x: x - bbox.left,
      y: y - bbox.top
    };
  }

  canvas.addEventListener('mousedown', function (e) {
    var loc = windowToCanvas(e.clientX, e.clientY);

    // drawMode
    mousedown.x = loc.x;
    mousedown.y = loc.y;
    dragging = true;

    // editMode
    if (editMode) {
      circles.forEach(function (c) {
        c.draw();
        if (ctx.isPointInPath(mousedown.x, mousedown.y)) {
          moving = true;
          editCircle = c;
        }
      });
    }
  }, false);

  canvas.addEventListener('mousemove', function (e) {
    var loc = windowToCanvas(e.clientX, e.clientY);
    var radian = Math.sqrt((mousedown.x - loc.x) ** 2 + (mousedown.y - loc.y) ** 2);

    // drawMode
    if (!editMode && dragging) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      circles.forEach(function (c) {
        return c.draw();
      });

      drawingCircle = new Circle(mousedown.x, mousedown.y, radian);
      drawingCircle.draw();
    }

    // editmode && moving
    if (moving) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      circles.forEach(function (c) {
        return c.draw();
      });
      editCircle.move(loc.x, loc.y);
    }
  }, false);

  canvas.addEventListener('mouseup', function () {
    circles.push(drawingCircle);
    dragging = false;
    moving = false;
  }, false);

  edit.addEventListener('change', function () {
    editMode = edit.checked === true;
  }, false);
})();