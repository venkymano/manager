import { GetJWETokenPayload } from '@linode/api-v4';

import resources from 'src/__data__/resources';

export const mapResourceIdToName = (id: string, resources: any[]) => {
  if (!resources || resources.length == 0) {
    return id;
  }
  const results = resources.filter(
    (resourceObj) => resourceObj.id && resourceObj.id == id
  );

  // if we are able to find a match, then return the label
  if (results.length > 0 && results[0].label) {
    return results[0].label;
  }

  // since we didn't find the match, return the id
  return id;
};

export const getDimensionName = (metric: any, flag: any, resources: any[]) => {
  let labelName = '';
  Object.keys(metric).forEach((key) => {
    if (flag && key == flag.metricKey) {
      labelName =
        labelName +
        mapResourceIdToName(metric[flag.metricKey], resources) +
        '_';
    } else {
      labelName = labelName + metric[key] + '_';
    }
  });

  return labelName.slice(0, -1);
};

// returns a list of resource IDs to be passed as part of getJWEToken call
export const getResourceIDsPayload = (resources: any) => {
  const jweTokenPayload: GetJWETokenPayload = {
    resource_id: [],
  };

  if (resources?.data) {
    jweTokenPayload.resource_id = resources?.data?.map(
      (resource: any) => resource.id
    );
  }
  return jweTokenPayload;
};
