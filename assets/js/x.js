gyro.frequency = 100

function range (val, min, max) {
  return Math.max(Math.min(val, max), min)
}

// Create the Sequences
var prev = 0
var gyroTracking = Rx.Observable
  .create(function (observer) {
    gyro.startTracking(function (o) {
      observer.onNext(o)
    }) 
  })
  .distinctUntilChanged(function(o) {
    return Math.round(o.beta) + Math.round(o.gamma)
  })
  .map(function (o) {
    return {
      x: range(o.beta * 2, -100, 100),
      y: range(o.gamma * 2, -100, 100),
      delta: Math.sqrt(o.beta*o.beta + o.gamma*o.gamma) / 10,
      type: 'gyro'
    }
  })

var mouseTracking = Rx.Observable
  .fromEvent($(document), 'mousemove')
  .map(function (e) {
    return {
      x: (e.clientX - $(window).width() / 2) * 200 / $(window).width(),
      y: (e.clientY - $(window).height() / 2) * 200 / $(window).height(),
      type: 'mouse'
    }
  })
  .map(function(o) {
    return {
      x: o.x,
      y: o.y,
      type: o.type,
      delta: Math.sqrt(o.x*o.x + o.y*o.y)/100
    }
  })

var source = Rx.Observable
  .merge(
    gyroTracking.takeUntil(mouseTracking),
    mouseTracking
  )
  

var deg = 0

source.subscribe(
  function (o) {
    deg += o.delta
    console.log(deg, o.x, o.y)
    $('#sunsetX').css('transform', 'translateY(' + o.x + 'px)')
    $('#splash').css('transform', 'rotate(' + deg + 'deg)')
  },
  function () {
    console.log('Completed');
  }
);

