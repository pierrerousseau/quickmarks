Tag = require '../models/tag'

module.exports = class TagCollection extends Backbone.Collection

    model: Tag
    url: 'tags'