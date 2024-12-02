import React from 'react';

import { alertFactory } from 'src/factories';
import { renderWithTheme } from 'src/utilities/testHelpers';

import { AlertDetailOverview } from './AlertDetailOverview';

describe('AlertDetailOverview component tests', () => {
  it('should render alert detail overview with required props', () => {
    const alert = alertFactory.build({
      description: 'This is test description',
      label: undefined,
      severity: 3,
    });
    const screen = renderWithTheme(<AlertDetailOverview alert={alert} />);

    const { description, label, severity, type } = alert;

    expect(screen.getByText(description)).toBeInTheDocument();
    expect(screen.getByText(String(severity))).toBeInTheDocument();
    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.getByText(type)).toBeInTheDocument();
  });
});