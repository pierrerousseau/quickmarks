americano = require 'americano-cozy'

module.exports = Bookmark = americano.getModel 'Bookmark',
    'title': type: String
    'url': type: String
    'tags': type: JSON
    'description': type: String
    'created': type: Date, default: Date

Bookmark.all = (params, callback) ->
    Bookmark.request "byDate", params, callback
