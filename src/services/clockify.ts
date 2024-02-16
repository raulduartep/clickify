import axios from 'axios'

export const createClockifyAxios = (apiKey?: string, path?: string) => {
  return axios.create({
    baseURL: `https://api.clockify.me/api/v1/${path ?? ''}`,
    headers: {
      'X-Api-Key': apiKey,
    },
  })
}
