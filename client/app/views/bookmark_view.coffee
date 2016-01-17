View = require "../lib/view"

module.exports = class BookmarkView extends View
    className: "bookmark"
    tagName: "li"

    events:
        "click .edit": "edit"
        "click .remove": "erase"

    constructor: (@model) ->
        super()

    template: ->
        template = require "./templates/bookmark"
        template @getRenderData().model

    render: () ->
        @model.cleanValues()
        super()

    title: () ->
        $.trim(@model.get "title") || @model.get "url"

    delete: () =>
        title = @title()
        @model.destroy
            success: =>
                @destroy()
                window.featureList.remove("bookmark-title", title)
                View.log "" + title + " removed."
            error: =>
                View.error "Server error occured, bookmark was not deleted."

    erase: () ->
        View.confirm "Do you really want to remove " + @title() + "?", @delete


    edit: () ->
        form   = $("#bookmark-edit")

        $("#edit-title").val @model.get "title"
        $("#edit-link").val @model.get "url"
        $("#edit-description").val @model.get "description"
        $("#edit-tags").val @model.get "readableTags"

        modal = $("#edit-modal")
        modal.modal "show"

        form.on "submit", (evt) =>
            evt.preventDefault()

            newValues =
                "title": $("#edit-title").val()
                "url": $("#edit-link").val()
                "description": $("#edit-description").val()
                "tags": @model.setTags $("#edit-tags").val()

            @model.save newValues,
                "success": =>
                    title = (@model.attributes.title || @model.attributes.url)
                    View.log "" + title + " modified."
                    modal.modal "hide"
                    @render()
                "error": (a, b, c) =>
                    console.log("err", a, b, c)
                    View.error "Server error occured, " +
                               "bookmark was not saved"