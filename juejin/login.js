const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
    devtools: false
  });

  const page = await browser.newPage();
  await page.goto('https://juejin.im/welcome/frontend');
  await page.screenshot({
    path: 'job.png'
  });
  timeout(4000);

  const box = await page.evaluate(() => {
    const title = document.querySelector('.content-box .info-box .info-row .meta-list .hot')
    return {
      title: title.innerText
    }
  })
  console.log(box)
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