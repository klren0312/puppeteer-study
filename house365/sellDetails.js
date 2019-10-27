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
  db.collection('url').find({}).toArray(function(err, doc) {
    assert.equal(null, err);
    (async () => {
      const bar = new ProgressBar({ 
        schema: ':bar.gradient(orange, red) :percent.green.bold',
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
            house.title = await page.$eval('.gr_cont_wrap.clearfix > .person_info_fl.fl > h2 > span', a => a.innerHTML)
            house.time = await page.$eval('body > div.gr_cont_wrap.clearfix > div.person_info_fl.fl > p > span.mr14', a => a.innerHTML)
            house.pm2 = await page.$eval('body > div.gr_cont_wrap.clearfix > div.person_info_fl.fl > div.gr_info_cont.clearfix > div.person_info.fl > div.gr_table.clearfix > dl.gr_dl_top.fl > dd > span > i:nth-child(2)', a => a.innerHTML)
            house.price = await page.$eval('body > div.gr_cont_wrap.clearfix > div.person_info_fl.fl > div.gr_info_cont.clearfix > div.person_info.fl > div.gr_table.clearfix > dl.gr_dl_top.fl > dd > span .bigfont', a => a.innerHTML)
            house.size = await page.$eval('body > div.gr_cont_wrap.clearfix > div.person_info_fl.fl > div.gr_info_cont.clearfix > div.person_info.fl > div.gr_table.clearfix > dl:nth-child(4) > dd', a => a.innerHTML)
            house.method = await page.$eval('body > div.gr_cont_wrap.clearfix > div.person_info_fl.fl > div.gr_info_cont.clearfix > div.person_info.fl > div.gr_table.clearfix > dl:nth-child(3) > dd', a => a.innerHTML)
            house.face = await page.$eval('body > div.gr_cont_wrap.clearfix > div.person_info_fl.fl > div.gr_info_cont.clearfix > div.person_info.fl > div.gr_table.clearfix > dl:nth-child(7) > dd', a => a.innerHTML)
            house.houseType = await page.$eval('body > div.gr_cont_wrap.clearfix > div.person_info_fl.fl > div.gr_info_cont.clearfix > div.person_info.fl > div.gr_table.clearfix > dl:nth-child(5) > dd', a => a.innerHTML)
            house.type = await page.$eval('#wylx', a => a.innerHTML)
            house.decoration = await page.$eval('body > div.gr_cont_wrap.clearfix > div.person_info_fl.fl > div.gr_info_cont.clearfix > div.person_info.fl > div.gr_table.clearfix > dl:nth-child(9) > dd', a => a.innerHTML)
            house.ownership = await page.$eval('body > div.gr_cont_wrap.clearfix > div.person_info_fl.fl > div.gr_info_cont.clearfix > div.person_info.fl > div.gr_table.clearfix > dl:nth-child(10) > dd', a => a.innerHTML)
            house.floor = await page.$eval('body > div.gr_cont_wrap.clearfix > div.person_info_fl.fl > div.gr_info_cont.clearfix > div.person_info.fl > div.gr_table.clearfix > dl:nth-child(6) > dd', a => a.innerHTML)
            house.school = await page.$eval('body > div.gr_cont_wrap.clearfix > div.person_info_fl.fl > div.gr_info_cont.clearfix > div.person_info.fl > div.gr_table.clearfix > dl.gr_dl_bottom.xq_dl_bottom.fl > dd > a:nth-child(1)', a => a.innerHTML)
            house.community = await page.$eval('#posts > dd', a => a.innerHTML)
            house.phone = await page.$eval('body > div.gr_cont_wrap.clearfix > div.person_info_fl.fl > div.gr_info_cont.clearfix > div.person_info.fl > div.gr_tell.clearfix > div.gr_tell_fl.fl > div.clearfix.tell-num', a => a.innerHTML)
            house.name = await page.$eval('body > div.gr_cont_wrap.clearfix > div.person_info_fr.fl > div.person_information > div.person_name.p_person_name.clearfix > a', a => a.innerHTML)
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
