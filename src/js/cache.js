// this used to be on redis, but we need it client side now
// so the is a just a gist compressed
const { decompress } = require("./compress");
const { queryDefinition } = require("./settings");
// got doesnt work client sidenormal 
import ky  from 'ky'

// this should get us the latest raw url for this gist
const raw = () => { 

  return ky.get(queryDefinition.gistApi).json()
    .then(r => { 
      return r.files && r.files[Object.keys(r.files)[0]].raw_url
    })
}

// cache is using gist now
export const cacheGet = async () => {
  // no need for the github api to get this
  const rawUrl = await raw()
  const response = await ky.get(rawUrl)
  const text = await response.text()
  return text &&  decompress(text);
}
