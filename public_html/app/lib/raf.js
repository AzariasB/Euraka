[ "r", "webkitR", "mozR", "msR", "oR" ].reduce(function( p, v ) {
  return window[ v + p ] || p;
}, "equestAnimationFrame");