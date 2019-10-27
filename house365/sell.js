const puppeteer = require('puppeteer');
const ProgressBar = require('ascii-progress');
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const dburl = 'mongodb://localhost:27017'
const dbName = 'njsellhouse'

MongoClient.connect(dburl, (err, client) => {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  (async () => {
    const browser = await puppeteer.launch({
      headless: true
    })
    const page = await browser.newPage()
    await page.goto('http://nj.sell.house365.com/district/')
    const bar = new ProgressBar({ 
      schema: ':bar.gradient(green, blue) :percent.green.bold',
      total : 100
    })
    let arr = await page.$$eval('#qy_list_cont .info_list dl .fir_infodd .title.fl', (a) => 
      a.map((v) => { 
        return {url: v.href}
      }
    ))
    db.collection('url').insertMany(arr, function (err, r) {
      assert.equal(null, err)
    })
    for(let i = 2; i <= 100; i++) {
      await page.goto(`http://nj.sell.house365.com/district/dl_p${i}.html`)
      let urls = await page.$$eval('#qy_list_cont .info_list dl .fir_infodd .title.fl', a =>
        a.map(v => {
          return {url: v.href}
        }
      ))
      db.collection('url').insertMany(urls, function (err, r) {
        assert.equal(null, err)
      })
      bar.tick()
    }
    browser.close()
  })();

});
