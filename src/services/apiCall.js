import { http } from '@/services/http';

const baseUrl = 'https://api.magicthegathering.io/v1/';

export function getAllCards() {
  return new Promise((resolve, reject) => {
    http.get(`${baseUrl}/cards`)
      .then((res) => {
        resolve(res.data.cards);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
