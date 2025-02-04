import { Box, Typography } from '@linode/ui';
import { useTheme } from '@mui/material';
import React from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { AlertResources } from '../../AlertsResources/AlertsResources';
import { getAlertBoxStyles } from '../../Utils/utils';

import type { CreateAlertDefinitionForm } from '../types';
import type { FieldPathByValue } from 'react-hook-form';

export interface CloudPulseModifyAlertResourcesProp {
  /**
   * Whether create or edit flow
   */
  isCreate?: boolean;

  /**
   * name used for the component in the form
   */
  name: FieldPathByValue<CreateAlertDefinitionForm, string[]>;
}

export const CloudPulseModifyAlertResources = React.memo(
  (props: CloudPulseModifyAlertResourcesProp) => {
    const { isCreate, name } = props;

    const theme = useTheme();
    const {
      control,
      formState,
      setValue,
      getValues,
    } = useFormContext<CreateAlertDefinitionForm>();
    const serviceTypeWatcher = useWatch({ control, name: 'serviceType' });

    const handleResourcesSelection = (resourceIds: string[]) => {
      setValue('entity_ids', resourceIds, {
        shouldTouch: true,
        shouldValidate: true,
      });
    };

    React.useEffect(() => {
      if (serviceTypeWatcher && isCreate) {
        setValue('entity_ids', [], { shouldValidate: true });
      }
    }, [isCreate, serviceTypeWatcher, setValue]);

    React.useEffect(() => {
      setValue('entity_ids', getValues('entity_ids'), { shouldValidate: true });
    }, [formState.isSubmitted, getValues, setValue]);

    return (
      <Controller
        render={({ field, fieldState }) => (
          <Box mt={3}>
            <Box
              alignItems="center"
              display="flex"
              gap={2}
              sx={{ marginBottom: 1 }}
            >
              <Typography variant="h2">2. Resources</Typography>
            </Box>
            <Box sx={{ ...getAlertBoxStyles(theme), overflow: 'auto' }}>
              <AlertResources
                noSelectionErrorText={
                  (formState.isSubmitted || fieldState.isTouched) &&
                  fieldState.error
                    ? fieldState.error.message
                    : undefined
                }
                alertResourceIds={field.value}
                alertType="user"
                handleResourcesSelection={handleResourcesSelection}
                hideLabel
                isSelectionsNeeded
                serviceType={serviceTypeWatcher || undefined}
              />
            </Box>
          </Box>
        )}
        control={control}
        name={name}
      />
    );
  }
);
