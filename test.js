'use-strict';

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
});