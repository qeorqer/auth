const { expect } = require('chai');
const sinon = require('sinon');
const authMiddleware = require('../middlewares/auth');

describe('Auth middleware', () => {
  it('should call next if error if no authorization header is present', () => {
    const req = {
      get: () => null,
    };
    const nextSpy = sinon.spy();

    authMiddleware( req, {}, nextSpy);
    expect(nextSpy.calledOnce).to.be.true;
  });
});
