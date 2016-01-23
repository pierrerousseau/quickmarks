americano = require 'americano'

module.exports =
    bookmark:
        byDate: (doc) -> emit Date.parse(doc.created), doc
        tags: (doc) -> 
            if doc? and doc._id? and doc.tags.length
                for tag in doc.tags
                    emit doc._id, { tag: tag }
