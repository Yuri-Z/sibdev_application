import axios from 'axios'
import decodeB64 from './decodeB64'

export default async function authorization(token) {
  const result = await axios.get('/users.json', {}).then((response) => response.data)
  const auth = JSON.parse(decodeB64(token))

  return Object.keys(result).some(index => {
    if (result[index].login === auth.login && result[index].password === auth.password) {
      let favorites = localStorage.getItem('favorites')
      if (favorites === '[object Object]') {
        localStorage.removeItem('favorites')
        favorites = null
      }
      if (favorites === null) {
        localStorage.setItem('favorites', JSON.stringify({ [auth.login]: {} }))
      } else if (!JSON.parse(favorites)[auth.login]) {
        const newFavorites = JSON.parse(favorites)
        newFavorites[auth.login] = {}
        localStorage.setItem('favorites', JSON.stringify(newFavorites))
      }
      return true
    }
  })
}
