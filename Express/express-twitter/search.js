/**
 * Search function
 * 
 * @param {String} search query
 * @param {Function} callback
 * @api public
 */
var request = require('superagent')

module.exports = function search(query, fn) {
  request.get(`http://search.twitter.com/search.json?q=${query}`)
    .end(function(res) {
      if (res.body && Array.isArray(res.body.results)) {
        return fn(null, res.body.results)
      }
      fn(new Error('Bad twitter response'))
    })
}