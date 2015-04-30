View          = require "../lib/view"
AppRouter     = require "../routers/app_router"
BookmarksView = require "./bookmarks_view"
Bookmark      = require "../models/bookmark"

module.exports = class AppView extends View
    el: "body.application"

    events:
        "click form .create": "bookmarkLink"
        "keyup form .url-field": "showForm"
        "click form .url-field": "showForm"
        "click form .title": "toggleForm"
        "click form .clean": "cleanForm"
        "click button.import": "import"
        "click button.export": "export"
        "change #bookmarks-file": "uploadFile"
        "click .tag": "tagClick"

    template: ->
        require "./templates/home"

    initialize: ->
        @router = CozyApp.Routers.AppRouter = new AppRouter()

    tagClick: (evt) ->
        tag = $(evt.currentTarget).text()
        $("input.search").val(tag)
        window.featureList.search(tag)


    setTagCloud: ->
        allTags = {}
        nbTags = 0
        @bookmarksView.collection.forEach((bookmark) ->
            (bookmark.get "tags").forEach((tag) ->
                if tag != ""
                    if allTags[tag]?
                        allTags[tag] += 1
                    else
                        allTags[tag] = 1
                    nbTags += 1
            )
        )
        sortable = []
        for tag of allTags
            sortable.push([tag, allTags[tag]])
        for tag in sortable
            size = 10 + 1.5 * 100 * tag[1] / nbTags
            $("#tags-cloud").append(
                "<span class='tag' style='font-size:" + size + "pt'>" + 
                tag[0] + 
                "</span> "
            )


    afterRender: ->
        $(".url-field").focus()
        @bookmarksView = new BookmarksView()

        @bookmarksView.$el.html '<em>loading...</em>'
        @bookmarksView.collection.fetch
            success: =>
                @bookmarksView.$el.find('em').remove()
                window.sortOptions = {
                    "valueNames": ["title", "url", "tags", "description"] }
                window.featureList = new List("bookmarks-list",
                                              window.sortOptions)
                View.log "bookmarks loaded"
                @setTagCloud()

    showForm: (evt) ->
        $container = $ "form .full-form"
        title     = $(evt.target).parents ".title"
        if !$container.is ":visible"
            title.click()
        false

    toggleForm: (evt) ->
        $container = $ "form .full-form"
        $title     = $ evt.currentTarget
        $container.toggle "slow", () ->
            if $container.is ":visible"
                $title.attr "title", "click to hide the detailed form"
            else
                $title.attr "title", "click to show the full form"
        false

    cleanForm: (evt) ->
        $form = $ "form"
        $inputs = $form.find "input, textarea"
        $inputs.val ""
        false

    bookmarkLink: (evt) ->
        url   = $('.url-field').val()
        title = $('.title-field').val()
        tags  = $('.tags-field').val().split(',').map (tag) -> $.trim(tag)
        description = $('.description-field').val()

        if url?.length > 0
            bookObj =
                title: title
                url: url
                tags: tags
                description: description
            bookmark = new Bookmark bookObj
            @bookmarksView.collection.create bookmark,
                success: =>
                    @cleanForm()
                    $("form .title").click()
                    $(".bookmark:first").addClass "new"
                    View.log "" + (title || url) + " added"
                error: =>
                    View.error "Server error occured, " +
                               "bookmark was not saved"
        else
            View.error "Url field is required"
        false

    addBookmarkFromFile: (link) ->
        $link = $ link
        if !!$link.attr("href").indexOf("place") and not $link.attr("feedurl")
            url         = $link.attr "href"
            title       = $link.text()
            description = ""
            next = $link.parents(":first").next()
            if next.is("dd")
                description = next.text()

            bookObj =
                title: title
                url: url
                tags: []
                description: description
            bookmark = new Bookmark bookObj
            @bookmarksView.collection.create bookmark,
                success: =>
                    imported = $(".imported")
                    if imported.text()
                        imported.text(parseInt(imported.text()) + 1)
                    else
                        imported.text(1)
                error: =>
                    notImported = $(".import-failed")
                    if notImported.text()
                        notImported.text(parseInt(notImported.text()) + 1)
                    else
                        notImported.text(1)

    addBookmarksFromFile: (file) ->
        loaded = $(file)
        links = loaded.find "dt a"
        for link in links
            @addBookmarkFromFile link

    uploadFile: (evt) ->
        file = evt.target.files[0]
        if file.type != "text/html"
            View.error "This file cannot be imported"
            return

        reader = new FileReader()
        reader.onload = (evt) => @addBookmarksFromFile(evt.target.result)
        reader.readAsText(file)

    import: (evt) ->
        View.confirm "Import html bookmarks file exported by " +
                     "firefox or chrome",
            () -> $("#bookmarks-file").click()

    export: (evt) ->
        window.location = "export"
