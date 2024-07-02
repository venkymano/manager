import Request, { setMethod, setURL, setData, setHeaders } from '../request';

export const getFilters = (url: string) => 
    Request<any[]>(
        setURL(
          url
        ),
        setMethod('GET'),
        setHeaders({
          Authorization: 'Bearer vagrant',
        })
      );