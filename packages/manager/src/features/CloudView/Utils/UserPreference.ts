import { getUserPreferences, updateUserPreferences } from '@linode/api-v4';

import { AclpConfig, AclpWidget } from '../Models/CloudPulsePreferences';

let userPreference: AclpConfig;

export const getUserPreference = async () => {
  const data = await fetchUserPreference();
  if (!data || !data.aclpPreference) {
    userPreference = {} as AclpConfig;
  } else {
    userPreference = { ...data.aclpPreference };
  }
  return data;
};

const fetchUserPreference = () => {
  return getUserPreferences();
};

export const fetchUserPrefObject: any = () => {
  return { ...userPreference };
};

const updateUserPreference = async (updatedData: AclpConfig) => {
  return await updateUserPreferences({ aclpPreference: updatedData });
};

export const updateGlobalFilterPreference = (data: {}) => {
  if (!userPreference) {
    userPreference = {} as AclpConfig;
  }
  userPreference = { ...userPreference, ...data };

  updateUserPreference(userPreference);
};

export const updateWidgetPreference = (label: string, data: {}) => {
  if (!userPreference) {
    userPreference = {} as AclpConfig;
  }
  let widgets = userPreference.widgets;
  if (!widgets) {
    widgets = {};
    userPreference.widgets = widgets;
  }

  if (Array.isArray(widgets)) {
    const widgetObj = {};
    widgets.forEach((wid) => {
      widgetObj[wid.label] = { ...wid };

      if (wid.label == label) {
        widgetObj[wid.label] = { ...data };
      }
    });

    userPreference.widgets = widgetObj;

    updateUserPreference(userPreference);
    return;
  }

  if (widgets[label]) {
    widgets[label] = { ...widgets[label], ...data };
  } else {
    widgets[label] = { label, ...data } as AclpWidget;
  }
  updateUserPreference(userPreference);
};
