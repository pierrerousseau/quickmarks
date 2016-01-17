View          = require "../lib/view"
AppRouter     = require "../routers/app_router"
BookmarksView = require "./bookmarks_view"
Bookmark      = require "../models/bookmark"

tagSep = ","

module.exports = class AppView extends View
    el: "body.application"

    events:
        "submit #bookmark-add": "bookmarkLink"

    template: ->
        require "./templates/home"

    initialize: () ->
        @router = CozyApp.Routers.AppRouter = new AppRouter()
        @loader = $("#loader")

        # @router.on "route:quickmarklet", (title, url) ->
        #     console.log("let", title, url)

    startLoader: ->
        @loader.show("slow")

    stopLoader: ->
        @loader.hide()

    afterRender: ->
        @startLoader()
        @bookmarksView = new BookmarksView()

        @bookmarksView.collection.fetch
            success: =>
                @stopLoader()
                window.sortOptions =
                    "valueNames": ["bookmark-title", 
                                   "bookmark-url", 
                                   "bookmark-tags", 
                                   "bookmark-description"]
                window.featureList = new List "bookmarks", window.sortOptions
                View.log "bookmarks loaded"

    bookmarkLink: (evt) ->
        evt.preventDefault()

        url         = $("#add-link").val()
        title       = $("#add-title").val()
        description = $("#add-description").val()
        tags        = $("#add-tags").val().split(tagSep).map (tag) -> 
            $.trim(tag)

        if url?.length > 0
            bookmark = new Bookmark
                "title": title
                "url": url
                "tags": tags
                "description": description
            @bookmarksView.collection.create bookmark,
                "success": =>
                    $(".bookmark:first").addClass "new"
                    View.log "" + (title || url) + " added"
                    $("#add-modal").modal "hide"
                "error": =>
                    View.error "Server error occured, " +
                               "bookmark was not saved"
        else
            View.error "Url field is required"

        false
