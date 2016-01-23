bookmarks = require './bookmarks'

module.exports =
    'bookmarks':
        get: bookmarks.all
        post: bookmarks.create
    'bookmarks/:id':
        delete: bookmarks.destroy
        put: bookmarks.update
     'tags':
        get: bookmarks.allTags
    'export':
        get: bookmarks.export
