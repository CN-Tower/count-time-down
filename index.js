/*!
 * time-cd.js(v1.0.1)
 * A CountDown handler, 一个js的倒计时类。
 */
(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
})((function () { 'use strict';

  var isFun = function isFun(value) {
    return typeof value === 'function';
  };

  var isObj = function isObj(value) {
    return Object.prototype.toString.call(value) === '[object Object]';
  };

  var isNum = function isNum(value) {
    return typeof value === 'number' && !Number.isNaN(value) && Number.isFinite(value);
  };

  /**
   * 一个倒计时专用工具类，可用来创建倒计时对象
   * @param {number} time 倒计时时间
   * @param {Object} options 倒计时参数
   * @param {Function} tickCallback 倒计时步进回调
   *
   * @example
   * import CountDown from 'time-cd'; 
   * // In NodeJS
   * // const CountDown = require('time-cd');
   *
   * // 1、创建并自动开启一个24小时的倒计时
   * new CountDown(854e5, cd => console.log(cd.hhmmss));
   *
   * // 2、创建并自动开启一个60s的倒计时
   * new CountDown(60000, { cdType: 's' }, cd => console.log(cd.s));
   *
   * // 3、创建一个60s倒计时，并设置开始和结束
   * const countdown = new CountDown(60000, { autoStart: false }, () => {
   *   console.log(countdown);
   * });
   * countdown.start();
   * // A moment later
   * countdown.stop();
   * 
   * // 4、创建一个倒计时，自定义时间、处理函数和开启倒计时
   * const countdown = new CountDown();
   * countdown.onTick = cd => console.log(countdown)}
   * countdown.start();
   */
  function CountDown(time, options, tickCallback) {
    var _this3 = this;

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

    // 倒计时类型，'d': 计算到天；'h': 计算到小时；'m': 计算到分钟；'s': 计算到秒；默认：'h'
    this.cdType = ['d', 'h', 'm', 's'].indexOf(options.cdType) > -1 ? options.cdType : 'h';
    this.running = false;
    this.destoryed = false;
    this.completed = false;
    this.tickTimes = 0;
    this.restDays = null;
    this.restHours = null;
    this.restMinuts = null;
    this.restSeconds = null;
    this.d = '-';
    this.h = '-';
    this.m = '-';
    this.s = '-';
    this.dd = '--';
    this.hh = '--';
    this.mm = '--';
    this.ss = '--';
    this.ms = '-:-';
    this.hms = '-:-:-';
    this.mmss = '--:--';
    this.hhmmss = '--:--:--';
    this.timerId = null;

    /**
     * 开始倒计时
     */
    this.start = function () {
      var _this = this;

      if (this.destoryed) return;
      this.running = true;

      if (this.interval >= 0 && this.restTime >= this.interval) {
        this.timerId = setInterval(function () {
          return _this.tick();
        }, this.interval);
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
      var _this2 = this;

      if (!this.restTime || this.restTime < 0) {
        this.restTime = 0;
      }

      this.restSeconds = Math.floor(this.restTime / 1000);
      this.restDays = Math.floor(this.restTime / 864e5);
      this.restHours = Math.floor(this.restSeconds / 3600);
      this.restMinuts = Math.floor(this.restSeconds / 60);

      if (this.cdType === 'd') {
        var restSeconds = Math.floor(this.restTime % 864e5 / 1000);
        this.d = this.restDays;
        this.h = Math.floor(restSeconds / 3600);
        this.m = Math.floor(restSeconds % 3600 / 60);
        this.s = Math.floor(restSeconds % 60);
      } else if (this.cdType === 'h') {
        this.d = 0;
        this.h = this.restHours;
        this.m = Math.floor(this.restSeconds % 3600 / 60);
        this.s = Math.floor(this.restSeconds % 60);
      } else if (this.cdType === 'm') {
        this.d = 0;
        this.h = 0;
        this.m = this.restMinuts;
        this.s = Math.floor(this.restSeconds % 60);
      } else if (this.cdType === 's') {
        this.d = 0;
        this.h = 0;
        this.m = 0;
        this.s = this.restSeconds;
      }

      var dhms = 'dhms';
      var tpls = dhms.substr(dhms.indexOf(this.cdType));
      tpls.split('').forEach(function (item) {
        var itemStr = String(_this2[item]);
        _this2[item + item] = itemStr.length < 2 ? "00".concat(itemStr).substr(-2) : itemStr;
      });
      this.ms = "".concat(this.m, ":").concat(this.s);
      this.mmss = "".concat(this.mm, ":").concat(this.ss);
      this.hms = "".concat(this.h, ":").concat(this.m, ":").concat(this.s);
      this.hhmmss = "".concat(this.hh, ":").concat(this.mm, ":").concat(this.ss);
      ['dd', 'hh', 'mm', 'ss', 'ms', 'ms', 'hms', 'mmss', 'hhmmss'].forEach(function (item) {
        _this2[item] = _this2[item].replace(/-/g, '0');
      });
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
     * 判断是否自动开启
     */
    if (isNum(this.time)) {
      this.setValue();

      if (this.autoStart) {
        setTimeout(function () {
          return _this3.start();
        });
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
    }
  });
  module.exports = CountDown;

}));
