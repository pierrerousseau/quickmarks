View = require "../lib/view"

module.exports = class BookmarkView extends View
    className: "bookmark"
    tagName: "li"

    events:
        "click .delete": "deleteBookmark"
        "mouseenter .delete": "setToDelete"
        "mouseleave .delete": "setToNotDelete"

    constructor: (@model) ->
        super()

    template: ->
        template = require "./templates/bookmark"
        template @getRenderData()

    render: () ->
        @model.cleanValues()
        super()

    setToDelete: ->
        @$el.addClass("to-delete")

    setToNotDelete: ->
        @$el.removeClass("to-delete")

    deleteBookmark: ->
        title = @$el.find(".title").html()
        $(".url-field").val(@$el.find(".title a").attr("href"))
        $(".title-field").val(@$el.find(".title a").text())
        $(".tags-field").val(@$el.find(".tags span").text())
        $(".description-field").val(@$el.find(".description p").text())
        $(".full-form").show()
        @model.destroy
            success: =>
                @destroy()
                window.featureList.remove("title", title)
                View.log "" + title + " removed and placed in form"
            error: =>
                View.error "Server error occured, bookmark was not deleted."
                @$('.delete-button').html "delete"
