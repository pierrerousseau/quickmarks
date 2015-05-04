(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("collections/bookmark_collection", function(exports, require, module) {
var Bookmark, BookmarkCollection,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Bookmark = require('../models/bookmark');

module.exports = BookmarkCollection = (function(superClass) {
  extend(BookmarkCollection, superClass);

  BookmarkCollection.prototype.model = Bookmark;

  BookmarkCollection.prototype.url = 'bookmarks';

  function BookmarkCollection(view) {
    this.view = view;
    BookmarkCollection.__super__.constructor.call(this);
    this.bind("add", this.view.renderOne);
    this.bind("reset", this.view.renderAll);
  }

  return BookmarkCollection;

})(Backbone.Collection);

});

;require.register("initialize", function(exports, require, module) {
if (this.CozyApp == null) {
  this.CozyApp = {};
}

if (CozyApp.Routers == null) {
  CozyApp.Routers = {};
}

if (CozyApp.Views == null) {
  CozyApp.Views = {};
}

if (CozyApp.Models == null) {
  CozyApp.Models = {};
}

if (CozyApp.Collections == null) {
  CozyApp.Collections = {};
}

$(function() {
  var AppView;
  require('../lib/app_helpers');
  CozyApp.Views.appView = new (AppView = require('views/app_view'));
  CozyApp.Views.appView.render();
  return Backbone.history.start({
    pushState: true
  });
});

});

;require.register("lib/app_helpers", function(exports, require, module) {
(function() {
  return (function() {
    var console, dummy, method, methods, results;
    console = window.console = window.console || {};
    method = void 0;
    dummy = function() {};
    methods = 'assert,count,debug,dir,dirxml,error,exception, group,groupCollapsed,groupEnd,info,log,markTimeline, profile,profileEnd,time,timeEnd,trace,warn'.split(',');
    results = [];
    while (method = methods.pop()) {
      results.push(console[method] = console[method] || dummy);
    }
    return results;
  })();
})();

});

;require.register("lib/view", function(exports, require, module) {
var View,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

module.exports = View = (function(superClass) {
  extend(View, superClass);

  function View() {
    return View.__super__.constructor.apply(this, arguments);
  }

  View.prototype.tagName = 'section';

  View.prototype.template = function() {};

  View.prototype.initialize = function() {
    return this.render();
  };

  View.prototype.getRenderData = function() {
    var ref;
    return {
      model: (ref = this.model) != null ? ref.toJSON() : void 0
    };
  };

  View.prototype.render = function() {
    this.beforeRender();
    this.$el.html(this.template());
    this.afterRender();
    return this;
  };

  View.prototype.beforeRender = function() {};

  View.prototype.afterRender = function() {};

  View.prototype.destroy = function() {
    this.undelegateEvents();
    this.$el.removeData().unbind();
    this.remove();
    return Backbone.View.prototype.remove.call(this);
  };

  View.confirm = function(text, cb) {
    return $(function() {
      return (new PNotify({
        "text": text,
        "icon": false,
        "hide": false,
        "type": "info",
        "confirm": {
          "confirm": true
        },
        "buttons": {
          "sticker": false
        },
        "width": "40%"
      })).get().on("pnotify.confirm", function() {
        return cb();
      });
    });
  };

  View.error = function(text) {
    return $(function() {
      return new PNotify({
        "text": text,
        "icon": false,
        "hide": false,
        "type": "error",
        "buttons": {
          "sticker": false
        }
      });
    });
  };

  View.log = function(text) {
    return $(function() {
      return new PNotify({
        "text": text,
        "icon": false,
        "opacity": .8,
        "delay": 2000,
        "type": "success",
        "buttons": {
          "sticker": false
        }
      });
    });
  };

  return View;

})(Backbone.View);

});

;require.register("lib/view_collection", function(exports, require, module) {
var View, ViewCollection, methods,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

View = require('./view');

ViewCollection = (function(superClass) {
  extend(ViewCollection, superClass);

  function ViewCollection() {
    this.renderAll = bind(this.renderAll, this);
    this.renderOne = bind(this.renderOne, this);
    return ViewCollection.__super__.constructor.apply(this, arguments);
  }

  ViewCollection.prototype.collection = new Backbone.Collection();

  ViewCollection.prototype.view = new View();

  ViewCollection.prototype.views = [];

  ViewCollection.prototype.length = function() {
    return this.views.length;
  };

  ViewCollection.prototype.add = function(views, options) {
    var i, len, view;
    if (options == null) {
      options = {};
    }
    views = _.isArray(views) ? views.slice() : [views];
    for (i = 0, len = views.length; i < len; i++) {
      view = views[i];
      if (!this.get(view.cid)) {
        this.views.push(view);
        if (!options.silent) {
          this.trigger('add', view, this);
        }
      }
    }
    return this;
  };

  ViewCollection.prototype.get = function(cid) {
    return this.find(function(view) {
      return view.cid === cid;
    }) || null;
  };

  ViewCollection.prototype.remove = function(views, options) {
    var i, len, view;
    if (options == null) {
      options = {};
    }
    views = _.isArray(views) ? views.slice() : [views];
    for (i = 0, len = views.length; i < len; i++) {
      view = views[i];
      this.destroy(view);
      if (!options.silent) {
        this.trigger('remove', view, this);
      }
    }
    return this;
  };

  ViewCollection.prototype.destroy = function(view, options) {
    var _views;
    if (view == null) {
      view = this;
    }
    if (options == null) {
      options = {};
    }
    _views = this.filter(_view)(function() {
      return view.cid !== _view.cid;
    });
    this.views = _views;
    view.undelegateEvents();
    view.$el.removeData().unbind();
    view.remove();
    Backbone.View.prototype.remove.call(view);
    if (!options.silent) {
      this.trigger('remove', view, this);
    }
    return this;
  };

  ViewCollection.prototype.reset = function(views, options) {
    var i, j, len, len1, ref, view;
    if (options == null) {
      options = {};
    }
    views = _.isArray(views) ? views.slice() : [views];
    ref = this.views;
    for (i = 0, len = ref.length; i < len; i++) {
      view = ref[i];
      this.destroy(view, options);
    }
    if (views.length !== 0) {
      for (j = 0, len1 = views.length; j < len1; j++) {
        view = views[j];
        this.add(view, options);
      }
      if (!options.silent) {
        this.trigger('reset', view, this);
      }
    }
    return this;
  };

  ViewCollection.prototype.renderOne = function(model) {
    var view;
    view = new this.view(model);
    this.$el.prepend(view.render().el);
    this.add(view);
    return this;
  };

  ViewCollection.prototype.renderAll = function() {
    this.collection.each(this.renderOne);
    return this;
  };

  return ViewCollection;

})(View);

methods = ['forEach', 'each', 'map', 'reduce', 'reduceRight', 'find', 'detect', 'filter', 'select', 'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke', 'max', 'min', 'sortBy', 'sortedIndex', 'toArray', 'size', 'first', 'initial', 'rest', 'last', 'without', 'indexOf', 'shuffle', 'lastIndexOf', 'isEmpty', 'groupBy'];

_.each(methods, function(method) {
  return ViewCollection.prototype[method] = function() {
    return _[method].apply(_, [this.views].concat(_.toArray(arguments)));
  };
});

module.exports = ViewCollection;

});

;require.register("models/bookmark", function(exports, require, module) {
var Bookmark,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

module.exports = Bookmark = (function(superClass) {
  extend(Bookmark, superClass);

  function Bookmark() {
    return Bookmark.__super__.constructor.apply(this, arguments);
  }

  Bookmark.prototype.urlRoot = 'bookmarks';

  Bookmark.prototype.isNew = function() {
    return this.id == null;
  };

  Bookmark.prototype.cleanValues = function() {
    var httpUrl, i, len, readableTags, tag, tags;
    readableTags = "";
    tags = this.attributes.tags;
    if (typeof tags === "string") {
      tags = tags.split(",");
    }
    for (i = 0, len = tags.length; i < len; i++) {
      tag = tags[i];
      readableTags += tag + ", ";
    }
    readableTags = readableTags.slice(0, readableTags.length - 2);
    this.attributes.readableTags = readableTags;
    httpUrl = this.attributes.url;
    if (httpUrl.slice(0, 4) !== "http") {
      httpUrl = "http://" + httpUrl;
    }
    return this.attributes.httpUrl = httpUrl;
  };

  return Bookmark;

})(Backbone.Model);

});

;require.register("routers/app_router", function(exports, require, module) {
var AppRouter,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

module.exports = AppRouter = (function(superClass) {
  extend(AppRouter, superClass);

  function AppRouter() {
    return AppRouter.__super__.constructor.apply(this, arguments);
  }

  AppRouter.prototype.routes = {
    '': function() {}
  };

  return AppRouter;

})(Backbone.Router);

});

;require.register("views/app_view", function(exports, require, module) {
var AppRouter, AppView, Bookmark, BookmarksView, View,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

View = require("../lib/view");

AppRouter = require("../routers/app_router");

BookmarksView = require("./bookmarks_view");

Bookmark = require("../models/bookmark");

module.exports = AppView = (function(superClass) {
  extend(AppView, superClass);

  function AppView() {
    return AppView.__super__.constructor.apply(this, arguments);
  }

  AppView.prototype.el = "body.application";

  AppView.prototype.events = {
    "click #bookmark-add-title": "toggleForm",
    "keyup #bookmark-add-link-url": "showForm",
    "click #bookmark-add-link-url": "showForm",
    "click #bookmark-add-clean": "cleanForm",
    "submit #bookmark-add": "bookmarkLink",
    "click #bookmarks-exchange-import": "import",
    "click #bookmarks-exchange-export": "export",
    "change #bookmarks-exchange-file": "uploadFile",
    "click .tag": "tagClick",
    "click #bookmarks-tools-clean": "cleanSearch",
    "click #bookmarks-tools-tags": "toggleCloud"
  };

  AppView.prototype.template = function() {
    return require("./templates/home");
  };

  AppView.prototype.initialize = function() {
    return this.router = CozyApp.Routers.AppRouter = new AppRouter();
  };

  AppView.prototype.toggleCloud = function() {
    return $("#tags-cloud").toggle();
  };

  AppView.prototype.cleanSearch = function() {
    $("#bookmarks-tools-search").val("");
    return window.featureList.search();
  };

  AppView.prototype.tagClick = function(evt) {
    var tag;
    tag = $(evt.currentTarget).text();
    $("#bookmarks-tools-search").val(tag);
    return window.featureList.search(tag);
  };

  AppView.prototype.setTagCloud = function() {
    var allTags, factor, i, len, nbTags, results, size, sortable, tag;
    allTags = {};
    nbTags = 0;
    this.bookmarksView.collection.forEach(function(bookmark) {
      return (bookmark.get("tags")).forEach(function(tag) {
        if (tag !== "") {
          if (allTags[tag] != null) {
            allTags[tag] += 1;
          } else {
            allTags[tag] = 1;
          }
          return nbTags += 1;
        }
      });
    });
    sortable = [];
    for (tag in allTags) {
      sortable.push([tag, allTags[tag]]);
    }
    factor = nbTags > 20 ? 1.5 : 1.0;
    results = [];
    for (i = 0, len = sortable.length; i < len; i++) {
      tag = sortable[i];
      size = 1 + factor * 10 * tag[1] / nbTags;
      results.push($("#tags-cloud").append("<span class='tag' title='" + tag[1] + " occurences' style='font-size:" + size + "em'>" + tag[0] + "</span> "));
    }
    return results;
  };

  AppView.prototype.afterRender = function() {
    $(".url-field").focus();
    this.bookmarksView = new BookmarksView();
    this.bookmarksView.$el.html('<em>loading...</em>');
    return this.bookmarksView.collection.fetch({
      success: (function(_this) {
        return function() {
          _this.bookmarksView.$el.find('em').remove();
          window.sortOptions = {
            "valueNames": ["bookmark-title", "bookmark-url", "bookmark-tags", "bookmark-description"]
          };
          window.featureList = new List("bookmarks", window.sortOptions);
          View.log("bookmarks loaded");
          return _this.setTagCloud();
        };
      })(this)
    });
  };

  AppView.prototype.toggleForm = function(evt) {
    var $container;
    $container = $("#bookmark-add-full");
    $container.toggle("slow");
    return false;
  };

  AppView.prototype.showForm = function(evt) {
    var $container;
    $container = $("#bookmark-add-full");
    if (!$container.is(":visible")) {
      this.toggleForm();
    }
    return false;
  };

  AppView.prototype.cleanForm = function(evt) {
    var $form, $inputs;
    $form = $("form");
    $inputs = $form.find("input, textarea");
    $inputs.val("");
    return false;
  };

  AppView.prototype.bookmarkLink = function(evt) {
    var bookmark, description, tags, title, url;
    evt.preventDefault();
    url = $("#bookmark-add-link-url").val();
    title = $("#bookmark-add-link-title").val();
    description = $("#bookmark-add-link-description").val();
    tags = $("#bookmark-add-link-tags").val().split(',').map(function(tag) {
      return $.trim(tag);
    });
    if ((url != null ? url.length : void 0) > 0) {
      bookmark = new Bookmark({
        "title": title,
        "url": url,
        "tags": tags,
        "description": description
      });
      this.bookmarksView.collection.create(bookmark, {
        "success": (function(_this) {
          return function() {
            _this.cleanForm();
            _this.toggleForm();
            $(".bookmark:first").addClass("new");
            return View.log("" + (title || url) + " added");
          };
        })(this)
      });
      console.log(bookmark)({
        "error": (function(_this) {
          return function() {
            return View.error("Server error occured, " + "bookmark was not saved");
          };
        })(this)
      });
    } else {
      View.error("Url field is required");
    }
    return false;
  };

  AppView.prototype.addBookmarkFromFile = function(link, others) {
    var $link, bookmark, description, next, title, url;
    $link = $(link);
    if (!!$link.attr("href").indexOf("place") && !$link.attr("feedurl")) {
      url = $link.attr("href");
      title = $link.text();
      description = "";
      next = $link.parents(":first").next();
      if (next.is("dd")) {
        description = next.text();
      }
      bookmark = new Bookmark({
        title: title,
        url: url,
        tags: [],
        description: description
      });
      return this.bookmarksView.collection.create(bookmark, {
        success: (function(_this) {
          return function() {
            var imported;
            imported = $("#bookmarks-exchange-done");
            if (imported.text()) {
              imported.text(parseInt(imported.text()) + 1);
            } else {
              imported.text(1);
            }
            return _this.addBookmarkFromFile(others[0], others.slice(1));
          };
        })(this),
        error: (function(_this) {
          return function() {
            var notImported;
            notImported = $("#bookmarks-exchange-failed");
            if (notImported.text()) {
              notImported.text(parseInt(notImported.text()) + 1);
            } else {
              notImported.text(1);
            }
            return _this.addBookmarkFromFile(others[0], others.slice(1));
          };
        })(this)
      });
    }
  };

  AppView.prototype.addBookmarksFromFile = function(file) {
    var importButton, links, loaded;
    importButton = $("#bookmarks-exchange-import");
    loaded = $(file);
    links = loaded.find("dt a");
    this.addBookmarkFromFile(links[0], links.slice(1));
    return importButton.removeClass("doing");
  };

  AppView.prototype.uploadFile = function(evt) {
    var file, importButton, reader;
    importButton = $("#bookmarks-exchange-import");
    if (importButton.hasClass("doing")) {
      return View.error("I'm working!");
    } else {
      file = evt.target.files[0];
      if (file.type !== "text/html") {
        View.error("This file cannot be imported");
        return;
      }
      importButton.addClass("doing");
      reader = new FileReader();
      reader.onload = (function(_this) {
        return function(evt) {
          return _this.addBookmarksFromFile(evt.target.result);
        };
      })(this);
      return reader.readAsText(file);
    }
  };

  AppView.prototype["import"] = function(evt) {
    return View.confirm("Import html bookmarks file exported by " + "firefox or chrome", function() {
      return $("#bookmarks-exchange-file").click();
    });
  };

  AppView.prototype["export"] = function(evt) {
    return window.location = "export";
  };

  return AppView;

})(View);

});

;require.register("views/bookmark_view", function(exports, require, module) {
var BookmarkView, View,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

View = require("../lib/view");

module.exports = BookmarkView = (function(superClass) {
  extend(BookmarkView, superClass);

  BookmarkView.prototype.className = "bookmark";

  BookmarkView.prototype.tagName = "li";

  BookmarkView.prototype.events = {
    "click .bookmark-delete": "deleteBookmark",
    "mouseenter .bookmark-delete": "setToDelete",
    "mouseleave .bookmark-delete": "setToNotDelete"
  };

  function BookmarkView(model) {
    this.model = model;
    BookmarkView.__super__.constructor.call(this);
  }

  BookmarkView.prototype.template = function() {
    var template;
    template = require("./templates/bookmark");
    return template(this.getRenderData());
  };

  BookmarkView.prototype.render = function() {
    this.model.cleanValues();
    return BookmarkView.__super__.render.call(this);
  };

  BookmarkView.prototype.setToDelete = function() {
    return this.$el.addClass("to-delete");
  };

  BookmarkView.prototype.setToNotDelete = function() {
    return this.$el.removeClass("to-delete");
  };

  BookmarkView.prototype.deleteBookmark = function() {
    var title;
    title = this.$el.find(".bookmark-title").html();
    $("#bookmark-add-link-url").val(this.$el.find(".bookmark-title a").attr("href"));
    $("#bookmark-add-link-title").val(this.$el.find(".bookmark-title a").text());
    $("#bookmark-add-link-tags").val(this.$el.find(".bookmark-tags span").text());
    $("#bookmark-add-link-description").val(this.$el.find(".bookmark-description p").text());
    $("#bookmark-add-full").show();
    return this.model.destroy({
      success: (function(_this) {
        return function() {
          _this.destroy();
          window.featureList.remove("bookmark-title", title);
          return View.log("" + title + " removed and placed in form");
        };
      })(this),
      error: (function(_this) {
        return function() {
          return View.error("Server error occured, bookmark was not deleted.");
        };
      })(this)
    });
  };

  return BookmarkView;

})(View);

});

;require.register("views/bookmarks_view", function(exports, require, module) {
var BookmarkCollection, BookmarkView, BookmarksView, ViewCollection,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ViewCollection = require('../lib/view_collection');

BookmarkView = require('./bookmark_view');

BookmarkCollection = require('../collections/bookmark_collection');

module.exports = BookmarksView = (function(superClass) {
  extend(BookmarksView, superClass);

  function BookmarksView() {
    this.renderOne = bind(this.renderOne, this);
    return BookmarksView.__super__.constructor.apply(this, arguments);
  }

  BookmarksView.prototype.el = '#bookmarks ul';

  BookmarksView.prototype.view = BookmarkView;

  BookmarksView.prototype.renderOne = function(model) {
    var sortObj, view;
    view = new this.view(model);
    this.$el.prepend(view.render().el);
    this.add(view);
    if (window.featureList) {
      sortObj = {
        "el": view.el,
        "values": window.sortOptions.valueNames
      };
      window.featureList.add(sortObj);
    }
    return this;
  };

  BookmarksView.prototype.initialize = function() {
    return this.collection = new BookmarkCollection(this);
  };

  return BookmarksView;

})(ViewCollection);

});

;require.register("views/templates/bookmark", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="buttons"><button title="Remove this link from saved bookmarks and place its details into the form" class="bookmark-delete glyphicon glyphicon-share"></button></div><div class="bookmark-link">');
if ( model.title)
{
buf.push('<div class="bookmark-title"><a');
buf.push(attrs({ 'href':("" + (model.httpUrl) + ""), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('>' + escape((interp = model.title) == null ? '' : interp) + '</a></div><div class="bookmark-url"><a');
buf.push(attrs({ 'href':("" + (model.httpUrl) + ""), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('>' + escape((interp = model.url) == null ? '' : interp) + '</a></div>');
}
else
{
buf.push('<div class="bookmark-title"><a');
buf.push(attrs({ 'href':("" + (model.httpUrl) + ""), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('>' + escape((interp = model.url) == null ? '' : interp) + '</a></div>');
}
buf.push('</div>');
if ( model.description || model.readableTags)
{
buf.push('<div class="bookmark-description box">');
if ( model.readableTags)
{
buf.push('<div class="bookmark-tags"><span>' + escape((interp = model.readableTags) == null ? '' : interp) + '</span></div>');
}
if ( model.description)
{
buf.push('<p>' + escape((interp = model.description) == null ? '' : interp) + '</p>');
}
buf.push('</div>');
}
}
return buf.join("");
};
});

;require.register("views/templates/home", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="content"><div id="bookmarks-exchange"><input id="bookmarks-exchange-file" type="file" name="exchange-file"/><button id="bookmarks-exchange-import" title="Import html bookmarks files exported from your browser" class="glyphicon glyphicon-upload"></button><button id="bookmarks-exchange-export" title="Export bookmarks in html" class="glyphicon glyphicon-download"></button><div id="bookmarks-exchange-done"></div><div id="bookmarks-exchange-failed"></div></div><form id="bookmark-add" class="box"><div id="bookmark-add-title" title="Toggle full bookmark form">Bookmark a link</div><input id="bookmark-add-link-url" placeholder="url"/><div id="bookmark-add-full"><input id="bookmark-add-link-title" placeholder="title"/><textarea id="bookmark-add-link-description" placeholder="description"></textarea><input id="bookmark-add-link-tags" placeholder="tags, separated by \',\'"/><div id="bookmark-add-buttons"><button id="bookmark-add-add" title="Save the bookmark" class="glyphicon glyphicon-ok-circle"></button><button id="bookmark-add-clean" title="Clear the form" class="glyphicon glyphicon-remove-circle"></button></div></div></form><div id="bookmarks" class="box"><div id="bookmarks-tools"><input id="bookmarks-tools-search" placeholder="search" class="search"/><button id="bookmarks-tools-clean" title="Clear search field" class="glyphicon glyphicon-remove-circle"></button><button id="bookmarks-tools-tags" title="Toggle tags cloud" class="glyphicon glyphicon-tags"></button><button id="bookmarks-tools-sort" title="Sort links" data-sort="bookmark-title" class="glyphicon glyphicon-sort sort"></button><div id="tags-cloud"> </div></div><ul class="list"></ul></div></div>');
}
return buf.join("");
};
});

;
//# sourceMappingURL=app.js.map