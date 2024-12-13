import { waitFor } from '@testing-library/react';
import React from 'react';

import { alertFactory } from 'src/factories';
import { notificationChannelFactory } from 'src/factories/cloudpulse/channels';
import { renderWithTheme } from 'src/utilities/testHelpers';

import { AlertDetail } from './AlertDetail';

// Mock Data
const alertDetails = alertFactory.build({ service_type: 'linode' });
const notificationChannels = notificationChannelFactory.buildList(3, {
  content: { channel_type: { email_addresses: ['1@test.com', '2@test.com'] } },
});
// Mock Queries
const queryMocks = vi.hoisted(() => ({
  useAlertDefinitionQuery: vi.fn(),
  useAlertNotificationChannelsQuery: vi.fn(),
}));

vi.mock('src/queries/cloudpulse/alerts', () => ({
  ...vi.importActual('src/queries/cloudpulse/alerts'),
  useAlertDefinitionQuery: queryMocks.useAlertDefinitionQuery,
  useAlertNotificationChannelsQuery:
    queryMocks.useAlertNotificationChannelsQuery,
}));

// Shared Setup
beforeEach(() => {
  queryMocks.useAlertDefinitionQuery.mockReturnValue({
    data: alertDetails,
    isError: false,
    isFetching: false,
  });
  queryMocks.useAlertNotificationChannelsQuery.mockReturnValue({
    data: notificationChannels,
    isError: false,
    isFetching: false,
  });
});

describe('AlertDetail component tests', () => {
  it('should render the alert detail component successfully on proper inputs', async () => {
    const { getByText } = renderWithTheme(<AlertDetail />);
    await waitFor(() => {
      expect(getByText('Overview')).toBeInTheDocument();
      expect(getByText('Criteria')).toBeInTheDocument();
      expect(getByText('Notification Channels')).toBeInTheDocument();
    });
  });

  it('should render the error state on details API call failure', async () => {
    // Override only the failing query
    queryMocks.useAlertDefinitionQuery.mockReturnValueOnce({
      data: null,
      isError: true,
      isFetching: false,
    });

    const { getByText, queryByText } = renderWithTheme(<AlertDetail />);

    // Assert error message is displayed
    expect(
      getByText(
        'An error occurred while loading the definitions. Please try again later.'
      )
    ).toBeInTheDocument();

    // Assert other sections do not render
    expect(queryByText('Overview')).not.toBeInTheDocument();
  });

  it('should render the no data placeholder', async () => {
    // Override only the failing query
    queryMocks.useAlertDefinitionQuery.mockReturnValueOnce({
      data: null,
      isError: false,
      isFetching: false,
    });

    const { getByText } = renderWithTheme(<AlertDetail />);

    // Assert error message is displayed
    expect(getByText('No Data to display.')).toBeInTheDocument();
  });
});
