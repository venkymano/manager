import { fireEvent, screen } from '@testing-library/react';
import * as React from 'react';

import { renderWithThemeAndFormik } from 'src/utilities/testHelpers';

import { initialValues } from '../CreateAlertDefinition';
import { CloudPulseServiceSelect } from './ServiceTypeSelect';

const queryMocks = vi.hoisted(() => ({
  useCloudPulseServices: vi.fn().mockReturnValue({}),
}));

vi.mock('src/queries/cloudpulse/services', async () => {
  const actual = await vi.importActual('src/queries/cloudpulse/resources');
  return {
    ...actual,
    useCloudPulseServices: queryMocks.useCloudPulseServices,
  };
});

const handleOnSubmit = vi.fn();
describe('ServiceTypeSelect component tests', () => {
  it('should render the Autocomplete component', () => {
    const {
      getAllByText,
      getByPlaceholderText,
      getByTestId,
    } = renderWithThemeAndFormik(
      <CloudPulseServiceSelect name={'serviceType'} />,
      {
        initialValues,
        onSubmit: handleOnSubmit,
      }
    );
    expect(getByPlaceholderText('Select a service')).toBeInTheDocument();
    expect(getByTestId('servicetype-select')).toBeInTheDocument();
    getAllByText('Service');
  });

  it('should render service types happy path', (_) => {
    queryMocks.useCloudPulseServices.mockReturnValue({
      data: {
        data: [
          {
            label: 'Linodes',
            value: 'linode',
          },
          { label: 'DbaaS', value: 'dbaas' },
        ],
      },
      isError: false,
      isLoading: false,
      status: 'success',
    });
    renderWithThemeAndFormik(<CloudPulseServiceSelect name={'serviceType'} />, {
      initialValues,
      onSubmit: handleOnSubmit,
    });
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(
      screen.getByRole('option', {
        name: 'Linodes',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', {
        name: 'DbaaS',
      })
    ).toBeInTheDocument();
  });

  it('should be able to select a service type', () => {
    queryMocks.useCloudPulseServices.mockReturnValue({
      data: {
        data: [
          {
            label: 'Linodes',
            value: 'linode',
          },
          { label: 'DbaaS', value: 'dbaas' },
        ],
      },
      isError: false,
      isLoading: false,
      status: 'success',
    });
    renderWithThemeAndFormik(<CloudPulseServiceSelect name={'serviceType'} />, {
      initialValues,
      onSubmit: handleOnSubmit,
    });
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    fireEvent.click(screen.getByRole('option', { name: 'Linodes' }));
    expect(screen.getByRole('combobox')).toHaveAttribute('value', 'Linodes');
  });
});