import axios from 'axios'
const http = {
  withToken: function(token) {
    const client = {}
    client.get = function(url, config) {
      return axios.get(url, {
        ...config,
        headers: { ...config.headers, Authorization: token },
      })
    }
    client.post = function(url, data, config) {
      return axios.post(url, data, {
        ...config,
        headers: { ...config.headers, Authorization: token },
      })
    }
    return client
  },
}
export default http
