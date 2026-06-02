describe('Quiz Access', () => {

  beforeEach(() => {

    cy.visit('/', {
      onBeforeLoad(win) {

        win.localStorage.setItem(
          'studyBuddy.progress.v1',
          JSON.stringify({
            'lesson-alg-1': 100
          })
        );

      }
    });

  });

  it('allows access after lesson completion', () => {

    cy.visit('/quiz');

    cy.url()
      .should('include', '/quiz');

    cy.contains('Start')
      .should('exist');

  });

});
