(function() {
  define(function(require, exports) {
    var Logger, sprintf;
    sprintf = require('sprintf');
    Logger = (function() {
      function Logger(stdio, context) {
        this.stdio = stdio != null ? stdio.bind(context) : void 0;
      }

      Logger.prototype._log = function(type, args) {
        return console[type].apply(console, args);
      };

      Logger.prototype.log = function() {
        this._log('log', arguments);
        if (this.stdio != null) {
          return this.stdio(sprintf.sprintf.apply(this, arguments));
        }
      };

      Logger.prototype.warn = function() {
        this._log('warn', arguments);
        if (this.stdio != null) {
          return this.stdio(sprintf.sprintf.apply(this, arguments), true);
        }
      };

      Logger.prototype.init = function(stdio, context) {
        if (stdio) {
          if (context) {
            this.stdio = stdio.bind(context);
          } else {
            this.stdio = this.stdio;
          }
        }
        return this;
      };

      return Logger;

    })();
    return exports = new Logger;
  });

}).call(this);
