View = require "../lib/view"

module.exports = class BookmarkView extends View
    className: "bookmark"
    tagName: "li"

    events:
        "click .bookmark-delete": "deleteBookmark"
        "mouseenter .bookmark-delete": "setToDelete"
        "mouseleave .bookmark-delete": "setToNotDelete"

    constructor: (@model) ->
        super()

    template: ->
        template = require "./templates/bookmark"
        template @getRenderData().model

    render: () ->
        @model.cleanValues()
        super()

    setToDelete: ->
        @$el.addClass("to-delete")

    setToNotDelete: ->
        @$el.removeClass("to-delete")

    deleteBookmark: ->
        title = @$el.find(".bookmark-title").html()
        $("#bookmark-add-link-url").val(@$el.find(".bookmark-title a").attr("href"))
        $("#bookmark-add-link-title").val(@$el.find(".bookmark-title a").text())
        $("#bookmark-add-link-tags").val(@$el.find(".bookmark-tags span").text())
        $("#bookmark-add-link-description").val(@$el.find(".bookmark-description p").text())
        $("#bookmark-add-full").show()
        @model.destroy
            success: =>
                @destroy()
                window.featureList.remove("bookmark-title", title)
                View.log "" + title + " removed and placed in form"
            error: =>
                View.error "Server error occured, bookmark was not deleted."
