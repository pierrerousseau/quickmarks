View          = require "../lib/view"
AppRouter     = require "../routers/app_router"
BookmarksView = require "./bookmarks_view"
Bookmark      = require "../models/bookmark"

module.exports = class AppView extends View
    el: "body.application"

    events:
        "click #bookmark-add-title": "toggleForm"
        "keyup #bookmark-add-link-url": "showForm"
        "click #bookmark-add-link-url": "showForm"
        "click #bookmark-add-clean": "cleanForm"
        "submit #bookmark-add": "bookmarkLink"

        "click #bookmarks-exchange-import": "import"
        "click #bookmarks-exchange-export": "export"
        "change #bookmarks-exchange-file": "uploadFile"

        "click .tag": "tagClick"
        "click #bookmarks-tools-clean": "cleanSearch"
        "click #bookmarks-tools-tags": "toggleCloud"

    template: ->
        require "./templates/home"

    initialize: () ->
        @router = CozyApp.Routers.AppRouter = new AppRouter()

        # @router.on "route:quickmarklet", (title, url) ->
        #     console.log("let", title, url)

    toggleCloud: ->
        $("#tags-cloud").toggle()

    cleanSearch: ->
        $("#bookmarks-tools-search").val("")
        window.featureList.search()

    tagClick: (evt) ->
        tag = $(evt.currentTarget).text()
        $("#bookmarks-tools-search").val(tag)
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

        factor = if nbTags > 20 then 1.5 else 1.0
        for tag in sortable
            size = 1 + factor * 10 * tag[1] / nbTags
            $("#tags-cloud").append(
                "<span class='tag' title='" + tag[1] + " occurences' style='font-size:" + size + "em'>" +
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
                    "valueNames": ["bookmark-title", "bookmark-url", "bookmark-tags", "bookmark-description"] }
                window.featureList = new List("bookmarks",
                                              window.sortOptions)
                View.log "bookmarks loaded"
                @setTagCloud()

    toggleForm: (evt) ->
        $container = $ "#bookmark-add-full"
        $container.toggle "slow"

        false

    showForm: (evt) ->
        $container = $ "#bookmark-add-full"
        if !$container.is ":visible"
            @toggleForm()

        false

    cleanForm: (evt) ->
        $form   = $ "form"
        $inputs = $form.find "input, textarea"
        $inputs.val ""

        false

    bookmarkLink: (evt) ->
        evt.preventDefault()

        url         = $("#bookmark-add-link-url").val()
        title       = $("#bookmark-add-link-title").val()
        description = $("#bookmark-add-link-description").val()
        # FixMe: ',' to constant
        tags        = $("#bookmark-add-link-tags").val().split(',').map (tag) -> $.trim(tag)

        if url?.length > 0
            bookmark = new Bookmark
                "title": title
                "url": url
                "tags": tags
                "description": description
            @bookmarksView.collection.create bookmark,
                "success": =>
                    @cleanForm()
                    @toggleForm()
                    # FixMe: do this on bookmark rendering
                    $(".bookmark:first").addClass "new"
                    # FixMe: create a log class
                    View.log "" + (title || url) + " added"
                "error": =>
                    View.error "Server error occured, " +
                               "bookmark was not saved"
        else
            View.error "Url field is required"

        false

    addBookmarkFromFile: (link, others) ->
        $link = $ link
        if !!$link.attr("href").indexOf("place") and not $link.attr("feedurl")
            url         = $link.attr "href"
            title       = $link.text()
            description = ""
            next = $link.parents(":first").next()
            if next.is("dd")
                description = next.text()

            bookmark = new Bookmark
                title: title
                url: url
                tags: []
                description: description
            @bookmarksView.collection.create bookmark,
                success: =>
                    imported = $("#bookmarks-exchange-done")
                    if imported.text()
                        imported.text(parseInt(imported.text()) + 1)
                    else
                        imported.text(1)
                    @addBookmarkFromFile others[0], others[1..]

                error: =>
                    notImported = $("#bookmarks-exchange-failed")
                    if notImported.text()
                        notImported.text(parseInt(notImported.text()) + 1)
                    else
                        notImported.text(1)
                    @addBookmarkFromFile others[0], others[1..]

    addBookmarksFromFile: (file) ->
        importButton = $("#bookmarks-exchange-import")
        loaded = $(file)
        links = loaded.find "dt a"
        @addBookmarkFromFile links[0], links[1..]
        importButton.removeClass("doing")

    uploadFile: (evt) ->
        importButton = $("#bookmarks-exchange-import")
        if importButton.hasClass("doing")
            View.error("I'm working!")
        else
            file = evt.target.files[0]
            if file.type != "text/html"
                View.error "This file cannot be imported"
                return
            importButton.addClass("doing")

            reader = new FileReader()
            reader.onload = (evt) => @addBookmarksFromFile(evt.target.result)
            reader.readAsText(file)

    import: (evt) ->
        View.confirm "Import html bookmarks file exported by " +
                     "firefox or chrome",
            () -> $("#bookmarks-exchange-file").click()

    export: (evt) ->
        window.location = "export"
