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

;require.register("collections/tag_collection", function(exports, require, module) {
var Tag, TagCollection,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Tag = require('../models/tag');

module.exports = TagCollection = (function(superClass) {
  extend(TagCollection, superClass);

  function TagCollection() {
    return TagCollection.__super__.constructor.apply(this, arguments);
  }

  TagCollection.prototype.model = Tag;

  TagCollection.prototype.url = 'tags';

  return TagCollection;

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
    $(function() {
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
        cb();
        return false;
      });
    });
    return false;
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

  Bookmark.prototype.tagSep = ",";

  Bookmark.prototype.isNew = function() {
    return this.id == null;
  };

  Bookmark.prototype.cleanValues = function() {
    var httpUrl, local, tags;
    tags = this.attributes.tags;
    if (typeof tags === "string") {
      tags = tags.split(this.tagSep);
    }
    this.attributes.readableTags = tags.join(this.tagSep + " ");
    httpUrl = this.attributes.url;
    if (httpUrl.slice(0, 4) !== "http") {
      httpUrl = "http://" + httpUrl;
    }
    this.attributes.httpUrl = httpUrl;
    if (!this.attributes.created) {
      this.attributes.date = "just now";
    } else {
      local = new Date(this.attributes.created);
      local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
      this.attributes.date = local.toLocaleDateString(void 0, {
        "day": "2-digit",
        "month": "2-digit",
        "year": "numeric"
      });
    }
    if (!this.attributes.title) {
      return this.attributes.htmlTitle = "&nbsp;";
    } else {
      return this.attributes.htmlTitle = this.attributes.title;
    }
  };

  Bookmark.prototype.setTags = function(str) {
    return str.split(this.tagSep).map(function(tag) {
      return $.trim(tag);
    });
  };

  return Bookmark;

})(Backbone.Model);

});

;require.register("models/tag", function(exports, require, module) {
var Tag,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

module.exports = Tag = (function(superClass) {
  extend(Tag, superClass);

  function Tag() {
    return Tag.__super__.constructor.apply(this, arguments);
  }

  Tag.prototype.urlRoot = 'tags';

  return Tag;

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
    "": function() {}
  };

  return AppRouter;

})(Backbone.Router);

});

