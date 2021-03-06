const ProgressBars = require('..');

// const title = 'download files';
const total = 100;

const bars = new ProgressBars({
  // title,
  // clear: true,
  complete: '=',
  incomplete: '-',
  display: '[:bar] :text :percent :time :completed/:total'
});

let completed1 = 0;
let completed2 = 0;

function downloading() {
  if (completed1 <= total || completed2 <= total) {
    completed1 += 1
    completed2 += 2
    bars.render([
      { completed: completed1, total, text: "file1" },
      { completed: completed2, total, text: "file2" }
    ]);

    // here ==>
    if (completed1 % 20 === 0) bars.console(completed1);
    // <== here

    setTimeout(function () {
      downloading();
    }, 100)
  }
}

downloading();