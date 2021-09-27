const fs = require('fs')

const requestProxy = require("request").defaults({
  proxy: "http://127.0.0.1:7890",
  rejectUnauthorized: false,
})

const login_url = 'https://discord.com/api/v9/auth/login'
const typing_url = 'https://discord.com/api/v9/channels/_id/typing'
const messages_url = 'https://discord.com/api/v9/channels/_id/messages'
const query_url = 'https://discord.com/api/v9/channels/_id/messages?limit=2'
const logout_url = 'https://discord.com/api/v9/auth/logout'

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
const user_agent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36'
const MAGIC = 890383850297884672

async function main() {
  
  if (process.argv.length < 3) {
    console.log('node discord.js password|- secret')
    return
  }

  let password1 = process.argv[2]
  let secret = process.argv[3]

  let list = fs.readFileSync('discord.txt')
  let lines = list.toString().split('\n')
  let output = ''
  for (let index in lines) {
    let line = lines[index]
    console.log(++index)
    if (line.startsWith('#')) continue
    let arr = line.split('|')
    if (arr.length != 3) continue
    let user = arr[0]
    let password = arr[1]
    let poap_bot_channel_id = arr[2]
    if (password == '*') {
      if (password1 == '-') {
        console.log('bad password')
        continue
      }
      password = password1
    }
    
    try {
      output += await worker(user, password, poap_bot_channel_id, secret)
    } catch (err) {
      console.log(err)
    }
  }

  fs.writeFileSync(secret + ".txt", output)
}

async function worker(user, password, poap_bot_channel_id, secret) {

  let headers = {
    'user-agent': user_agent,
  }

  let params = {
    "login": user,
    "password": password,
    "undelete": false,
    "captcha_key": null,
    "login_source": null,
    "gift_code_sku_id": null
  }

  console.log('login')
  let body = await synchronous_request('POST', login_url, params, headers)
  if (body.captcha_key != undefined) {
    console.log(body.captcha_key + '\n')
    
    return ''
  }

  let token = body.token
  if (token == undefined) {
    console.log('login failed\n')

    return ''
  }

  headers['authorization'] = token

  let _typing_url = typing_url.replace('_id', poap_bot_channel_id)
  let resp = await synchronous_request('POST', _typing_url, undefined, headers)
  
  await  wait(5000)
  
  console.log('send message ...')
  let _messages_url = messages_url.replace('_id', poap_bot_channel_id)
  let nonce = MAGIC + new Date().getTime() + Math.floor(Math.random() * 65535)
  params = {
    "content": secret,
    "nonce": nonce.toString(),
    "tts": false
  }

  resp = await synchronous_request('POST', _messages_url, params, headers)

  let result = await try_query(secret, headers, poap_bot_channel_id)
  
  console.log('logout\n')
  params = {
    "provider": null,
    "voip_provider": null
  }

  try {
    await synchronous_request('POST', logout_url, params, headers)
  } catch (err) {
    //
  }

  return result
} 

async function try_query(secret, headers, poap_bot_channel_id) {
  let i = 0;
  while (i < 3) {
    await wait(4000)

    let _query_url = query_url.replace('_id', poap_bot_channel_id)
    let resp = await synchronous_request('GET', _query_url, undefined, headers)
    let o = JSON.parse(resp)
    if (o.length == 2) {
      if (o[1].content == secret) {
        let content = o[0].content.toLowerCase()
        let idx = content.indexOf('http://poap.xyz/claim/')
        if (idx > 0) {
          content = content.substring(idx, idx + 28)
        }
        console.log('*** ' + content)

        return content + '\n'
      }
    }

    i++
  }

  console.log('failed to get code')

  return ''
}

// helper methods
let synchronous_request = function (method, url, params, headers) {

  let options = {
    url: url,
  }

if (method == 'GET') {
    if (params != undefined) {
      options['form'] = params
    }
    if (headers != undefined) {
      options['headers'] = headers
    }
    
    return new Promise(function (resolve, reject) {
      // If you don't use proxy, require("request").get(...) is ok
      // require("request").get(options, function (error, response, body) {
      requestProxy.get(options, function (error, response, body) {
            if (error) {
                reject(error)
            } else {
                resolve(body)
            }
        })
    })
  } else {
    if (params != undefined) {
      options['json'] = params
    }
    if (headers != undefined) {
      options['headers'] = headers
    }

    return new Promise(function (resolve, reject) {
      // require("request").post(options, function (error, response, body) {
      requestProxy.post(options, function (error, response, body) {
        if (error) {
            reject(error)
        } else {
            resolve(body)
        }
      })
    })
  }
}

main()