import { Box, Button } from '@linode/ui';
import { useTheme } from '@mui/material';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { ActionsPanel } from 'src/components/ActionsPanel/ActionsPanel';
import { Breadcrumb } from 'src/components/Breadcrumb/Breadcrumb';
import { ConfirmationDialog } from 'src/components/ConfirmationDialog/ConfirmationDialog';
import NullComponent from 'src/components/NullComponent';
import {
  useAlertDefinitionQuery,
  useEditAlertDefinitionResources,
} from 'src/queries/cloudpulse/alerts';

import { AlertResources } from '../AlertsResources/AlertsResources';
import { getAlertBoxStyles } from '../Utils/utils';

import type { AlertRouteParams } from '../AlertsDetail/AlertDetail';

export const EditAlertResources = () => {
  const { alertId, serviceType } = useParams<AlertRouteParams>();

  const history = useHistory();

  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();

  const { data: alertDetails, isError, isFetching } = useAlertDefinitionQuery(
    Number(alertId),
    serviceType
  );

  const {
    isError: isEditAlertError,
    mutateAsync: editAlert,
    reset: resetEditAlert,
  } = useEditAlertDefinitionResources(serviceType, Number(alertId));

  const generateCrumbOverrides = () => {
    const overrides = [
      {
        label: 'Definitions',
        linkTo: '/monitor/cloudpulse/alerts/definitions',
        position: 1,
      },
      {
        label: 'Edit',
        linkTo: `/monitor/cloudpulse/alerts/definitions/edit/${serviceType}/${alertId}`,
        position: 2,
      },
    ];

    return { newPathname: '/Definitions/Edit', overrides };
  };

  const { newPathname, overrides } = React.useMemo(
    () => generateCrumbOverrides(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const selectedResourcesRef = React.useRef<string[]>([]);

  const [showConfirmation, setShowConfirmation] = React.useState<boolean>(
    false
  );

  if (isError) {
    return <NullComponent />;
  }

  if (isFetching) {
    return <NullComponent />;
  }

  if (!alertDetails) {
    return <NullComponent />;
  }

  const handleResourcesSelection = (resourceIds: string[]) => {
    selectedResourcesRef.current = resourceIds; // here we just keep track of it, on save we will update it
  };

  const saveResources = async () => {
    setShowConfirmation(false);
    await editAlert({
      resource_ids: selectedResourcesRef.current,
    }).then(() => {
      history.push('/monitor/cloudpulse/alerts/definitions');
      enqueueSnackbar('Alert resources successfully updated.', {
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top', // Show snackbar at the top
        },
        autoHideDuration: 5000,
        style: {
          marginTop: '150px',
        },
        variant: 'success',
      });
    });
  };

  const handleDialogOpenClose = () => {
    window.scrollTo({ behavior: 'smooth', top: 0 }); // Scroll to the top
    setShowConfirmation(!showConfirmation);
  };

  if (isEditAlertError) {
    enqueueSnackbar('Error while updating the resources. Try again later.', {
      anchorOrigin: {
        horizontal: 'right',
        vertical: 'top', // Show snackbar at the top
      },
      autoHideDuration: 5000,
      style: {
        marginTop: '150px',
      },
      variant: 'error',
    });
    resetEditAlert();
  }

  return (
    <>
      <Breadcrumb crumbOverrides={overrides} pathname={newPathname} />
      <Box
        sx={{
          backgroundColor:
            theme.name === 'light' ? theme.color.grey5 : theme.color.grey9,
        }}
        display="flex"
        flexDirection="column"
      >
        <Box sx={getAlertBoxStyles}>
          <AlertResources
            alertLabel={alertDetails.label}
            handleResourcesSelection={handleResourcesSelection}
            isSelectionsNeeded
            resourceIds={alertDetails.resource_ids}
            serviceType={alertDetails.service_type}
          />
        </Box>
        <Box alignSelf={'flex-end'} m={3} mt={0}>
          <Button buttonType="primary" onClick={handleDialogOpenClose}>
            Save
          </Button>
        </Box>
        <ConfirmationDialog
          actions={
            <ActionsPanel
              secondaryButtonProps={{
                label: 'Cancel',
                onClick: handleDialogOpenClose,
              }}
              primaryButtonProps={{ label: 'Confirm', onClick: saveResources }}
            />
          }
          onClose={() => setShowConfirmation(!showConfirmation)}
          open={showConfirmation}
          title="Confirm alert updates"
        >
          You have changes the resource settings for your alert.
          <br /> This also updates your alert definition.
        </ConfirmationDialog>
      </Box>
    </>
  );
};
