// Generated by CoffeeScript 1.7.1
var Bookmark, EXPORT_FOOTER, EXPORT_HEADER, MakeLink, SendError;

Bookmark = require('../models/bookmark');

SendError = function(res, details, httpCode) {
  var msg;
  if (httpCode == null) {
    httpCode = 500;
  }
  msg = 'Internal server error: ' + details;
  res.send({
    error: true,
    msg: msg
  }, httpCode);
  return true;
};

module.exports.all = function(req, res) {
  return Bookmark.all(function(err, bookmarks) {
    if (err) {
      console.error(err);
      SendError(res, 'while retrieving data');
      return;
    }
    return res.send(bookmarks);
  });
};

EXPORT_HEADER = "<!DOCTYPE NETSCAPE-Bookmark-file-1>\n  <META HTTP-EQUIV=\"Content-Type\" CONTENT=\"text/html; charset=UTF-8\">\n      <TITLE>Bookmarks</TITLE>\n      <H1>Bookmarks Menu</H1>\n      <DL><DT><H3>Cozy Bookmark</H3>\n        <DL>";

EXPORT_FOOTER = "  </DL>\n</DL>";

MakeLink = function(name, link, date, tags) {
  var ret;
  date = +date;
  ret = "<DT><A HREF='" + link + "' ADD_DATE='" + date + "' LAST_MODIFIED='" + date + "'";
  if (tags != null) {
    ret += " TAGS='" + tags + "'";
  }
  ret += ">" + name + "</A></DT>\n";
  return ret;
};

module.exports["export"] = function(req, res) {
  return Bookmark.all(function(err, bookmarks) {
    var b, creation_date, exported, link, name, tags, _i, _len;
    if (err) {
      console.error(err);
      SendError(res, 'while retrieving data for export');
      return;
    }
    exported = EXPORT_HEADER;
    for (_i = 0, _len = bookmarks.length; _i < _len; _i++) {
      b = bookmarks[_i];
      name = b.title;
      link = b.url;
      creation_date = new Date(b.created);
      tags = b.tags;
      exported += MakeLink(name, link, creation_date, tags);
    }
    exported += EXPORT_FOOTER;
    res.setHeader('Content-disposition', 'attachment; filename=bookmarks.html');
    return res.send(exported);
  });
};

module.exports.create = function(req, res) {
  return Bookmark.create(req.body, (function(_this) {
    return function(err, bookmark) {
      if (err) {
        console.error(err);
        SendError(res, 'while creating bookmark');
        return;
      }
      return res.send(bookmark);
    };
  })(this));
};

module.exports.destroy = function(req, res) {
  return Bookmark.find(req.params.id, (function(_this) {
    return function(err, bookmark) {
      if (err) {
        SendError(res, 'while finding bookmark with id ' + req.params.id);
        return;
      }
      if (!bookmark) {
        SendError(res, 'bookmark not found', 404);
        return;
      }
      return bookmark.destroy(function(err) {
        if (err) {
          console.error(err);
          SendError(res, 'while destroying bookmark');
          return;
        }
        res.send({
          success: 'Bookmark successfully deleted'
        });
        return bookmark = null;
      });
    };
  })(this));
};