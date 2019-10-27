const puppeteer = require('puppeteer');
const ProgressBar = require('ascii-progress');
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const dburl = 'mongodb://localhost:27017'
const dbName = 'houseurlhf'

MongoClient.connect(dburl, (err, client) => {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  (async () => {
    const browser = await puppeteer.launch({
      headless: true
    })
    try {
      const page = await browser.newPage()
      await page.goto('http://hf.rent.house365.com/district_rent/h2-r1.html')
      const bar = new ProgressBar({ 
        schema: ':bar.gradient(green, blue) :percent.green.bold',
        total : 5
      })

      let arr = await page.$$eval('#pjax_search div.line1.fl.listItem__title > a', (a) => 
        a.map((v) => { 
          return {url: v.href}
        }
      ))
      db.collection('url').insertMany(arr, function (err, r) {
        assert.equal(null, err)
      })
      bar.tick()
      for(let i = 2; i <= 5; i++) {
        await page.goto(`http://hf.rent.house365.com/district/h2-p${i}-r1.html`)
        let urls = await page.$$eval('#pjax_search div.line1.fl.listItem__title > a', a =>
          a.map(v => {
            return {url: v.href}
          }
        ))
        db.collection('url').insertMany(urls, function (err, r) {
          assert.equal(null, err)
        })
        bar.tick()
      }
    } catch (e) {
      console.log('err', e)
    } finally {
      await browser.close()
      client.close()
    }
  })();

});
