View          = require "../lib/view"
AppRouter     = require "../routers/app_router"
BookmarksView = require "./bookmarks_view"
Bookmark      = require "../models/bookmark"

module.exports = class AppView extends View
    el: "body.application"

    events:
        "submit #bookmark-add": "bookmarkLink"
        "shown.bs.modal #add-modal": "showAddForm"
        "shown.bs.modal #edit-modal": "showAddForm"
        "submit .search": "search"

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
                    "valueNames": ["title", 
                                   "url", 
                                   "tags", 
                                   "description"]
                window.featureList = new List "content", window.sortOptions
                View.log "bookmarks loaded"

    showAddForm: (evt) ->
        $("#add-link").focus()

    showEditForm: (evt) ->
        $("#edit-link").focus()

    cleanForm: (form) ->
        form.find("input[type=text], textarea").val("")

    bookmarkLink: (evt) ->
        evt.preventDefault()

        url = $("#add-link").val()

        if url?.length > 0
            title       = $("#add-title").val()
            description = $("#add-description").val()
            console.log Bookmark
            bookmark = new Bookmark()
            bookmark.set  
                "title": title
                "url": url
                "description": description
                "tags": bookmark.setTags $("#add-tags").val()
            @bookmarksView.collection.create bookmark,
                "success": =>
                    View.log "" + (title || url) + " added."
                    modal = $("#add-modal")
                    modal.modal "hide"
                    @cleanForm(modal.find("form"))
                "error": =>
                    View.error "Server error occured, " +
                               "bookmark was not saved"
        else
            View.error "Url field is required"

    search: (evt) ->
        false