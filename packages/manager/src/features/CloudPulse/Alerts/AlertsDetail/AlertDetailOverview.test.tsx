import React from 'react';

import { alertFactory, serviceTypesFactory } from 'src/factories';
import { renderWithTheme } from 'src/utilities/testHelpers';

import { severityMap } from '../constants';
import { AlertDetailOverview } from './AlertDetailOverview';
import { convertStringToCamelCasesWithSpaces } from '../../Utils/utils';

const queryMocks = vi.hoisted(() => ({
  useCloudPulseServiceTypes: vi.fn().mockReturnValue({}),
}));
const mockServiceTypesList = serviceTypesFactory.buildList(1);

vi.mock('src/queries/cloudpulse/services', async () => {
  const actual = await vi.importActual('src/queries/cloudpulse/services');
  return {
    ...actual,
    useCloudPulseServiceTypes: queryMocks.useCloudPulseServiceTypes,
  };
});

queryMocks.useCloudPulseServiceTypes.mockReturnValue({
  data: { data: mockServiceTypesList },
  isFetching: false,
});

describe('AlertDetailOverview component tests', () => {
  it('should render alert detail overview with required props', () => {
    const alert = alertFactory.build({
      description: 'This is test description',
      label: 'Test Alert',
      severity: 3,
    });
    const screen = renderWithTheme(<AlertDetailOverview alert={alert} />);

    const { description, label, severity, type } = alert;

    expect(screen.getByText(description)).toBeInTheDocument();
    expect(
      screen.getByText(
        String(
          severity !== undefined && severity !== null
            ? severityMap[severity]
            : severity
        )
      )
    ).toBeInTheDocument();
    expect(screen.getByText(label)).toBeInTheDocument();
    expect(
      screen.getByText(convertStringToCamelCasesWithSpaces(type))
    ).toBeInTheDocument();
  });
});
