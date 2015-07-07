americano = require 'americano-cozy'

module.exports =
    bookmark:
        byDate: (doc) -> emit Date.parse(doc.created), doc