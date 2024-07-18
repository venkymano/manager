import Request, { setMethod, setURL, setHeaders } from '../request';

export const getFilters = (url: string) =>
  Request<any[]>(setURL(url), setMethod('GET'));
