const CountDown = require('..');

console.log(CountDown);

const cd = new CountDown();

cd.time = 5000;
cd.onTick = cd => console.log(cd);
cd.start();
