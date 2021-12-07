const isFun = value => typeof value === 'function';
const isObj = value => Object.prototype.toString.call(value) === '[object Object]';
const isNum = value => typeof value === 'number' && !Number.isNaN(value) && Number.isFinite(value);

/**
 * 一个倒计时专用工具类，可用来创建倒计时对象
 * @param {number} time 倒计时时间
 * @param {Object} options 倒计时参数
 * @param {Function} tickCallback 倒计时步进回调
 *
 * @example
 * import CountDown from 'count-time-down'; 
 * // In NodeJS
 * const CountDown = require('count-time-down');
 *
 * 1. 创建并自动开启一个24小时的倒计时
 * new CountDown(864e5, cd => console.log(cd.hhmmss));
 *
 * 2. 创建并自动开启一个60s的倒计时
 * new CountDown(10000, { cdType: 's' }, cd => console.log(cd.s));
 * 
 * 3. 创建一个可以显示毫秒的定时器
 * new CountDown(10000, { interval: 50 }, ({ss, SSS}) => { 
 *   console.log(`${ss} ${S}`);
 * });
 * 
 * 4. 创建一个60s倒计时，手动开始和结束
 * const cd = new CountDown(60000, { autoStart: false }, () => {
 *   console.log(cd);
 * });
 * // A moment later
 * cd.start();
 * 
 * 5. 创建一个倒计时，自定义参数再启动
 * const cd = new CountDown();
 * cd.time = 10000;
 * cd.cdType = 's';
 * cd.onTick = cd => console.log(cd);
 * cd.start();
 * // A moment later
 * cd.stop();
 * // A moment later
 * cd.start();
 * // Destory The countdown
 * cd.destory();
 */
function CountDown(time, options, tickCallback) {
  if (isFun(time)) {
    tickCallback = time;
  } else if (isFun(options)) {
    tickCallback = options;
  }
  options = isObj(options) ? options : {};
  this.options = options;
  // 初始时间
  this.initTime = isNum(time) ? time : null;
  // 剩余时间
  this.restTime = this.time;
  // 定时间隔
  this.interval = isNum(options.interval) ? options.interval : 1000;
  // 是否自动启动倒计时
  this.autoStart = options.autoStart !== false;
  // 倒计时类型，d: 到天，h: 到小时，m: 到分钟，s: 到秒，S: 到毫秒，默认：'h'.
  this.cdType = ['d', 'h', 'm', 's', 'S'].indexOf(options.cdType) > -1 ? options.cdType : 'h';
  this.running = false;
  this.destoryed = false;
  this.completed = false;
  this.tickTimes = 0;
  this.restDays = null;
  this.restHours = null;
  this.restMinuts = null;
  this.restSeconds = null;
  this.restMillisecond = null;
  this.d = null;
  this.h = null;
  this.m = null;
  this.s = null;
  this.S = null;
  this.dd = '--';
  this.hh = '--';
  this.mm = '--';
  this.ss = '--';
  this.SSS = '---';
  this.ms = '-:-';
  this.hms = '-:-:-';
  this.mmss = '--:--';
  this.hhmmss = '--:--:--';
  this.timerId = null;
  /**
   * 开始倒计时
   */
  this.start = function () {
    if (this.destoryed) return;
    this.running = true;
    if (this.interval >= 0 && this.restTime >= this.interval) {
      this.completed = false;
      clearInterval(this.timerId);
      this.timerId = setInterval(() => this.tick(), this.interval);
    } else {
      this.setComplete();
    }
  };
  /**
   * 暂停倒计时
   */
  this.stop = function () {
    clearInterval(this.timerId);
    this.running = false;
  };
  /**
   * 销毁倒计时
   */
  this.destory = function () {
    clearInterval(this.timerId);
    this.running = false;
    this.destoryed = true;
  };
  /**
   * 定时器结束
   */
  this.setComplete = function () {
    clearInterval(this.timerId);
    this.running = false;
    this.completed = true;
  };
  /**
   * 定时步进
   */
  this.tick = function () {
    this.tickTimes++;
    if (this.restTime > this.interval) {
      this.restTime -= this.interval;
      this.setValue();
    } else {
      this.restTime = 0;
      this.setValue();
      this.setComplete();
    }
    if (isFun(this.onTick)) this.onTick(this);
    if (isFun(tickCallback)) tickCallback(this);
  };
  /**
   * 设置定时器的值
   */
  this.setValue = function () {
    if (!this.restTime || this.restTime < 0) this.restTime = 0;
    this.restDays = Math.floor(this.restTime / 864e5);
    this.restHours = Math.floor(this.restTime / 36e5);
    this.restMinuts = Math.floor(this.restTime / 6e4);
    this.restSeconds = Math.floor(this.restTime / 1000);
    this.restMillisecond = this.restTime;
    if (this.cdType === 'd') {
      const restSeconds = Math.floor(this.restTime % 864e5 / 1000);
      this.d = this.restDays;
      this.h = Math.floor(restSeconds / 3600);
      this.m = Math.floor((restSeconds % 3600) / 60);
      this.s = Math.floor(restSeconds % 60);
    } else if (this.cdType === 'h') {
      this.d = 0;
      this.h = this.restHours;
      this.m = Math.floor((this.restSeconds % 3600) / 60);
      this.s = Math.floor(this.restSeconds % 60);
    } else if (this.cdType === 'm') {
      this.d = this.h = 0;
      this.m = this.restMinuts;
      this.s = Math.floor(this.restSeconds % 60);
    } else if (this.cdType === 's') {
      this.d = this.h = this.m = 0;
      this.s = this.restSeconds;
    } else if (this.cdType === 'S') {
      this.d = this.h = this.m = this.s = 0;
      this.S = this.restMillisecond;
    }
    if (this.cdType !== 'S') {
      this.S = Math.floor(this.restTime % 1000);
    }
    const dhmsS = 'dhmsS';
    dhmsS.substr(dhmsS.indexOf(this.cdType)).split('').forEach(item => {
      const itemStr = String(this[item]);
      let itemLen = 2, itemTpl = item + item;
      if (item === 'S') {
        itemLen ++;
        itemTpl += item;
      }
      this[itemTpl] = itemStr.length < itemLen ? ('00' + itemStr).substr(-itemLen) : itemStr;
    });
    const co = ':';
    this.ms = this.m + co + this.s;
    this.hms = this.h + co + this.m + co + this.s;
    this.mmss = this.mm + co + this.ss;
    this.hhmmss = this.hh + co + this.mm + co + this.ss;
    ['dd', 'hh', 'mm', 'ss', 'ms', 'hms', 'mmss', 'hhmmss'].forEach(item => {
      this[item] = this[item].replace(/-/g, '0');
    });
  };
  /**
   * 判断是否自动开启
   */
  if (isNum(this.time)) {
    this.setValue();
    if (this.autoStart) {
      setTimeout(() => this.start());
    }
  }
}
/**
 * 初始时间为null时，可以再次设置开始时间
 */
Object.defineProperty(CountDown.prototype, 'time', {
  get: function get() {
    return this.initTime;
  },
  set: function set(val) {
    if (isNum(val)) {
      this.initTime = val;
      this.restTime = val;
    }
  },
});
module.exports = CountDown;
