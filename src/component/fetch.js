import axios from 'axios';
import { localeMessage } from './utils';
// export const HOST = 'https://070b0c13-1549-4828-9a44-df7c9964f56f.mock.pstmn.io';
export default function fetch(option = {}) {
  const { url, byteResponse = false, id,...rest } = option;
  return axios({
    url: url,
    headers: {
      'token': localStorage.getItem('token'),
    },
    ...rest,
  }).then(res => {    
    const { code, data } = res.data;
    const msg=res.data.message;
    if (code === 0) {
      return data;
    }
    if (byteResponse) {
      return data;
    }
    // message.error(msg || '服务器错误，请重试');
    return Promise.reject(new Error(localeMessage(msg)));
  });
}

