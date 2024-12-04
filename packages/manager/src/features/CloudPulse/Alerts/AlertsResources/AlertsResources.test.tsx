import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';

import { linodeFactory, regionFactory } from 'src/factories';
import { renderWithTheme } from 'src/utilities/testHelpers';

import { AlertResources } from './AlertsResources';

vi.mock('src/queries/cloudpulse/resources', () => ({
  ...vi.importActual('src/queries/cloudpulse/resources'),
  useResourcesQuery: queryMocks.useResourcesQuery,
}));

vi.mock('src/queries/regions/regions', () => ({
  ...vi.importActual('src/queries/regions/regions'),
  useRegionsQuery: queryMocks.useRegionsQuery,
}));

const queryMocks = vi.hoisted(() => ({
  useRegionsQuery: vi.fn(),
  useResourcesQuery: vi.fn(),
}));

const linodes = linodeFactory.buildList(3);
const regions = regionFactory.buildList(1).map((region, index) => ({
  ...region,
  id: index < 3 ? linodes[index].region : region.id,
}));

queryMocks.useResourcesQuery.mockReturnValue({
  data: linodes,
  isError: false,
  isFetching: false,
});

queryMocks.useRegionsQuery.mockReturnValue({
  data: regions,
  isError: false,
  isFetching: false,
});

describe('AlertsRegionFilter component tests', () => {
  it('should handle search input, select all, and deselect all functionality', async () => {
    const {
      getByPlaceholderText,
      getByRole,
      getByText,
      queryByText,
    } = renderWithTheme(
      <AlertResources
        isSelectionsNeeded={false}
        resourceIds={['1', '2', '3']}
        serviceType="linode"
      />
    );

    // **Initial State Validation**
    expect(getByText(linodes[0].label)).toBeInTheDocument();

    // **Search Input**
    const searchInput = getByPlaceholderText('Search for a Resource');
    await userEvent.type(searchInput, linodes[1].label);

    // Wait for search results to update
    await waitFor(() => {
      expect(queryByText(linodes[0].label)).not.toBeInTheDocument();
      expect(getByText(linodes[1].label)).toBeInTheDocument();
    });

    // **Clear Search Input**
    await userEvent.clear(searchInput);
    await waitFor(() => {
      expect(getByText(linodes[0].label)).toBeInTheDocument();
      expect(getByText(linodes[1].label)).toBeInTheDocument();
    });

    // **Deselect All**
    await userEvent.click(getByRole('button', { name: 'Open' }));
    await userEvent.click(getByRole('option', { name: 'Deselect All' }));
    await userEvent.click(getByRole('button', { name: 'Close' }));

    // Validate no items are visible
    expect(queryByText(linodes[0].label)).not.toBeInTheDocument();
    expect(queryByText(linodes[1].label)).not.toBeInTheDocument();

    // **Search with Invalid Text**
    await userEvent.type(searchInput, 'dummy');
    await userEvent.click(getByRole('button', { name: 'Open' }));
    await userEvent.click(getByRole('option', { name: 'Select All' }));
    await userEvent.click(getByRole('button', { name: 'Close' }));

    // Validate no items are visible due to mismatched search text
    await waitFor(() => {
      expect(queryByText(linodes[0].label)).not.toBeInTheDocument();
      expect(queryByText(linodes[1].label)).not.toBeInTheDocument();
    });

    // **Clear Search Input**
    await userEvent.clear(searchInput);
    await waitFor(() => {
      expect(getByText(linodes[0].label)).toBeInTheDocument();
      expect(getByText(linodes[1].label)).toBeInTheDocument();
    });
  });
});
