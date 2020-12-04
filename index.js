/*
 * ProgressBars
 */
const colors = require('@zhangfuxing/colors/fn');

class ProgressBars {
  #end = false;
  #lastRows = 1;
  #strs = [];
  #startIndex = 0;

  /**
   * constructor
   * 
   * @param {String} [title] Progress bar title, default: ''
   * @param {Number} [width] the displayed width of the progress, default: 50
   * @param {String} [complete] completion character, default: colors.bgGreen(' '), can use any string
   * @param {String} [incomplete] incomplete character, default: colors.bgWhite(' '), can use any string
   * @param {Boolean} [clear]  clear the bar on completion, default: false
   * @param {Number} [interval]  minimum time between updates in milliseconds, default: 16
   * @param {String} [display]  What is displayed and display order, default: ':bar :text :percent :time :completed/:total'
   */
  constructor({ title = '', width, complete, incomplete, clear, interval, display } = {}) {
    this.width = width || 50;
    this.complete = complete || colors.bgGreen(' ');
    this.incomplete = incomplete || colors.bgWhite(' ');
    this.clear = clear || false;
    this.interval = interval || 16;
    this.display = display || ':bar :text :percent :time :completed/:total';
    this.stream = process.stdout;
    this.lastStr = '';
    this.start = Date.now();
    this.time = 0;
    this.lastRender = 0;

    if (title != '') {
      this.#strs.push(title);
      this.#startIndex = 1;
    }

    if (typeof title !== 'string') throw new Error(`title must be 'string'`);
    if (typeof this.width !== 'number') throw new Error(`width must be 'number'`);
    if (typeof this.complete !== 'string') throw new Error(`complete must be 'string'`);
    if (typeof this.incomplete !== 'string') throw new Error(`incomplete must be 'string'`);
    if (typeof this.clear !== 'boolean') throw new Error(`clear must be 'boolean'`);
    if (typeof this.interval !== 'number') throw new Error(`interval must be 'number'`);
    if (typeof this.display !== 'string') throw new Error(`display must be 'string'`);
  }

  /**
   * "render" the progress bar
   * 
   * @param {Object[]} bars Progress Bars
   * @param {Number} bars[].completed completed value
   * @param {Number} [bars[].total] total number of ticks to complete, default: 100
   * @param {String} [bars[].text] text displayed per ProgressBar, default: ''
   * 
   * @api public
   */
  render(bars) {
    if (this.#end || !this.stream.isTTY) return;

    const now = Date.now();
    const ms = now - this.lastRender;
    this.lastRender = now;
    this.time = ((now - this.start) / 1000).toFixed(1) + 's';
    let end = true;
    let index = this.#startIndex;
    for (let { completed, total = 100, text = "" } of bars) {
      completed = +completed;
      if (!Number.isInteger(completed)) throw new Error(`completed must be 'number'`);
      if (completed < 0) throw new Error(`completed must greater than or equal to 0`);
      if (!Number.isInteger(total)) throw new Error(`total must be 'number'`);
      if (completed > total && this.#strs[index] != undefined) continue;
      end = false;
      const percent = ((completed / total) * 100).toFixed(2) + '%';

      // :bar :text :percent :time :completed/:total
      let str = this.display
        .replace(':text', text)
        .replace(':time', this.time)
        .replace(':percent', percent)
        .replace(':completed', completed)
        .replace(':total', total);

      // compute the available space (non-zero) for the bar
      let availableSpace = Math.max(0, this.stream.columns - str.replace(':bar', '').length);
      if (availableSpace && process.platform === 'win32') availableSpace -= 1;

      const width = Math.min(this.width, availableSpace);

      // :bar
      const completeLength = Math.round(width * completed / total);
      const complete = new Array(completeLength).fill(this.complete).join('');
      const incomplete = new Array(width - completeLength).fill(this.incomplete).join('');

      str = str.replace(':bar', complete + incomplete);
      this.#strs[index++] = str;
    }
    if (ms < this.interval && end == false) return;
    const renderStr = this.#strs.join("\n") + "\x1b[?25l";

    if (this.lastStr !== renderStr) {
      this.stream.moveCursor(0, -this.#lastRows + 1);
      this.stream.cursorTo(0);
      this.stream.clearScreenDown();
      this.stream.write(renderStr);
      this.lastStr = renderStr;
      this.#lastRows = this.#strs.length;
    }

    if (end) this.end();
  }

  /**
   * end progress bars.
   * 
   * @api public
   */
  end() {
    this.#end = true;

    if (this.clear) {
      this.stream.moveCursor(0, -this.#lastRows + 1);
      this.stream.cursorTo(0);
      this.stream.clearScreenDown();
    } else {
      this.stream.write('\n');
    }
    this.stream.write('\x1b[?25h');
  }

  /**
   * interrupt the progress bar and write a message above it
   * 
   * @param {string | number} message The message to write
   * 
   * @api public
   */
  console(message) {
    this.stream.moveCursor(0, -this.#lastRows + 1);
    this.stream.cursorTo(0);
    this.stream.clearScreenDown();
    this.stream.write(`${message}`);
    this.stream.write('\n');
    this.stream.write(this.lastStr);
  };
}

module.exports = ProgressBars