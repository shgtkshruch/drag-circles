(() => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const edit = document.getElementById('edit');
  const mousedown = {};
  const circles = [];

  let dragging = false;
  let editMode = false;
  let moving = false;
  let drawingCircle = '';
  let editCircle = '';

  class Circle {
    constructor(x, y, r) {
      this.x = x;
      this.y = y;
      this.r = r;
    }

    draw() {
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
      ctx.fill();
    }

    move(x, y) {
      this.x = x;
      this.y = y;
      this.draw();
    }
  }

  function windowToCanvas(x, y) {
    const bbox = canvas.getBoundingClientRect();
    return {
      x: x - bbox.left,
      y: y - bbox.top,
    };
  }

  canvas.addEventListener('mousedown', (e) => {
    const loc = windowToCanvas(e.clientX, e.clientY);

    // drawMode
    mousedown.x = loc.x;
    mousedown.y = loc.y;
    dragging = true;

    // editMode
    if (editMode) {
      circles.forEach((c) => {
        c.draw();
        if (ctx.isPointInPath(mousedown.x, mousedown.y)) {
          moving = true;
          editCircle = c;
        }
      });
    }
  }, false);

  canvas.addEventListener('mousemove', (e) => {
    const loc = windowToCanvas(e.clientX, e.clientY);
    const radian = Math.sqrt(((mousedown.x - loc.x) ** 2) + ((mousedown.y - loc.y) ** 2));

    // drawMode
    if (!editMode && dragging) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      circles.forEach(c => c.draw());

      drawingCircle = new Circle(mousedown.x, mousedown.y, radian);
      drawingCircle.draw();
    }

    // editmode && moving
    if (moving) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      circles.forEach(c => c.draw());
      editCircle.move(loc.x, loc.y);
    }
  }, false);

  canvas.addEventListener('mouseup', () => {
    circles.push(drawingCircle);
    dragging = false;
    moving = false;
  }, false);

  edit.addEventListener('change', () => {
    editMode = edit.checked === true;
  }, false);
})();
