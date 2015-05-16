americano = require 'americano'

port = process.env.PORT || 31435
americano.start name: 'Quickmarks', port: port, (err, app, server) ->
    Bookmark = americano.getModel 'Bookmark',
        'title': type: String
        'url': type: String
        'tags': type: JSON
        'description': type: String
        'created': type: Date, default: Date
    Bookmark.request "all", (err, bookmarks) ->
        for bookmark in bookmarks
            if typeof bookmark.tags is "string"
                tags = bookmark.tags.split(",")
                bookmark.tags = tags
                bookmark.save()
