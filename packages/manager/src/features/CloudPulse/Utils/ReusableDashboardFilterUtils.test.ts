import { dashboardFactory } from 'src/factories';

import {
  checkMandatoryFiltersSelected,
  constructDimesionFilters,
  getDashboardProperties,
} from './ReusableDashboardFilterUtils';

const mockDashboard = dashboardFactory.build();

it('test getDashboardProperties method', () => {
  const result = getDashboardProperties({
    dashboardObj: mockDashboard,
    filterValue: { region: 'us-east' },
    resource: 1,
  });

  expect(result).toBeDefined();
  expect(result.dashboardId).toEqual(mockDashboard.id);
  expect(result.resources).toEqual(['1']);
});

it('test checkMandatoryFiltersSelected method', () => {
  let result = checkMandatoryFiltersSelected({
    dashboardObj: mockDashboard,
    filterValue: { region: 'us-east' },
    resource: 0,
  });
  expect(result).toBe(false);

  result = checkMandatoryFiltersSelected({
    dashboardObj: mockDashboard,
    filterValue: { region: 'us-east' },
    resource: 1,
    timeDuration: { unit: 'min', value: 30 },
  });

  expect(result).toBe(true);
});

it('test constructDimesionFilters method', () => {
  const result = constructDimesionFilters({
    dashboardObj: mockDashboard,
    filterValue: { region: 'us-east' },
    resource: 1,
  });

  expect(result.length).toEqual(1);
  expect(result[0].filterKey).toEqual('resource_ids');
  expect(result[0].filterValue).toEqual([1]);
});
