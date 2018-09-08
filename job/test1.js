const puppeteer = require('puppeteer');


(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1366,
      height: 768
    }
  });
  const page = await browser.newPage();
  await page.goto('http://jd.0550.com');
  await page.screenshot({
    path: 'job.png'
  });
  await page.tap('#username')
  await page.type('#username', '15755022403')

  await page.tap('#password')
  await page.type('#password', 'nodetech2018')
  await page.tap('.btn-login')

  await timeout(3000)
  await page.screenshot({
    path: 'job2.png'
  });
  browser.close();
})();

// 延时函数
let timeout = function (delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(1)
      } catch (e) {
        reject(0)
      }
    }, delay);
  })
}