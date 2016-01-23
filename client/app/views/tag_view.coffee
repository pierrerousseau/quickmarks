View = require "../lib/view"

module.exports = class TagView extends View
    className: "tag"
    tagName: "span"

    events:
        "click": "search"

    constructor: (model) ->
        @values = model
        super()

    getRenderData: ->
        @values

    template: ->
        template = require "./templates/tag"
        template @getRenderData()

    search: () ->
        $(".search input").val @values.tag
        window.featureList.search(@values.tag, { "tags": "tags" })
