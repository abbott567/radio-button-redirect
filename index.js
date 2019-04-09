'use-strict';

function radioButtonRedirect(req, res, next) {
  const obj = Object.keys(req.body).length ? req.body : req.query;
  for (const k in obj) {
    const v = obj[k];
    if (v.includes('~')) {
      const parts = v.split('~');
      req.session.data[k] = parts[0];
      const href = parts[1];
      return res.redirect(href);
    }
  }
  next();
}

module.exports = radioButtonRedirect
