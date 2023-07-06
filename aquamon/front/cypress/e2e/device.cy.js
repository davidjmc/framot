describe('Device flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should register a new device', () => {
    cy.fixture('device.json').as('deviceData');

    cy.intercept('POST', '/devices', (req) => {
      req.reply(req.statusCode);
    }).as('interceptedRequest');

    cy.get('button').contains('Register Device').click();

    cy.get('section[role=dialog]').should('be.visible');

    cy.get('@deviceData').then((deviceData) => {
      cy.get('input[name=name]').type(deviceData.name);
      cy.get('input[name=mac]').type(deviceData.mac);
      cy.get('input[name=address]').type(deviceData.address);
      cy.get('input[name=height]').clear().type(deviceData.height);
      cy.get('input[name=baseRadius]').clear().type(deviceData.baseRadius);
      cy.get('input[name=maxCapacity]').clear().type(deviceData.maxCapacity);
    });

    cy.get('button').contains('Save').click();

    cy.wait(1000);

    cy.get('@interceptedRequest').then((interception) => {
      const status = interception.response.statusCode;
      expect(status).to.equal(201);
    });

    cy.get('section[role=dialog]').should('not.exist');
  });

  it('should not register a device with the same mac adrress', () => {
    cy.fixture('device.json').as('deviceData');

    cy.intercept('POST', '/devices', (req) => {
      req.reply(req.statusCode);
    }).as('interceptedRequest');

    cy.get('button').contains('Register Device').click();

    cy.get('section[role=dialog]').should('be.visible');

    cy.get('@deviceData').then((deviceData) => {
      cy.get('input[name=name]').type(deviceData.name);
      cy.get('input[name=mac]').type(deviceData.mac);
      cy.get('input[name=address]').type(deviceData.address);
      cy.get('input[name=height]').clear().type(deviceData.height);
      cy.get('input[name=baseRadius]').clear().type(deviceData.baseRadius);
      cy.get('input[name=maxCapacity]').clear().type(deviceData.maxCapacity);
    });

    cy.get('button').contains('Save').click();

    cy.wait(1000);

    cy.get('button').contains('Save').click();

    cy.get('@interceptedRequest').then((interception) => {
      const status = interception.response.statusCode;
      expect(status).to.equal(409);
    });

    cy.get('section[role=dialog]').should('be.visible');
  });

  it('should delete the devide previous created', () => {
    cy.fixture('device.json').as('deviceData');

    cy.intercept('DELETE', '/devices/*', (req) => {
      req.reply(req.statusCode);
    }).as('interceptedRequest');

    cy.get('@deviceData').then((deviceData) => {
      cy.get('a').contains(deviceData.name).click({ force: true });
    });

    cy.get('[data-testid="options-button"]')
      .should('be.visible')
      .click({ force: true });

    cy.get('[data-testid="delete-button"]')
      .should('be.visible')
      .click({ force: true });

    cy.get('@interceptedRequest').then((interception) => {
      const status = interception.response.statusCode;
      expect(status).to.equal(200);
    });
  });
});
