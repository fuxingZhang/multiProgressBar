// Type definitions

interface ProgressBarOptions {
  /**
   * Progress bar title, default: ''
   */
  title?: string;

  /**
   * tthe displayed width of the progress, default: 50
   */
  width?: number;

  /**
   * completion character, default: colors.bgGreen(' '), can use any string
   */
  complete?: string;

  /**
   * incomplete character, default: colors.bgWhite(' '), can use any string
   */
  incomplete?: string;

  /**
   * minimum time between updates in milliseconds, default: 16
   */
  interval?: number;

  /**
   * What is displayed and display order, default: ':bar :text :percent :time :completed/:total'
   */
  display?: string;

  /**
   * clear the bar on completion, default: false
   */
  clear?: boolean;
}

interface BarState {
  completed: number;
  /** optional, total number of ticks to complete, default: 100 */
  total?: number;
  /** text displayed per ProgressBar, default: '' */
  text?: string;
}

declare class ProgressBars {
  /**
   * Options:
   *   - `title` optional, Progress bar title, default: ''
   *   - `width` optional, the displayed width of the progress, default: 50
   *   - `complete` optional, completion character, default: colors.bgGreen(' '), can use any string
   *   - `incomplete` optional, incomplete character, default: colors.bgWhite(' '), can use any string
   *   - `interval` optional, minimum time between updates in milliseconds, default: 16
   *   - `display` optional, What is displayed and display order, default: ':title :percent :bar :time :completed/:total'
   *   - `clear` optional, clear the bar on completion, default: false
   */
  constructor(options: ProgressBarOptions);

  /**
   * "render" the progress bar with completed and optional `total`
   *
   *  - `bars` progress bars
   *    - `completed` completed value
   *    - `total` optional, total number of ticks to complete, default: 100
   *    - `text` optional, text displayed per ProgressBar, default: ''
   */
  render(bars: BarState[]): void;

  /**
   * interrupt the progress bar and write a message above it
   */
  console(message: string | number): void;

  /**
   * end a progress bar.
   */
  end(): void;
}

export = ProgressBars;

