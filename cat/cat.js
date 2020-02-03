const rp = require('request-promise')
const mysql = require('mysql2')

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'animal',
  port: 3306
})
conn.connect()

async function requestFnc (url) {
  console.log('start')
  const result = await rp(url, {
    headers: {
      'Authorization': '',
      'ContentType': 'application/json'
    }
  })
  const parseResult = JSON.parse(result)
  console.log(parseResult.page)
  for (let i = 0, len = parseResult.photos.length; i < len; i++) {
    saveData(parseResult.photos[i])
  }
  await sleep(3000)
  if (parseResult.hasOwnProperty('next_page')) {
    requestFnc(parseResult.next_page)
  }
}

async function saveData (data) {
  data = {...data, ...data.src }
  delete data.src
  const obj = { ...data }
  try {
    await conn.promise().query(`INSERT INTO animal SET ?`, obj)
  } catch (error) {
    console.log(error)
  }
}

function sleep (delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, delay)
  })
}


requestFnc('https://api.pexels.com/v1/search?query=cat&per_page=80&page=1')

