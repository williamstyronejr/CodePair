import { createRandomString } from '../utils';

const username = createRandomString(7);
const email = createRandomString(6, '@email.com');
const password = 'testtst';

before(() => {
  cy.signup(email, username, password);
});

describe('Challenge List', () => {
  beforeEach(() => {
    cy.signup(email, username, password);
    cy.visit('/');
    cy.contains('Challenges').click();
  });

  it('Clicking solo should redirect to challenge page', () => {
    cy.get('[data-cy="select-challenge"]').first().click();
    cy.get('[data-cy="challenge-solo"]').click();

    cy.location('pathname').should('contain', '/c/');
    cy.get("[data-cy='challenge']").should('exist');
  });

  it('Clicking pair should redirect to queue page', () => {
    cy.get('[data-cy="select-challenge"]').first().click();
    cy.get('[data-cy=challenge-pair]').first().click();

    cy.location('pathname').should('contain', '/c/');
    cy.get("[data-cy='challenge-queue']").should('exist');
  });
});

describe('Challenge Queue', () => {
  beforeEach(() => {
    cy.signup(email, username, password);
    cy.visit('/');
    cy.contains('Challenges').click();

    cy.get('[data-cy="select-challenge"]').first().click();
    cy.get('[data-cy="challenge-pair"]').click();
  });

  it('Cancelling queue should redirect to /challenges page', () => {
    cy.get('[data-cy="cancel"]').click();

    cy.location('pathname').should('eq', '/challenges');
  });
});

describe('Challenge Page', () => {
  beforeEach(() => {
    cy.signup(email, username, password);
    cy.visit('/');
    cy.contains('Challenges').click();

    cy.get('[data-cy="select-challenge"]').first().click();
    cy.get('[data-cy="challenge-solo"]').click();
    cy.get("[data-cy='challenge']").should('exist');
  });

  it('Running tests should show results in the results tab', () => {
    cy.get('[data-cy=output]').click();
    cy.get('[data-cy=runTest]').click();

    cy.get('[data-cy=tab-tests]');
  });

  it('Creating link should open chat and provides link popup', () => {
    cy.get('[data-cy=public]').click();
    cy.get('[data-cy=showInvite]').click();
    cy.get('[data-cy=invite]').should('exist');
    cy.get('[data-cy=chat]').should('exist');
  });

  it('Sending message in chat should appear in message list', () => {
    cy.get('[data-cy=public]').click();

    const testMessage = 'Testing';
    cy.get('[data-cy=chatInput]').type(testMessage);
    cy.get('[data-cy=chatInput]').type('{enter}');
    cy.get('[data-cy=message]').should('have.length', 1);
    cy.get('[data-cy=message]').first().contains('p', testMessage);
  });
});
