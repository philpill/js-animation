(function(window, document, undefined){

  var canvas = document.getElementById('Canvas');
  var ctx = canvas.getContext('2d');
  var pauseLink = document.getElementById('PauseLink');
  var resumeLink = document.getElementById('ResumeLink');
  var frameId = document.getElementById('FrameId');
  var fpsEl = document.getElementById('Fps');

  function tick () {
    frameId.innerHTML = id;
    fpsEl.innerHTML = Math.round(fps*100)/100;
    clearCanvas();
    drawImage();
    setDirectionByDestination();
    drawSprite();
  }

  function drawImage () {

      ctx.drawImage(img, 0, 0);
  }

  function getFrameByDirection () {
    var frame = 0;
    switch (direction) {
      case 1:
        frame = 5
        break;
      case 2:
        frame = 3
        break;
      case 3:
        frame = 7
        break;
      case 4:
        frame = 1
        break;
    }
    return frame;
  }

  function getAlternateFrame (frame) {

    var alternate = 0;
    switch (frame) {
      case 1:
        alternate = 2;
        break;
      case 2:
        alternate = 1;
        break;
      case 3:
        alternate = 4;
        break;
      case 4:
        alternate = 3;
        break;
      case 5:
        alternate = 6;
        break;
      case 6:
        alternate = 5;
        break;
      case 7:
        alternate = 8;
        break;
      case 8:
        alternate = 7;
        break;
    }

    return alternate;
  }

  function drawSprite () {

    var currentTime = new Date().getTime();

    if (!animationTime) {
      animationTime = currentTime;
    }

    var difference = currentTime - animationTime;
    var isAlternate = false;

    if (difference > 300) {
      isAlternate = true;
    }

    if (difference > 600) {
      animationTime = currentTime;
    }

    frame = getFrameByDirection();
    if (isAlternate) { frame = getAlternateFrame(frame); }

    if (currentTime - idleTime > 10000) {
      frame = 9;
    }
    if (currentTime - idleTime > 10100) {
      frame = 0;
    }
    if (currentTime - idleTime > 10250) {
      frame = 9;
    }
    if (currentTime - idleTime > 10400) {
      frame = 0;
      resetIdleTime();
    }

    var position = frame * 20;
    var deltaX = 0;
    var deltaY = 0;
    if (direction) {

      switch (direction) {
        case 1:
          deltaX = -1;
          break;
        case 2:
          deltaY = -1;
          break;
        case 3:
          deltaX = 1;
          break;
        case 4:
          deltaY = 1;
          break;
      }

      positionX = (positionX + deltaX * speed);
      positionY = (positionY + deltaY * speed);
    }

    if (positionX < 0) { positionX = 0; }
    if (positionY < 20) { positionY = 20; }

    if (positionX > canvas.width - 20) { positionX = canvas.width - 20; }
    if (positionY > canvas.height - 20) { positionY = canvas.height - 20; }

    ctx.drawImage(img, position, 0, 20, 20, positionX, positionY, 20, 20);
  }

  function pauseLinkOnClick (e) {
    e.preventDefault();
    pause();
  }

  function resumeLinkOnClick (e) {
    e.preventDefault();
    resume();
  }

  function resume () {
    if (!id) {
      loop();
    }
  }

  function pause () {
    window.cancelAnimationFrame(id);
    id = null;
  }

  function clearCanvas () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function resetIdleTime () {
    idleTime = new Date().getTime();
  }

  function canvasOnClick (e) {
    resume();
    resetIdleTime();
    var position = getClickPosition(e);
    setDestination(position);
  }

  function setDestination (position) {
    destinationX = position.x;
    destinationY = position.y;
  }

  function getClickPosition (e) {
    var x;
    var y;
    if (e.pageX || e.pageY) {
      x = e.pageX;
      y = e.pageY;
    }
    else {
      x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
    return {
      x : x,
      y : y
    }
  }

  function canvasOnBlur (e) {
    pause();
  }

  function canvasOnKeydown (e) {
    resetIdleTime();
    switch (e.keyCode) {
      case 37: // left
        direction = 1;
        break;
      case 38: // up
        direction = 2;
        break;
      case 39: // right
        direction = 3;
        break;
      case 40: // down
        direction = 4;
        break;
    };
  }

  function setDirectionByDestination () {

    if (!destinationX && !destinationY) {
      direction = 0;
      return;
    }

    if (destinationX === positionX) {
      destinationX = null;
    }

    if (destinationY === positionY) {
      destinationY = null;
    }

    if (destinationX && destinationX > positionX) {
      direction = 3;
    }

    if (destinationX && destinationX < positionX) {
      direction = 1;
    }

    if (destinationY && destinationY > positionY) {
      direction = 4;
    }

    if (destinationY && destinationY < positionY) {
      direction = 2;
    }

  }

  function canvasOnKeyup (e) {
    direction = 0;
    animationId = null;
  }

  var id;
  var time;
  var fps;
  var direction;
  var animationTime;
  var positionX = 40;
  var positionY = 40;
  var speed = 1;
  var idleTime;
  var destinationX;
  var destinationY;

  var img = new Image();

  img.src = 'figure_1.png';

  function attachEventListeners () {
    pauseLink.addEventListener('click', pauseLinkOnClick, false);
    resumeLink.addEventListener('click', resumeLinkOnClick, false);
    canvas.addEventListener('keydown', canvasOnKeydown, false);
    canvas.addEventListener('keyup', canvasOnKeyup, false);
    canvas.addEventListener('click', canvasOnClick, false);
    canvas.addEventListener('blur', canvasOnBlur, false);
  };

  function loop () {
    var newTime = new Date().getTime();
    fps = time ? 1 / ((newTime - time)/1000) : 0;
    time = newTime;
    id = window.requestAnimationFrame(loop);
    tick();
  }

  function initialiseCanvas () {
    // http://www.dbp-consulting.com/tutorials/canvas/CanvasKeyEvents.html
    canvas.setAttribute('tabindex', 0);
  }

  function init () {
    initialiseCanvas();
    attachEventListeners();
    drawImage();
    loop();
    canvas.focus();
    idleTime = new Date().getTime();
  }

  init();

})(window, document);