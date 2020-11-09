import axios from 'axios';

export const http = {
  get(url, params) {
    return axios.get(url, {
      params,
    });
  },
};
