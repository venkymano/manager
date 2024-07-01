import { ResourcePage } from 'src/types';
// import { API_ROOT } from '../constants';

import Request, { setMethod, setURL, setData, setHeaders } from '../request';
import { Dashboard, JWEToken, GetJWETokenPayload } from './types';

export const getFilters = (url: string) => 
    Request<CloudPulseSelectOptions>(
        setURL(
          `http://blr-lhv95n.bangalore.corp.akamai.com:9000/v4/monitor/services/linode/dashboards`
        ),
        setMethod('GET'),
        setHeaders({
          Authorization: 'Bearer vagrant',
        })
      );


export interface CloudPulseSelectOptions {
id: string;
label: string;
}