module.exports = class Bookmark extends Backbone.Model

    urlRoot: 'bookmarks'

    tagSep: ","

    isNew: () ->
        not @id?

    cleanValues: () ->
        tags = @attributes.tags
        if typeof tags is "string"
            tags = tags.split @tagSep
        @attributes.readableTags = tags.join(@tagSep + " ")

        httpUrl = @attributes.url
        if httpUrl.slice(0, 4) != "http"
            httpUrl = "http://" + httpUrl
        @attributes.httpUrl = httpUrl
 
        if not @attributes.created
            @attributes.date = "just now"
        else
            local = new Date @attributes.created
            local.setMinutes local.getMinutes() - local.getTimezoneOffset()
            @attributes.date = local.toLocaleDateString undefined, 
                "day": "2-digit"
                "month": "2-digit"
                "year": "numeric"

        if not @attributes.title
            @attributes.htmlTitle = "&nbsp;"
        else
            @attributes.htmlTitle = @attributes.title

    setTags: (str) ->
        str.split(@tagSep).map (tag) -> $.trim(tag)