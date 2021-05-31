function generateRandomString(len, append = '') {
  return (
    Math.random().toString(36).substring(2, 4) +
    Math.random().toString(36).substring(2, 4) +
    append
  );
}

let username = generateRandomString(8);
const password = 'pass';

beforeEach(() => {
  const email = generateRandomString(8, '@email.com');
  username = generateRandomString(8);

  cy.signup({ username, email, password });
});

describe('Challenge List page', () => {
  it('Clicking solo should redirect to challenge page', () => {
    cy.get('[data-cy=solo]').first().click();
    cy.location('pathname').should('contain', '/c/');
  });

  it('Clicking pair should redirect to queue page', () => {
    cy.get('[data-cy=pair]').first().click();
    cy.location('pathname').should('contain', '/c/');
  });
});

describe('Solo Challenge Page ', () => {
  beforeEach(() => {
    cy.get('[data-cy=solo]').first().click();
    cy.location('pathname').should('contain', '/c/');
  });

  it('Running test should show results in the results tab', () => {
    cy.get('[data-cy=output]').click();
    cy.get('[data-cy=runTest]').click();

    cy.get('[data-cy=testError]');
  });

  it('Creating link should open chat and provides link popup', () => {
    cy.get('[data-cy=public]').click();
    cy.get('[data-cy=showInvite]').click();
    cy.get('[data-cy=invite]');
    cy.get('[data-cy=chat]');
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

describe('Challenge queue', () => {
  beforeEach(() => {
    cy.get('[data-cy=pair]').first().click();
    cy.location('pathname').should('contain', '/c/');
  });

  it('Canceling queue should go back to challenge list page', () => {
    cy.get('[data-cy=cancel]').click();
    cy.location('pathname').should('eq', '/challenges');
  });
});
