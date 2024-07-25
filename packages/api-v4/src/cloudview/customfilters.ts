import Request, { setMethod, setURL } from '../request';

export const getFilters = (url: string) =>
  Request<any[]>(setURL(url), setMethod('GET'));
