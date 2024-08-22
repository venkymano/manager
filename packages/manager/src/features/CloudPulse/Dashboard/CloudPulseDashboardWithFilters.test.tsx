import React from 'react';

import { dashboardFactory } from 'src/factories';
import { renderWithTheme } from 'src/utilities/testHelpers';

import { CloudPulseDashboardWithFilters } from './CloudPulseDashboardWithFilters';

const queryMocks = vi.hoisted(() => ({
  useCloudPulseDashboardByIdQuery: vi.fn().mockReturnValue({}),
}));

vi.mock('src/queries/cloudpulse/dashboards', async () => {
  const actual = await vi.importActual('src/queries/cloudpulse/dashboards');
  return {
    ...actual,
    useCloudPulseDashboardByIdQuery: queryMocks.useCloudPulseDashboardByIdQuery,
  };
});
const mockDashboard = dashboardFactory.build();

queryMocks.useCloudPulseDashboardByIdQuery.mockReturnValue({
  data: {
    data: mockDashboard,
  },
  error: false,
  isLoading: false,
});

describe('CloudPulseDashboardWithFilters component tests', () => {
  it('renders a CloudPulseDashboardWithFilters component with error placeholder', () => {
    queryMocks.useCloudPulseDashboardByIdQuery.mockReturnValue({
      data: {
        data: mockDashboard,
      },
      error: false,
      isError: true,
      isLoading: false,
    });

    let screen = renderWithTheme(
      <CloudPulseDashboardWithFilters dashboardId={1} resource={1} />
    );

    expect(
      screen.getByText('Error while loading Dashboard with Id -1')
    ).toBeDefined();

    queryMocks.useCloudPulseDashboardByIdQuery.mockReturnValue({
      data: mockDashboard,
      error: false,
      isError: false,
      isLoading: false,
    });

    screen = renderWithTheme(
      <CloudPulseDashboardWithFilters dashboardId={1} resource={1} />
    );

    expect(screen.getByText('Select Time Duration')).toBeDefined();
    expect(screen.getByTestId('circle-progress')).toBeDefined(); // the dashboards started to render
  });
});
