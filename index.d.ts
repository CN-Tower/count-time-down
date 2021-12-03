/**
 * Time，倒计时时间
 */
type CountDownTime = number | null | undefined;

/**
 * Initial Options, 倒计时初始化参数
 */
interface CountDownOptions {
  // 是否自动开启，默认为: true
  autoStart?: boolean;
  // 倒计时类型，'d': 计算到天；'h': 计算到小时；'m': 计算到分钟；'s': 计算到秒；默认：'h'
  cdType?: 'd' | 'h' | 'm' | 's';
  // 倒计时步进间隔，默认: 1000
  interval?: number;
}
 
/**
 * CountDown 构造定义
 */
declare class CountDown {
  time: number | null;             // 倒计时时间
  options: CountDownOptions;       // 初始化的参数
  initTime: number | null;         // 初始化的时间
  restTime: number;                // 剩余时间
  interval: number;                // 定时间隔
  autoStart: boolean;              // 是否自动启动
  cdType: 'd' | 'h' | 'm' | 's';   // 倒计时类型
  running: boolean;                // 是否运行中
  destoryed: boolean;              // 是否已销毁
  completed: boolean;              // 是否已结束
  tickTimes: boolean;              // 步进次数
  restDays: boolean;               // 剩余天数
  restHours: boolean;              // 剩余小时
  restMinuts: boolean;             // 剩余分钟
  restSeconds: boolean;            // 剩余秒数
  d: number | '-';                 // 天数, '-'
  h: number | '-';                 // 小时, '-'
  m: number | '-';                 // 分钟, '-'
  s: number | '-';                 // 秒数, '-'
  dd: string;                      // 至少两位天数，'--'
  hh: string;                      // 至少两位小时，'--'
  mm: string;                      // 至少两位分钟，'--'
  ss: string;                      // 至少两位秒数，'--'
  ms: string;                      // 分秒，'-:-'
  hms: string;                     // 时分秒，'-:-:-'
  mmss: string;                    // 分钟秒数：'--:--'
  hhmmss: string;                  // 小时分钟秒数：'--:--:--'
  timerId: any;                    // 定时器ID
  start: () => void;               // 开启倒计时
  stop: () => void;                // 停止倒计时
  destory: () => void;             // 销毁倒计时
  onTick?: (cd: CountDown) => any; // 自定义步进处理函数
  [prop: string]: any;             // 其它属性

  constructor(tickHandler?: (cd: CountDown) => any);
  constructor(time: CountDownTime, tickHandler?: (cd: CountDown) => any);
  constructor(time: CountDownTime, options: CountDownOptions, tickHandler?: (cd: CountDown) => any);
}

export = CountDown;
export as namespace CountDown;
