const curry = f => (a, ...rest) =>
  rest.length ?
    f(a, ...rest) :
    (...rest) => f(a, ...rest);

const L = {};
L.map = curry(function* (f, iter) {
  for (const a of iter) {
    yield f(a);
  }
});

const map = curry((..._) => [...L.map(..._)]);

L.filter = curry(function* (f, iter) {
  for (const a of iter) {
    if (f(a)) yield a;
  }
});
const filter = curry((..._) => [...L.filter(..._)]);

L.takeUntil = curry(function* (f, iter) {
  for (const a of iter) {
    yield a;
    if (f(a)) break;
  }
});

const takeUntil = curry((..._) => [...L.takeUntil(..._)]);

L.take = curry((limit, iter) => L.takeUntil(_ => --limit == 0, iter));

const take = curry((..._) => [...L.take(..._)]);

L.range = function* (start, end, step = 1) {
  while (start < end) {
    yield start;
    start += step;
  }
};

const range = (..._) => [...L.range(..._)];

const go1 = (a, f) =>
  a instanceof Promise ? a.then(f) : f(a);

const reduce = curry(function(f, acc, iter) {
  if (arguments.length == 2) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }
  for (let a of iter) {
    acc = go1(acc, acc => f(acc, a));
  }
  return acc;
});

const add = (a, b) => a + b;

const go = (arg, ...fs) =>
  reduce((arg, f) => f(arg), arg, fs);

const pipe = (f, ...fs) => (...args) => go(f(...args), ...fs);

const sum = reduce(add);

const sumBy = curry((f, iter) => sum(map(f, iter)));

const isIterable = a => Boolean(a && a[Symbol.iterator]);

L.flat = function* (iter) {
  for (const a of iter) {
    if (isIterable(a)) {
      yield* a;
    } else {
      yield a;
    }
  }
};

const flat = iter => [...L.flat(iter)];