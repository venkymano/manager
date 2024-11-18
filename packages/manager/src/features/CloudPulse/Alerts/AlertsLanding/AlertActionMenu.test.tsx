import { fireEvent } from '@testing-library/react';
import React from 'react';

import { renderWithTheme } from 'src/utilities/testHelpers';

import { AlertActionMenu } from './AlertActionMenu';

import type { ActionHandlers } from './AlertActionMenu';

const handlers: ActionHandlers = {
  handleDelete: vi.fn(),
  handleDetails: vi.fn(),
};

const alertLabel = 'Action menu for Alert';

describe('AlertActionMenu component tests', () => {
  it('should render the action menu items on correct props', () => {
    const screen = renderWithTheme(
      <AlertActionMenu alertType={'default'} handlers={handlers} />
    );
    const actionButton = screen.getByLabelText(alertLabel);

    fireEvent.click(actionButton);

    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('should render the action menu items on correct props for custom alert type', () => {
    const screen = renderWithTheme(
      <AlertActionMenu alertType={'custom'} handlers={handlers} />
    );
    const actionButton = screen.getByLabelText(alertLabel);

    fireEvent.click(actionButton);

    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Clone')).toBeInTheDocument();
  });
});
