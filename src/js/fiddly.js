// odd things can go here
// this is a potential poolyfill for request animation frame
import delay from "delay";

export const rqanf = (function() {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      return window.setTimeout(callback, 1000 / 60);
    }
  );
})();

// trying to smooth things with the d3 animation so that we get some
// vue dom updates as well otherwise everything just stops for d3 to do its thing
// the idea is to wait for a bit, then jump in at the next animation frame opportunity
export const delayAnimation = (ms, callback) => {
  return new Promise((resolve, reject) => {
    delay(ms || 0).then(() => {
      rqanf(() => {
        try {
          resolve(callback());
        } catch (err) {
          reject(err);
        }
      });
    });
  });
};
