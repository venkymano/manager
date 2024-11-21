import userEvent from '@testing-library/user-event';
import React from 'react';

import { regionFactory } from 'src/factories';
import { renderWithTheme } from 'src/utilities/testHelpers';

import { AlertsRegionFilter } from './AlertsRegionFilter';

describe('AlertsRegionFilter component tests', () => {
  const mockRegions = regionFactory.buildList(3);

  it('should render the AlertsRegionFilter with required options', async () => {
    const screen = renderWithTheme(
      <AlertsRegionFilter
        handleSelectionChange={vi.fn()}
        regionOptions={mockRegions}
      />
    );
    // ensure it has selected all by default
    expect(screen.getByText('+2')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await userEvent.click(screen.getByRole('option', { name: 'Deselect All' }));
    expect(screen.getByTestId(mockRegions[0].id)).toBeInTheDocument();
    // select an option
    await userEvent.click(screen.getByTestId(mockRegions[0].id));

    await userEvent.click(screen.getByRole('button', { name: 'Close' }));

    // validate the option is selected
    expect(screen.queryByTestId(mockRegions[0].id)).toBeInTheDocument();

    // validate other options are not selected
    expect(screen.queryByTestId(mockRegions[1].id)).toBeNull();
  });
});