;require.register("views/app_view", function(exports, require, module) {
var AppRouter, AppView, Bookmark, BookmarksView, Tag, TagsView, View,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

View = require("../lib/view");

AppRouter = require("../routers/app_router");

BookmarksView = require("./bookmarks_view");

Bookmark = require("../models/bookmark");

TagsView = require("./tags_view");

Tag = require("../models/tag");

module.exports = AppView = (function(superClass) {
  extend(AppView, superClass);

  function AppView() {
    return AppView.__super__.constructor.apply(this, arguments);
  }

  AppView.prototype.el = "body.application";

  AppView.prototype.events = {
    "submit #bookmark-add": "bookmarkLink",
    "shown.bs.modal #add-modal": "showAddForm",
    "shown.bs.modal #edit-modal": "showAddForm",
    "submit .search": "search",
    "click .tags-show": "showTags",
    "click .tags-hide": "hideTags",
    "click .import": "import",
    "change .import-file": "uploadFile",
    "click .export": "export"
  };

  AppView.prototype.template = function() {
    return require("./templates/home");
  };

  AppView.prototype.initialize = function() {
    this.router = CozyApp.Routers.AppRouter = new AppRouter();
    return this.loader = $("#loader");
  };

  AppView.prototype.startLoader = function() {
    return this.loader.show("slow");
  };

  AppView.prototype.stopLoader = function() {
    return this.loader.hide();
  };

  AppView.prototype.afterRender = function() {
    this.startLoader();
    this.bookmarksView = new BookmarksView();
    this.bookmarksView.collection.fetch({
      success: (function(_this) {
        return function() {
          _this.stopLoader();
          window.sortOptions = {
            "valueNames": ["title", "url", "tags", "description"]
          };
          window.featureList = new List("content", window.sortOptions);
          return View.log("bookmarks loaded");
        };
      })(this)
    });
    this.tagsView = new TagsView();
    return this.tagsView.collection.fetch({
      success: (function(_this) {
        return function() {
          return _this.tagsView.renderAll();
        };
      })(this)
    });
  };

  AppView.prototype.showAddForm = function(evt) {
    return $("#add-link").focus();
  };

  AppView.prototype.showEditForm = function(evt) {
    return $("#edit-link").focus();
  };

  AppView.prototype.cleanForm = function(form) {
    return form.find("input[type=text], textarea").val("");
  };

  AppView.prototype.bookmarkLink = function(evt) {
    var bookmark, description, title, url;
    evt.preventDefault();
    url = $("#add-link").val();
    if ((url != null ? url.length : void 0) > 0) {
      title = $("#add-title").val();
      description = $("#add-description").val();
      bookmark = new Bookmark();
      bookmark.set({
        "title": title,
        "url": url,
        "description": description,
        "tags": bookmark.setTags($("#add-tags").val())
      });
      return this.bookmarksView.collection.create(bookmark, {
        "success": (function(_this) {
          return function() {
            var modal;
            View.log("" + (title || url) + " added.");
            modal = $("#add-modal");
            modal.modal("hide");
            return _this.cleanForm(modal.find("form"));
          };
        })(this),
        "error": (function(_this) {
          return function() {
            return View.error("Server error occured, " + "bookmark was not saved");
          };
        })(this)
      });
    } else {
      return View.error("Url field is required");
    }
  };

  AppView.prototype.search = function(evt) {
    return false;
  };

  AppView.prototype.showTags = function() {
    $(".tag").addClass("tag-show");
    $(".tags-show").hide();
    return $(".tags-hide").show();
  };

  AppView.prototype.hideTags = function() {
    $(".tag").removeClass("tag-show");
    $(".tags-hide").hide();
    return $(".tags-show").show();
  };

  AppView.prototype.addBookmarkFromFile = function(link, others) {
    var $link, bookmark, description, next, tags, title, url;
    $link = $(link);
    if (!!$link.attr("href").indexOf("place") && !$link.attr("feedurl")) {
      url = $link.attr("href");
      title = $link.text();
      description = "";
      next = $link.parents(":first").next();
      if (next.is("dd")) {
        description = next.text();
      }
      tags = [];
      if ($link.attr("tags")) {
        tags = $link.attr("tags").split(",");
      }
      bookmark = new Bookmark({
        title: title,
        url: url,
        tags: tags,
        description: description
      });
      return this.bookmarksView.collection.create(bookmark, {
        success: (function(_this) {
          return function() {
            var imported;
            imported = $(".import .done");
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
            notImported = $(".import .failed");
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
    importButton = $(".import button");
    loaded = $(file);
    links = loaded.find("dt a");
    this.addBookmarkFromFile(links[0], links.slice(1));
    return importButton.removeClass("doing");
  };

  AppView.prototype.uploadFile = function(evt) {
    var file, importButton, reader;
    importButton = $(".import button");
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

  AppView.prototype["import"] = function() {
    return $(".import-file").click();
  };

  AppView.prototype["export"] = function() {
    return window.location = "export";
  };

  return AppView;

})(View);

});

;require.register("views/bookmark_view", function(exports, require, module) {
var BookmarkView, View,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

View = require("../lib/view");

module.exports = BookmarkView = (function(superClass) {
  extend(BookmarkView, superClass);

  BookmarkView.prototype.className = "bookmark";

  BookmarkView.prototype.tagName = "li";

  BookmarkView.prototype.events = {
    "click .edit": "edit",
    "click .remove": "erase"
  };

  function BookmarkView(model) {
    this.model = model;
    this["delete"] = bind(this["delete"], this);
    BookmarkView.__super__.constructor.call(this);
  }

  BookmarkView.prototype.template = function() {
    var template;
    template = require("./templates/bookmark");
    return template(this.getRenderData().model);
  };

  BookmarkView.prototype.render = function() {
    this.model.cleanValues();
    return BookmarkView.__super__.render.call(this);
  };

  BookmarkView.prototype.title = function() {
    return $.trim(this.model.get("title")) || this.model.get("url");
  };

  BookmarkView.prototype["delete"] = function() {
    var title;
    title = this.title();
    return this.model.destroy({
      success: (function(_this) {
        return function() {
          _this.destroy();
          window.featureList.remove("bookmark-title", title);
          return View.log("" + title + " removed.");
        };
      })(this),
      error: (function(_this) {
        return function() {
          return View.error("Server error occured, bookmark was not deleted.");
        };
      })(this)
    });
  };

  BookmarkView.prototype.erase = function() {
    return View.confirm("Do you really want to remove " + this.title() + "?", this["delete"]);
  };

  BookmarkView.prototype.edit = function() {
    var form, modal;
    form = $("#bookmark-edit");
    $("#edit-title").val(this.model.get("title"));
    $("#edit-link").val(this.model.get("url"));
    $("#edit-description").val(this.model.get("description"));
    $("#edit-tags").val(this.model.get("readableTags"));
    modal = $("#edit-modal");
    modal.modal("show");
    form.unbind("submit");
    return form.on("submit", (function(_this) {
      return function(evt) {
        var newValues;
        evt.preventDefault();
        newValues = {
          "title": $("#edit-title").val(),
          "url": $("#edit-link").val(),
          "description": $("#edit-description").val(),
          "tags": _this.model.setTags($("#edit-tags").val())
        };
        return _this.model.save(newValues, {
          "success": function() {
            var title;
            title = _this.model.attributes.title || _this.model.attributes.url;
            View.log("" + title + " modified.");
            modal.modal("hide");
            return _this.render();
          },
          "error": function(a, b, c) {
            return View.error("Server error occured, " + "bookmark was not saved");
          }
        });
      };
    })(this));
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

;require.register("views/tag_view", function(exports, require, module) {
var TagView, View,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

View = require("../lib/view");

module.exports = TagView = (function(superClass) {
  extend(TagView, superClass);

  TagView.prototype.className = "tag";

  TagView.prototype.tagName = "span";

  TagView.prototype.events = {
    "click": "search"
  };

  function TagView(model) {
    this.values = model;
    TagView.__super__.constructor.call(this);
  }

  TagView.prototype.getRenderData = function() {
    return this.values;
  };

  TagView.prototype.template = function() {
    var template;
    template = require("./templates/tag");
    return template(this.getRenderData());
  };

  TagView.prototype.search = function() {
    $(".search input").val(this.values.tag);
    return window.featureList.search(this.values.tag, {
      "tags": "tags"
    });
  };

  return TagView;

})(View);

});

;require.register("views/tags_view", function(exports, require, module) {
var TagCollection, TagView, TagsView, ViewCollection,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ViewCollection = require('../lib/view_collection');

TagCollection = require('../collections/tag_collection');

TagView = require('./tag_view');

module.exports = TagsView = (function(superClass) {
  extend(TagsView, superClass);

  function TagsView() {
    this.renderAll = bind(this.renderAll, this);
    return TagsView.__super__.constructor.apply(this, arguments);
  }

  TagsView.prototype.el = '#tags';

  TagsView.prototype.view = TagView;

  TagsView.prototype.renderAll = function() {
    var average, model, score, scores, tag, total, view;
    scores = {};
    total = 0;
    this.collection.each(function(elem) {
      var tag;
      if ((elem != null) && (elem.get("tag") != null)) {
        tag = elem.get("tag");
        if ((tag != null) && (scores[tag] != null)) {
          return scores[tag] += 1;
        } else {
          scores[tag] = 1;
          return total += 1;
        }
      }
    });
    average = this.collection.length / total;
    for (tag in scores) {
      score = scores[tag];
      model = {
        tag: tag,
        score: 1 + .3 * (score / average)
      };
      view = new this.view(model);
      this.$el.prepend(view.render().el);
      this.add(view);
    }
    return this;
  };

  TagsView.prototype.initialize = function() {
    return this.collection = new TagCollection(this);
  };

  return TagsView;

})(ViewCollection);

});

;require.register("views/templates/bookmark", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="row"><div class="main"><div class="title col-xs-9 col-sm-11 col-md-4"><a');
buf.push(attrs({ 'href':(httpUrl), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('>' + escape((interp = htmlTitle) == null ? '' : interp) + '</a></div><div class="url col-xs-9 col-sm-6 col-md-5"> <a');
buf.push(attrs({ 'href':(httpUrl), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('>' + escape((interp = url) == null ? '' : interp) + '</a></div><div class="infos col-xs-9 col-sm-5 col-md-2"> <div class="tags">' + escape((interp = readableTags) == null ? '' : interp) + '</div><div class="date">' + escape((interp = date) == null ? '' : interp) + '</div></div><div class="actions"><button type="button" class="btn btn-primary edit"> <span class="glyphicon glyphicon-pencil"> </span></button><button type="button" class="btn btn-primary remove"> <span class="glyphicon glyphicon-remove"> </span></button></div></div><div class="more"><div class="description col-xs-11">' + escape((interp = description) == null ? '' : interp) + '</div></div></div>');
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
buf.push('<div id="content"><div id="add-modal" tabindex="-1" role="dialog" class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" data-dismiss="modal" aria-label="Close" class="close"><span aria-hidden="true">&times;</span></button><h2 class="modal-title">Add a new bookmark</h2></div><form id="bookmark-add" class="form-horizontal"><div class="modal-body"><div class="form-group row"><label for="add-link" class="col-xs-2  control-label">Link URL</label><div class="col-xs-9"><input id="add-link" type="text" placeholder="http://cozy.io/" class="form-control"/></div></div><div class="form-group row"><label for="add-title" class="col-xs-2  control-label">Title</label><div class="col-xs-9"><input id="add-title" type="text" placeholder="A short title for your bookmark" class="form-control"/></div></div><div class="form-group row"><label for="add-description" class="col-xs-2  control-label">Description</label><div class="col-xs-9"><textarea id="add-description" placeholder="A more complete description of your bookmark" class="form-control"></textarea></div></div><div class="form-group row"><label for="add-tags" class="col-xs-2  control-label">Tags</label><div class="col-xs-9"><input id="add-tags" type="text" placeholder="free, news" class="form-control"/><p class="help-block">you can use multiple tags, use comma to split them</p></div></div></div><div class="modal-footer"><button type="button" data-dismiss="modal" class="btn btn-default">Cancel</button><button type="submit" class="btn btn-primary"> <span class="glyphicon glyphicon-plus"> </span>Add</button></div></form></div></div></div><div id="edit-modal" tabindex="-1" role="dialog" class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" data-dismiss="modal" aria-label="Close" class="close"><span aria-hidden="true">&times;</span></button><h2 class="modal-title">Edit the bookmark</h2></div><form id="bookmark-edit" class="form-horizontal"><div class="modal-body"><div class="form-group row"><label for="edit-link" class="col-xs-2  control-label">Link URL</label><div class="col-xs-9"><input id="edit-link" type="text" placeholder="http://cozy.io/" class="form-control"/></div></div><div class="form-group row"><label for="edit-title" class="col-xs-2  control-label">Title</label><div class="col-xs-9"><input id="edit-title" type="text" placeholder="A short title for your bookmark" class="form-control"/></div></div><div class="form-group row"><label for="edit-description" class="col-xs-2  control-label">Description</label><div class="col-xs-9"><textarea id="edit-description" placeholder="A more complete description of your bookmark" class="form-control"></textarea></div></div><div class="form-group row"><label for="edit-tags" class="col-xs-2  control-label">Tags</label><div class="col-xs-9"><input id="edit-tags" type="text" placeholder="free, news" class="form-control"/><p class="help-block">you can use multiple tags, use comma to split them</p></div></div></div><div class="modal-footer"><button type="button" data-dismiss="modal" class="btn btn-default">Cancel</button><button type="submit" class="btn btn-primary"> <span class="glyphicon glyphicon-plus"> </span>Save</button></div></form></div></div></div><div id="transfer-modal" tabindex="-1" role="dialog" class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" data-dismiss="modal" aria-label="Close" class="close"><span aria-hidden="true">&times;</span></button><h2 class="modal-title">Import/Export bookmarks</h2><div class="modal-body"><input type="file" name="import-file" class="import-file"/><div class="import"><button type="button" class="btn btn-primary">Import</button><div class="done"></div><div class="failed"></div></div><div class="export"><button type="button" class="btn btn-primary">Export</button></div></div></div></div></div></div><div id="header"><div class="row"><div class="add"><button type="button" data-toggle="modal" data-target="#add-modal" class="btn btn-default add-bookmark"> <span class="glyphicon glyphicon-plus col-xs-11 col-md-1"></span><div class="add-bookmark-title hidden-xs col-md-10">Add a new bookmark</div></button></div><div class="or">or</div><form class="search"><div class="input-group"><input type="text" placeholder="Search for a bookmark" class="form-control"/><div class="input-group-addon"><img src="icons/search.svg" alt="search"/></div></div><p class="help-block">Type a keyword, we will search for it in your saved bookmarks </p></form><div class="transfer"><button title="import/export bookmarks" type="button" data-toggle="modal" data-target="#transfer-modal" class="btn btn-default transfer-bookmarks"> <span class="glyphicon glyphicon-transfer"></span></button></div></div></div><div id="tags-toggle" class="row"><div class="buttons col-xs-offset-1 col-sm-offset-9"><div class="tags-show"><span class="glyphicon glyphicon-chevron-down"></span>show tags</div><div class="tags-hide"><span class="glyphicon glyphicon-chevron-up"></span>hide tags</div></div></div><div id="tags"></div><div id="loader" class="loader-inner ball-pulse"><p>Loading bookmarks, please wait ...</p></div><div id="bookmarks"><ul class="list"></ul></div></div>');
}
return buf.join("");
};
});

;require.register("views/templates/tag", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<span');
buf.push(attrs({ 'style':("font-size:" + (score) + "em") }, {"style":true}));
buf.push('>' + escape((interp = tag) == null ? '' : interp) + '</span>');
}
return buf.join("");
};
});

;
//# sourceMappingURL=app.js.map