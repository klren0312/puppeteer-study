const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
    // devtools: false
  });

  const page = await browser.newPage();
  page.goto('https://juejin.im/welcome/frontend');
  page.screenshot({
    path: 'job.png'
  });
  page.on('load', async () => {
    const box = await page.evaluate(() => {
      const people = document.querySelectorAll('.content-box .info-box .info-row .meta-list .item.username .user-popover-box a')
      const title = document.querySelectorAll('.content-box .info-box .title-row .title')
      const peopleArr = Array.prototype.map.call(people, v => {
        return {
          user: v.innerText,
          link: v.href
        }
      })

      let articleArr = Array.prototype.map.call(title, (v, i) => {
        return {
          title: v.innerText,
          link: v.href,
          people: peopleArr[i]
        }
      })

      return {
        article: articleArr
      }
    })
    console.log(box)
    await browser.close();
  })
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