describe('Sign Up', () => {
  it('Adds person to course', () => {
    cy.visit('/')

    cy.get('h1')
      .should('contain', 'Sign Up Sheet')

    cy.get('input[type="submit"').should('be.disabled')

    cy.get('input[name="name"]')
      .click()
      .type('Some Name')
      .should('have.value', 'Some Name')

    cy.get('input[name="email"]')
      .click()
      .type('some@email.com')
      .should('have.value', 'some@email.com')
      
    cy.get('select[name="department"]')
      .select('core')
      .should('have.value', 'core')
  
    cy.get('select[name="course"]')
      .should('not.exist')
    
    cy.get('h3')
      .should('contain', 'People')
    
    cy.get('img[alt="loading"]')
      .should('exist')
      .and('have.attr', 'src', '/img/loading.gif')
    
    cy.get('select[name="course"]')
      .should('exist')

    cy.get('select[name="course"]')
      .select('git-it')
      .should('have.value', 'git-it')
    
    cy.get('img[alt="loading"]')
      .should('not.exist')

    cy.get('span')
      .should('have.value', '')
    
    cy.get('input[type="submit"]')
      .should('not.be.disabled')
      .click()
      .should('be.disabled')
      .and('have.value', 'Saving...')
    
    cy.get('input[type="submit"]', { timeout: 4500 } )
      .should('have.value', 'Saved!')
      .and('be.disabled')
    
    cy.get('li')
      .should('contain', 'Some Name - some@email.com - core - git-it')
  })

  it('Displays error and disable submit button if name is not given', () => {
    cy.visit('/')

    cy.get('input[name="email"]')
      .click()
      .type('some@email.com')
      .should('have.value', 'some@email.com')

    cy.get('select[name="department"]')
      .select('core')
      .should('have.value', 'core')
    
    cy.get('img[alt="loading"]')
      .should('exist')
      .and('have.attr', 'src', '/img/loading.gif')

    cy.get('select[name="course"]')
      .select('git-it')
      .should('have.value', 'git-it')

    cy.get('input[name="name"]')
      .click()
      .type(' ')
      .should('have.value', ' ')
      .clear()
      .should('have.value', '')
    
    cy.get('span')
      .eq(0)
      .should('contain', 'Name Required')
      .and('have.attr', 'style', 'color: red;')
    
    cy.get('input[type="submit"]')
      .should('be.disabled')
    
    cy.get('input[name="name"]')
      .click()
      .type('Some name')
      .should('have.value', 'Some name')
    
    cy.get('input[type="submit"]')
      .should('not.be.disabled')
  })
})
