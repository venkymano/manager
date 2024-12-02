import { waitFor } from '@testing-library/react';
import React from 'react';

import { alertFactory } from 'src/factories';
import { renderWithTheme } from 'src/utilities/testHelpers';

import { AlertDetail } from './AlertDetail';

// Mock Data
const alertDetails = alertFactory.build({ service_type: 'linode' });
// Mock Queries
const queryMocks = vi.hoisted(() => ({
    useAlertDefinitionQuery: vi.fn(),
}));

vi.mock('src/queries/cloudpulse/alerts', () => ({
    ...vi.importActual('src/queries/cloudpulse/alerts'),
    useAlertDefinitionQuery: queryMocks.useAlertDefinitionQuery,
}));

// Shared Setup
beforeEach(() => {
    queryMocks.useAlertDefinitionQuery.mockReturnValue({
        data: alertDetails,
        isError: false,
        isFetching: false,
    });
});

describe('AlertDetail component tests', () => {
    it('should render the alert detail component successfully on proper inputs', async () => {
        const { getByText } = renderWithTheme(<AlertDetail />);
        await waitFor(() => {
            expect(getByText('Overview')).toBeInTheDocument();
        });
    });

    it('should render the error state on details API call failure', async () => {
        // Override only the failing query
        queryMocks.useAlertDefinitionQuery.mockReturnValueOnce({
            data: null,
            isError: true,
            isFetching: false,
        });

        const { getByText, queryByText } = renderWithTheme(
            <AlertDetail />
        );

        // Assert error message is displayed
        expect(getByText('Error loading alert details.')).toBeInTheDocument();

        // Assert other sections do not render
        expect(queryByText('Overview')).not.toBeInTheDocument();
    });
});