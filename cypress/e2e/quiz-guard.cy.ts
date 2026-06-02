describe('Quiz Guard', () => {

  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('redirects users without completed lessons', () => {

    cy.visit('/quiz');

    cy.url()
      .should('include', '/courses');

  });

});
