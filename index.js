'use strict';

function radioButtonRedirect(req, res, next) {
  const body = req.body || {};
  const obj = Object.keys(body).length ? body : req.query || {};
  for (const k in obj) {
    const v = obj[k];
    if (typeof v === 'string' && v.includes('~')) {
      const parts = v.split('~');
      req.session.data[k] = parts[0];
      const href = parts[1];
      return res.redirect(href);
    }
  }
  next();
}

module.exports = radioButtonRedirect
