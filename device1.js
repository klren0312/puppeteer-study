const puppeteer = require('puppeteer')
const devices = require('puppeteer/DeviceDescriptors')
const iPhone = devices['iPhone 6']
let timeout = function (delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(1)
      } catch (e) {
        reject(0)
      }
    }, delay)
  })
}

(async () => {
  var browser = await puppeteer.launch({
    headless: false
  })

  const page = await browser.newPage()

  await page.emulate(iPhone)

  console.log('进入页面')

  await page.goto('https://y.qq.com/m/digitalbum/gold/index.html?_video=true&id=2210323&g_f=tuijiannewupload#index/fans')
  await timeout(1000)
  await page.screenshot({
    path: '1.png'
  })
  browser.close()
})