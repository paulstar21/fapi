export default function(ms, err) {
  ms = ms || 1000;
  return function(req, res, next) {
    setTimeout(next, ms, err);
  };
}
