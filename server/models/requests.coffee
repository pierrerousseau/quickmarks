americano = require 'americano'

module.exports =
    bookmark:
        byDate: (doc) -> emit Date.parse(doc.created), doc
