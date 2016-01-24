ViewCollection = require '../lib/view_collection'
TagCollection  = require '../collections/tag_collection'
TagView        = require './tag_view'

module.exports = class TagsView extends ViewCollection
    el: '#tags'

    view: TagView

    renderAll: =>
        scores = {}
        total  = 0
        @collection.each (elem) ->
            if elem? and elem.get("tag")?
                tag = elem.get("tag")
                if tag? and scores[tag]?
                    scores[tag] += 1
                else
                    scores[tag] = 1
                    total += 1
        average = @collection.length / total
        for tag, score of scores
            model =
                tag: tag
                score: 1 + .3 * (score / average)
            view = new @view model
            @$el.prepend view.render().el
            @add view
        @

    initialize: ->
        @collection = new TagCollection @