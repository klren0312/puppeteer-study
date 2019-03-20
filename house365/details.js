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
  db.collection('url').find({}).toArray(function(err, doc) {
    assert.equal(null, err);
    (async () => {
      const bar = new ProgressBar({ 
        schema: ':bar.gradient(green, blue) :percent.green.bold',
        total : doc.length
      })
      const browser = await puppeteer.launch({
        headless: true
      })
      const page = await browser.newPage()
      for (let i = 0, len = doc.length; i < len; i++) {
        try {
          await page.goto(doc[i].url)
          let house = {}
          try {
            house.title = await page.$eval('.houseInformation.clearfix > .left > .titleT .h2 ', a => a.innerHTML)
            house.no = await page.$eval('.houseInformation > .left > .titleT  .numberT', a => a.innerHTML)
            house.price = await page.$eval('.houseInformation .houseInfo .houseInfoMain dl:nth-child(1) .info .number', a => a.innerHTML)
            house.size = await page.$eval('.houseInformation .houseInfo .houseInfoMain dl:nth-child(2) .info', a => a.innerHTML)
            house.decoration = await page.$eval('.houseInformation .houseInfo .houseInfoMain dl:nth-child(3) .info', a => a.innerHTML)
            house.floor = await page.$eval('.houseInformation .houseInfo .houseInfoMain dl:nth-child(5) .info', a => a.innerHTML)
            house.location = await page.$eval('.houseInformation .houseInfo .houseInfoMain dl:nth-child(6) .info', a => a.innerHTML)
            house.community = await page.$eval('.houseInformation .houseInfo .houseInfoMain dl:nth-child(7) .info > a', a => a.innerHTML)
            house.time = await page.$eval('.houseInformation .houseInfo .houseInfoMain .time', a => a.innerHTML)
            house.phone = await page.$eval('.houseInformation .houseInfo .houseInfoMain .telephoneBox .telephone .telephoneB .show .tel', a => a.innerHTML)
            house.name = await page.$eval('#personal > p.name', a => a.innerHTML)
            db.collection('details').insertOne(house, function (err, r) {
              assert.equal(null, err)
            })
          } catch (e) {
            // console.log(e)
          }
        } catch (error) {
        }
        bar.tick()
      }
      if(bar.completed) {
        browser.close()
        client.close();
      }
    })(doc);
  });
})
