/**
 * run this demo: npm run test:js
 */
const CountDown = require('..');

const cd = new CountDown();
cd.time = 10010;
cd.interval = 800;
cd.onTick = cd => console.log(cd);
cd.start();
