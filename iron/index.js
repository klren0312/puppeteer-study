const puppeteer = require('puppeteer')

puppeteer.launch({
  headless: true,
  args: [ // 禁用一些功能
    '--no-sandbox', // 沙盒模式
    '--disable-setuid-sandbox', // uid沙盒
    '--disable-dev-shm-usage', // 创建临时文件共享内存
    '--disable-accelerated-2d-canvas', // canvas渲染
    '--disable-gpu' // GPU硬件加速
  ],
  ignoreDefaultArgs: ["--enable-automation"]
}).then(async browser => {
  const page = await browser.newPage()
  page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36')
  await page.goto('http://hq.zgw.com/huizong/59224.html')
  sleep(2000)
  let clip = await page.evaluate(() => {
    let {
      x,
      y,
      width,
      height
    } = document.querySelector('.neirong > table').getBoundingClientRect()
    return {
      x,
      y,
      width,
      height
    }
  })
  await page.screenshot({
    path: 'iron.png',
    clip: clip
  })

  await browser.close()
}).then(() => {

}).catch(e => {
  console.log(e)
})

function sleep(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), time)
  })
}