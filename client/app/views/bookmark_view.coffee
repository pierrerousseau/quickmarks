View = require "../lib/view"

module.exports = class BookmarkView extends View
    className: "bookmark"
    tagName: "li"

    events:
        "click .remove": "remove"

    constructor: (@model) ->
        super()


    getRenderData: () ->
        model = super().model
        if not model.created
            model.created = "just now"
        else
            local = new Date model.created
            local.setMinutes local.getMinutes() - local.getTimezoneOffset()
            model.created = local.toLocaleDateString undefined, 
                "day": "2-digit"
                "month": "2-digit"
                "year": "numeric"
        model

    template: ->
        template = require "./templates/bookmark"
        template @getRenderData()

    render: () ->
        @model.cleanValues()
        super()

    delete: () =>
        title = @$el.find(".title").text()
        @model.destroy
            success: =>
                @destroy()
                window.featureList.remove("bookmark-title", title)
                View.log "" + title + " removed."
            error: =>
                View.error "Server error occured, bookmark was not deleted."

    remove: ->
        title = @$el.find(".title").text()
        View.confirm "Do you really want to remove " + title + "?", @delete
