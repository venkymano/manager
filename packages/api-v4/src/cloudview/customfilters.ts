import { ResourcePage } from 'src/types';
// import { API_ROOT } from '../constants';

import Request, { setMethod, setURL, setData, setHeaders } from '../request';
import { Dashboard, JWEToken, GetJWETokenPayload } from './types';

export const getFilters = (url: string) => 
    Request<any>(
        setURL(
          url
        ),
        setMethod('GET'),
        setHeaders({
          Authorization: 'Bearer vagrant',
        })
      );