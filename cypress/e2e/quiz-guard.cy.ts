describe('Quiz Guard', () => {

  it('blocks access when no lesson is completed', () => {

    cy.visit('/quiz');

    cy.url().should('include', '/courses');

  });

});
