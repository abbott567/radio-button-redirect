'use strict';

const chai = require('chai');
const sinonChai = require('sinon-chai');
const {spy} = require('sinon');
const {expect} = chai;
chai.use(sinonChai);

const radioButtonRedirect = require('./index');

const req = {
  body: {},
  query: {},
  session: {
    data: {}
  }
};
const res = {
  redirect: spy()
};
const next = spy();

describe('radioButtonRedirect(req, res, next)', () => {
  it('should call res.redirect if ~ present in body', () => {
    req.body.married = 'yes~/page1'
    radioButtonRedirect(req, res, next);
    expect(res.redirect).to.be.called;
    res.redirect.resetHistory();
    req.body = {};
  });

  it('should call res.redirect if ~ present in query', () => {
    req.query.married = 'yes~/page1'
    radioButtonRedirect(req, res, next);
    expect(res.redirect).to.be.called;
    res.redirect.resetHistory();
    req.query = {};
  });


  it('should redirect to /page1 if ~/page1 present in body', () => {
    req.body.married = 'yes~/page1'
    radioButtonRedirect(req, res, next);
    expect(res.redirect.args[0][0]).to.eql('/page1');
    res.redirect.resetHistory();
    req.body = {};
  });

  it('should redirect to /page1 if ~/page1 present in query', () => {
    req.query.married = 'yes~/page1'
    radioButtonRedirect(req, res, next);
    expect(res.redirect.args[0][0]).to.eql('/page1');
    res.redirect.resetHistory();
    req.query = {};
  });


  it('should not call res.redirect if no ~ present in query', () => {
    radioButtonRedirect(req, res, next);
    expect(res.redirect).to.not.be.called;
    res.redirect.resetHistory();
  });

  it('should not call res.redirect if no ~ present in body', () => {
    radioButtonRedirect(req, res, next);
    expect(res.redirect).to.not.be.called;
    res.redirect.resetHistory();
  });


  it('should call next() if no ~ present in body', () => {
    req.body.married = 'yes';
    radioButtonRedirect(req, res, next);
    expect(next).to.be.called;
    next.resetHistory();
    req.body = {};
  });
  
  it('should call next() if no ~ present in query', () => {
    req.query.married = 'yes';
    radioButtonRedirect(req, res, next);
    expect(next).to.be.called;
    next.resetHistory();
    req.query = {};
  });

  it('should call next() if no ~ present in body or query', () => {
    radioButtonRedirect(req, res, next);
    expect(next).to.be.called;
    next.resetHistory();
  });


  // Express 5 (Prototype Kit 14+) leaves req.body undefined when the request
  // has no body, for example on every GET request.
  describe('when req.body is undefined', () => {
    beforeEach(() => {
      req.body = undefined;
      req.query = {};
      req.session.data = {};
      res.redirect.resetHistory();
      next.resetHistory();
    });

    after(() => {
      req.body = {};
      req.query = {};
      req.session.data = {};
      res.redirect.resetHistory();
      next.resetHistory();
    });

    it('should call next() without throwing', () => {
      expect(() => radioButtonRedirect(req, res, next)).to.not.throw();
      expect(next).to.be.calledOnce;
      expect(res.redirect).to.not.be.called;
    });

    it('should redirect to /page1 if ~/page1 present in query', () => {
      req.query.married = 'yes~/page1';
      radioButtonRedirect(req, res, next);
      expect(res.redirect).to.be.calledOnceWith('/page1');
      expect(next).to.not.be.called;
    });

    it('should call next() without throwing if req.query is also undefined', () => {
      req.query = undefined;
      expect(() => radioButtonRedirect(req, res, next)).to.not.throw();
      expect(next).to.be.calledOnce;
    });
  });


  describe('when values are not strings', () => {
    beforeEach(() => {
      req.body = {};
      req.query = {};
      req.session.data = {};
      res.redirect.resetHistory();
      next.resetHistory();
    });

    after(() => {
      req.body = {};
      res.redirect.resetHistory();
      next.resetHistory();
    });

    it('should ignore nested objects, arrays, numbers and null', () => {
      req.body = {
        claimant: {name: 'Bob'},
        checkboxes: ['_unchecked', '~'],
        age: 42,
        empty: null
      };
      expect(() => radioButtonRedirect(req, res, next)).to.not.throw();
      expect(res.redirect).to.not.be.called;
      expect(next).to.be.calledOnce;
    });

    it('should still redirect from a string value alongside them', () => {
      req.body = {
        claimant: {name: 'Bob'},
        married: 'yes~/page1'
      };
      radioButtonRedirect(req, res, next);
      expect(res.redirect).to.be.calledOnceWith('/page1');
    });
  });


  it('should store the value without the ~ and link in the session', () => {
    req.body.married = 'yes~/page1';
    radioButtonRedirect(req, res, next);
    expect(req.session.data.married).to.eql('yes');
    res.redirect.resetHistory();
    req.body = {};
    req.session.data = {};
  });
});