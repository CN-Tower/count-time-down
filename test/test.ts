/**
 * run this demo: npm run test:ts
 */
import CountDown from '..';

// const cd = new CountDown();
// cd.time = 10000;
// cd.cdType = 's';
// cd.onTick = cd => console.log(cd);
// cd.start();

new CountDown(10000, { interval: 50 }, ({ss, SSS}) => console.log(`${ss} ${SSS}`));
