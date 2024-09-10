/**
 * Intercepts request to metrics requests for a cloud pulse.
 *
 * @returns Cypress chainable.
 */

import { apiMatcher } from 'support/util/intercepts';

import type { Dashboard, MetricDefinitions } from '@linode/api-v4';

/**
 * Intercepts HTTP GET requests for metric definitions.
 *
 * This function mocks the API response for requests to the endpoint
 * `dashboardMetricsData`.
 *
 * @returns {Cypress.Chainable<null>} The chainable Cypress object.
 */

export const interceptGetMetricDefinitions = (
  metricDefinitions: MetricDefinitions
): Cypress.Chainable<null> => {
  return cy.intercept(
    'GET',
    apiMatcher('**/monitor/services/linode/metric-definitions'),
    metricDefinitions
  );
};

/**
 * Intercepts HTTP GET requests for metric definitions.
 *
 * This function mocks the API response for requests to the endpoint
 * `dashboardMetricsData`.
 *
 * @returns {Cypress.Chainable<null>} The chainable Cypress object.
 */

export const interceptCloudPulseServices = (
  service_type: string
): Cypress.Chainable<null> => {
  return cy.intercept('GET', apiMatcher('**/monitor/services'), {
    data: [{ service_type }],
  });
};
/**
 * Intercepts HTTP GET requests for dashboard definitions.
 *
 * This function mocks the API response for requests to the endpoint
 * `dashboardDefinitions`.
 *
 * @returns {Cypress.Chainable<null>} The chainable Cypress object.
 */

export const interceptGetDashboards = (
  dashboard: Dashboard
): Cypress.Chainable<null> => {
  return cy.intercept(
    'GET',
    apiMatcher('**/monitor/services/linode/dashboards'),
    { data: [dashboard] }
  );
};
/**
 * Sets up an intercept for POST requests to the metrics endpoint.
 *
 * and assign an alias of 'getMetrics' to the intercepted request.
 *
 * @returns {void}
 */
export const interceptMetricsRequests = () => {
  cy.intercept({
    method: 'POST',
    url: '**/monitor/services/linode/metrics',
  }).as('getMetrics');
};
/**
 * Intercepts POST requests to the metrics endpoint with a custom mock response.
 *
 * This function allows you to specify a mock response for POST requests
 *
 * @param {any} mockResponse - The mock response to return for the intercepted request.
 * @returns {Cypress.Chainable<null>} The chainable Cypress object.
 */
export const interceptCreateMetrics = (
  mockResponse: any
): Cypress.Chainable<null> => {
  return cy.intercept(
    'POST',
    '**/monitor/services/linode/metrics',
    mockResponse
  );
};

export const mockLinodeDashboardServicesResponse = (
  dashboard: Dashboard
): Cypress.Chainable<null> => {
  return cy.intercept('GET', apiMatcher('**/monitor/dashboards/1'), dashboard);
};
const JWSToken = {
  token: 'eyJhbGciOiAiZGlyIiwgImVuYyI6ICJBMTI4Q0JDLUhTMjU2IiwgImtpZCI6ID',
};
export const mockJWSToken = (): Cypress.Chainable<null> => {
  return cy.intercept(
    'POST',
    apiMatcher('**/monitor/services/linode/token'),
    JWSToken
  );
};