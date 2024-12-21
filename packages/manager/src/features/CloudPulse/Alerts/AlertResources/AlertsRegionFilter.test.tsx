import userEvent from '@testing-library/user-event';
import React from 'react';

import { regionFactory } from 'src/factories';
import { renderWithTheme } from 'src/utilities/testHelpers';

import { AlertsRegionFilter } from './AlertsRegionFilter';

describe('AlertsRegionFilter component tests', () => {
  const mockRegions = regionFactory.buildList(3);

  it('should render the AlertsRegionFilter with required options', async () => {
    const {
      getByPlaceholderText,
      getByRole,
      getByTestId,
      queryByTestId,
      queryByText,
    } = renderWithTheme(
      <AlertsRegionFilter
        handleSelectionChange={vi.fn()}
        regionOptions={mockRegions}
      />
    );
    // ensure it has no selections in zeroth state
    expect(getByPlaceholderText('Select Regions')).toHaveValue('');

    // check if the regions are visible
    await userEvent.click(getByRole('button', { name: 'Open' }));
    expect(getByTestId(mockRegions[0].id)).toBeInTheDocument();

    // select an option
    await userEvent.click(getByTestId(mockRegions[0].id));

    await userEvent.click(getByRole('button', { name: 'Close' }));

    // validate the option is selected
    expect(queryByTestId(mockRegions[0].id)).toBeInTheDocument();

    // validate other options are not selected
    expect(queryByTestId(mockRegions[1].id)).toBeNull();

    // validate that there is no select all not present
    await userEvent.click(getByRole('button', { name: 'Open' }));
    expect(queryByText('Select All')).not.toBeInTheDocument();
  });
});
