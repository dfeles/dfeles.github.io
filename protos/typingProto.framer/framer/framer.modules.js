require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"CameraLayer":[function(require,module,exports){
var CameraLayer,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

CameraLayer = (function(superClass) {
  extend(CameraLayer, superClass);

  function CameraLayer(options) {
    var baseOptions, customProps, ref, ref1, ref2, ref3, ref4;
    if (options == null) {
      options = {};
    }
    customProps = {
      facing: true,
      flipped: true,
      autoFlip: true,
      resolution: true,
      fit: true
    };
    baseOptions = Object.keys(options).filter(function(key) {
      return !customProps[key];
    }).reduce(function(clone, key) {
      clone[key] = options[key];
      return clone;
    }, {});
    CameraLayer.__super__.constructor.call(this, baseOptions);
    this._facing = (ref = options.facing) != null ? ref : 'back';
    this._flipped = (ref1 = options.flipped) != null ? ref1 : false;
    this._autoFlip = (ref2 = options.autoFlip) != null ? ref2 : true;
    this._resolution = (ref3 = options.resolution) != null ? ref3 : 480;
    this._started = false;
    this._device = null;
    this._matchedFacing = 'unknown';
    this._stream = null;
    this._scheduledRestart = null;
    this._recording = null;
    this.backgroundColor = 'transparent';
    this.clip = true;
    this.player.src = '';
    this.player.autoplay = true;
    this.player.muted = true;
    this.player.style.objectFit = (ref4 = options.fit) != null ? ref4 : 'cover';
  }

  CameraLayer.define('facing', {
    get: function() {
      return this._facing;
    },
    set: function(facing) {
      this._facing = facing === 'front' ? facing : 'back';
      return this._setRestart();
    }
  });

  CameraLayer.define('flipped', {
    get: function() {
      return this._flipped;
    },
    set: function(flipped) {
      this._flipped = flipped;
      return this._setRestart();
    }
  });

  CameraLayer.define('autoFlip', {
    get: function() {
      return this._autoFlip;
    },
    set: function(autoFlip) {
      this._autoFlip = autoFlip;
      return this._setRestart();
    }
  });

  CameraLayer.define('resolution', {
    get: function() {
      return this._resolution;
    },
    set: function(resolution) {
      this._resolution = resolution;
      return this._setRestart();
    }
  });

  CameraLayer.define('fit', {
    get: function() {
      return this.player.style.objectFit;
    },
    set: function(fit) {
      return this.player.style.objectFit = fit;
    }
  });

  CameraLayer.define('isRecording', {
    get: function() {
      var ref;
      return ((ref = this._recording) != null ? ref.recorder.state : void 0) === 'recording';
    }
  });

  CameraLayer.prototype.toggleFacing = function() {
    this._facing = this._facing === 'front' ? 'back' : 'front';
    return this._setRestart();
  };

  CameraLayer.prototype.capture = function(width, height, ratio) {
    var canvas, context, url;
    if (width == null) {
      width = this.width;
    }
    if (height == null) {
      height = this.height;
    }
    if (ratio == null) {
      ratio = window.devicePixelRatio;
    }
    canvas = document.createElement("canvas");
    canvas.width = ratio * width;
    canvas.height = ratio * height;
    context = canvas.getContext("2d");
    this.draw(context);
    url = canvas.toDataURL();
    this.emit('capture', url);
    return url;
  };

  CameraLayer.prototype.draw = function(context) {
    var clipBox, cover, layerBox, ref, videoBox, videoHeight, videoWidth, x, y;
    if (!context) {
      return;
    }
    cover = function(srcW, srcH, dstW, dstH) {
      var scale, scaleX, scaleY;
      scaleX = dstW / srcW;
      scaleY = dstH / srcH;
      scale = scaleX > scaleY ? scaleX : scaleY;
      return {
        width: srcW * scale,
        height: srcH * scale
      };
    };
    ref = this.player, videoWidth = ref.videoWidth, videoHeight = ref.videoHeight;
    clipBox = {
      width: context.canvas.width,
      height: context.canvas.height
    };
    layerBox = cover(this.width, this.height, clipBox.width, clipBox.height);
    videoBox = cover(videoWidth, videoHeight, layerBox.width, layerBox.height);
    x = (clipBox.width - videoBox.width) / 2;
    y = (clipBox.height - videoBox.height) / 2;
    return context.drawImage(this.player, x, y, videoBox.width, videoBox.height);
  };

  CameraLayer.prototype.start = function() {
    return this._enumerateDevices().then((function(_this) {
      return function(devices) {
        var device, i, len;
        devices = devices.filter(function(device) {
          return device.kind === 'videoinput';
        });
        for (i = 0, len = devices.length; i < len; i++) {
          device = devices[i];
          if (device.label.indexOf(_this._facing) !== -1) {
            _this._matchedFacing = _this._facing;
            return device;
          }
        }
        _this._matchedFacing = 'unknown';
        if (devices.length > 0) {
          return devices[0];
        } else {
          return Promise.reject();
        }
      };
    })(this)).then((function(_this) {
      return function(device) {
        var constraints, ref;
        if (!device || device.deviceId === ((ref = _this._device) != null ? ref.deviceId : void 0)) {
          return;
        }
        _this.stop();
        _this._device = device;
        constraints = {
          video: {
            mandatory: {
              minWidth: _this._resolution,
              minHeight: _this._resolution
            },
            optional: [
              {
                sourceId: _this._device.deviceId
              }
            ]
          },
          audio: true
        };
        return _this._getUserMedia(constraints);
      };
    })(this)).then((function(_this) {
      return function(stream) {
        _this.player.src = URL.createObjectURL(stream);
        _this._started = true;
        _this._stream = stream;
        return _this._flip();
      };
    })(this))["catch"](function(error) {
      return console.error(error);
    });
  };

  CameraLayer.prototype.stop = function() {
    var ref;
    this._started = false;
    this.player.pause();
    this.player.src = '';
    if ((ref = this._stream) != null) {
      ref.getTracks().forEach(function(track) {
        return track.stop();
      });
    }
    this._stream = null;
    this._device = null;
    if (this._scheduledRestart) {
      cancelAnimationFrame(this._scheduledRestart);
      return this._scheduledRestart = null;
    }
  };

  CameraLayer.prototype.startRecording = function() {
    var chunks, recorder;
    if (this._recording) {
      this._recording.recorder.stop();
      this._recording = null;
    }
    chunks = [];
    recorder = new MediaRecorder(this._stream, {
      mimeType: 'video/webm'
    });
    recorder.addEventListener('start', (function(_this) {
      return function(event) {
        return _this.emit('startrecording');
      };
    })(this));
    recorder.addEventListener('dataavailable', function(event) {
      return chunks.push(event.data);
    });
    recorder.addEventListener('stop', (function(_this) {
      return function(event) {
        var blob, url;
        blob = new Blob(chunks);
        url = window.URL.createObjectURL(blob);
        _this.emit('stoprecording');
        return _this.emit('record', url);
      };
    })(this));
    recorder.start();
    return this._recording = {
      recorder: recorder,
      chunks: chunks
    };
  };

  CameraLayer.prototype.stopRecording = function() {
    if (!this._recording) {
      return;
    }
    this._recording.recorder.stop();
    return this._recording = null;
  };

  CameraLayer.prototype.onCapture = function(callback) {
    return this.on('capture', callback);
  };

  CameraLayer.prototype.onStartRecording = function(callback) {
    return this.on('startrecording', callback);
  };

  CameraLayer.prototype.onStopRecording = function(callback) {
    return this.on('stoprecording', callback);
  };

  CameraLayer.prototype.onRecord = function(callback) {
    return this.on('record', callback);
  };

  CameraLayer.prototype._setRestart = function() {
    if (!this._started || this._scheduledRestart) {
      return;
    }
    return this._scheduledRestart = requestAnimationFrame((function(_this) {
      return function() {
        _this._scheduledRestart = null;
        return _this.start();
      };
    })(this));
  };

  CameraLayer.prototype._flip = function() {
    var x;
    if (this._autoFlip) {
      this._flipped = this._matchedFacing === 'front';
    }
    x = this._flipped ? -1 : 1;
    return this.player.style.webkitTransform = "scale(" + x + ", 1)";
  };

  CameraLayer.prototype._enumerateDevices = function() {
    try {
      return navigator.mediaDevices.enumerateDevices();
    } catch (error1) {
      return Promise.reject();
    }
  };

  CameraLayer.prototype._getUserMedia = function(constraints) {
    return new Promise(function(resolve, reject) {
      var gum;
      try {
        gum = navigator.getUserMedia || navigator.webkitGetUserMedia;
        return gum.call(navigator, constraints, resolve, reject);
      } catch (error1) {
        return reject();
      }
    });
  };

  return CameraLayer;

})(VideoLayer);

if (typeof module !== "undefined" && module !== null) {
  module.exports = CameraLayer;
}

Framer.CameraLayer = CameraLayer;


},{}],"input":[function(require,module,exports){
var growthRatio, imageHeight,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.keyboardLayer = new Layer({
  x: 0,
  y: Screen.height,
  width: Screen.width,
  height: 432,
  html: "<img style='width: 100%;' src='modules/keyboard.png'/>"
});

growthRatio = Screen.width / 732;

imageHeight = growthRatio * 432;

exports.keyboardLayer.states = {
  shown: {
    y: Screen.height - imageHeight
  }
};

exports.keyboardLayer.states.animationOptions = {
  curve: "spring(500,50,15)"
};

exports.Input = (function(superClass) {
  extend(Input, superClass);

  Input.define("style", {
    get: function() {
      return this.input.style;
    },
    set: function(value) {
      return _.extend(this.input.style, value);
    }
  });

  Input.define("value", {
    get: function() {
      return this.input.value;
    },
    set: function(value) {
      return this.input.value = value;
    }
  });

  function Input(options) {
    if (options == null) {
      options = {};
    }
    if (options.setup == null) {
      options.setup = false;
    }
    if (options.width == null) {
      options.width = Screen.width;
    }
    if (options.clip == null) {
      options.clip = false;
    }
    if (options.height == null) {
      options.height = 60;
    }
    if (options.backgroundColor == null) {
      options.backgroundColor = options.setup ? "rgba(255, 60, 47, .5)" : "transparent";
    }
    if (options.fontSize == null) {
      options.fontSize = 30;
    }
    if (options.lineHeight == null) {
      options.lineHeight = 30;
    }
    if (options.padding == null) {
      options.padding = 10;
    }
    if (options.text == null) {
      options.text = "";
    }
    if (options.placeholder == null) {
      options.placeholder = "";
    }
    if (options.virtualKeyboard == null) {
      options.virtualKeyboard = Utils.isMobile() ? false : true;
    }
    if (options.type == null) {
      options.type = "text";
    }
    if (options.goButton == null) {
      options.goButton = false;
    }
    if (options.autoCorrect == null) {
      options.autoCorrect = "on";
    }
    if (options.autoComplete == null) {
      options.autoComplete = "on";
    }
    if (options.autoCapitalize == null) {
      options.autoCapitalize = "on";
    }
    if (options.spellCheck == null) {
      options.spellCheck = "on";
    }
    if (options.autofocus == null) {
      options.autofocus = false;
    }
    Input.__super__.constructor.call(this, options);
    if (options.placeholderColor != null) {
      this.placeholderColor = options.placeholderColor;
    }
    this.input = document.createElement("input");
    this.input.id = "input-" + (_.now());
    this.input.style.cssText = "outline: none; font-size: " + options.fontSize + "px; line-height: " + options.lineHeight + "px; padding: " + options.padding + "px; width: " + options.width + "px; height: " + options.height + "px; border: none; background-image: url(about:blank); background-color: " + options.backgroundColor + ";";
    this.input.value = options.text;
    this.input.type = options.type;
    this.input.placeholder = options.placeholder;
    this.input.setAttribute("autocorrect", options.autoCorrect);
    this.input.setAttribute("autocomplete", options.autoComplete);
    this.input.setAttribute("autocapitalize", options.autoCapitalize);
    if (options.autofocus === true) {
      this.input.setAttribute("autofocus", true);
    }
    this.input.setAttribute("spellcheck", options.spellCheck);
    this.form = document.createElement("form");
    if (options.goButton) {
      this.form.action = "#";
      this.form.addEventListener("submit", function(event) {
        return event.preventDefault();
      });
    }
    this.form.appendChild(this.input);
    this._element.appendChild(this.form);
    this.backgroundColor = "transparent";
    if (this.placeholderColor) {
      this.updatePlaceholderColor(options.placeholderColor);
    }
    if (!Utils.isMobile() && options.virtualKeyboard === true) {
      this.input.addEventListener("focus", function() {
        exports.keyboardLayer.bringToFront();
        return exports.keyboardLayer.stateCycle();
      });
      this.input.addEventListener("blur", function() {
        return exports.keyboardLayer.animate("default");
      });
    }
  }

  Input.prototype.updatePlaceholderColor = function(color) {
    var css;
    this.placeholderColor = color;
    if (this.pageStyle != null) {
      document.head.removeChild(this.pageStyle);
    }
    this.pageStyle = document.createElement("style");
    this.pageStyle.type = "text/css";
    css = "#" + this.input.id + "::-webkit-input-placeholder { color: " + this.placeholderColor + "; }";
    this.pageStyle.appendChild(document.createTextNode(css));
    return document.head.appendChild(this.pageStyle);
  };

  Input.prototype.focus = function() {
    return this.input.focus();
  };

  Input.prototype.onFocus = function(cb) {
    return this.input.addEventListener("focus", function() {
      return cb.apply(this);
    });
  };

  Input.prototype.onBlur = function(cb) {
    return this.input.addEventListener("blur", function() {
      return cb.apply(this);
    });
  };

  return Input;

})(Layer);


},{}],"myModule":[function(require,module,exports){
exports.myVar = "myVariable";

exports.myFunction = function() {
  return print("myFunction is running");
};

exports.myArray = [1, 2, 3];


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1VzZXJzL2RmZWxlcy9Eb2N1bWVudHMvbGlmZS9GbGFyZS9mbGFyZS90eXBpbmdQcm90by5mcmFtZXIvbW9kdWxlcy9teU1vZHVsZS5jb2ZmZWUiLCIuLi8uLi8uLi8uLi8uLi9Vc2Vycy9kZmVsZXMvRG9jdW1lbnRzL2xpZmUvRmxhcmUvZmxhcmUvdHlwaW5nUHJvdG8uZnJhbWVyL21vZHVsZXMvaW5wdXQuY29mZmVlIiwiLi4vLi4vLi4vLi4vLi4vVXNlcnMvZGZlbGVzL0RvY3VtZW50cy9saWZlL0ZsYXJlL2ZsYXJlL3R5cGluZ1Byb3RvLmZyYW1lci9tb2R1bGVzL0NhbWVyYUxheWVyLmNvZmZlZSIsIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiIyBBZGQgdGhlIGZvbGxvd2luZyBsaW5lIHRvIHlvdXIgcHJvamVjdCBpbiBGcmFtZXIgU3R1ZGlvLiBcbiMgbXlNb2R1bGUgPSByZXF1aXJlIFwibXlNb2R1bGVcIlxuIyBSZWZlcmVuY2UgdGhlIGNvbnRlbnRzIGJ5IG5hbWUsIGxpa2UgbXlNb2R1bGUubXlGdW5jdGlvbigpIG9yIG15TW9kdWxlLm15VmFyXG5cbmV4cG9ydHMubXlWYXIgPSBcIm15VmFyaWFibGVcIlxuXG5leHBvcnRzLm15RnVuY3Rpb24gPSAtPlxuXHRwcmludCBcIm15RnVuY3Rpb24gaXMgcnVubmluZ1wiXG5cbmV4cG9ydHMubXlBcnJheSA9IFsxLCAyLCAzXSIsImV4cG9ydHMua2V5Ym9hcmRMYXllciA9IG5ldyBMYXllclxuXHR4OjAsIHk6U2NyZWVuLmhlaWdodCwgd2lkdGg6U2NyZWVuLndpZHRoLCBoZWlnaHQ6NDMyXG5cdGh0bWw6XCI8aW1nIHN0eWxlPSd3aWR0aDogMTAwJTsnIHNyYz0nbW9kdWxlcy9rZXlib2FyZC5wbmcnLz5cIlxuXG4jc2NyZWVuIHdpZHRoIHZzLiBzaXplIG9mIGltYWdlIHdpZHRoXG5ncm93dGhSYXRpbyA9IFNjcmVlbi53aWR0aCAvIDczMlxuaW1hZ2VIZWlnaHQgPSBncm93dGhSYXRpbyAqIDQzMlxuXG5leHBvcnRzLmtleWJvYXJkTGF5ZXIuc3RhdGVzID1cblx0c2hvd246IFxuXHRcdHk6IFNjcmVlbi5oZWlnaHQgLSBpbWFnZUhlaWdodFxuXG5leHBvcnRzLmtleWJvYXJkTGF5ZXIuc3RhdGVzLmFuaW1hdGlvbk9wdGlvbnMgPVxuXHRjdXJ2ZTogXCJzcHJpbmcoNTAwLDUwLDE1KVwiXG5cbmNsYXNzIGV4cG9ydHMuSW5wdXQgZXh0ZW5kcyBMYXllclxuXHRAZGVmaW5lIFwic3R5bGVcIixcblx0XHRnZXQ6IC0+IEBpbnB1dC5zdHlsZVxuXHRcdHNldDogKHZhbHVlKSAtPlxuXHRcdFx0Xy5leHRlbmQgQGlucHV0LnN0eWxlLCB2YWx1ZVxuXG5cdEBkZWZpbmUgXCJ2YWx1ZVwiLFxuXHRcdGdldDogLT4gQGlucHV0LnZhbHVlXG5cdFx0c2V0OiAodmFsdWUpIC0+XG5cdFx0XHRAaW5wdXQudmFsdWUgPSB2YWx1ZVxuXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucyA9IHt9KSAtPlxuXHRcdG9wdGlvbnMuc2V0dXAgPz0gZmFsc2Vcblx0XHRvcHRpb25zLndpZHRoID89IFNjcmVlbi53aWR0aFxuXHRcdG9wdGlvbnMuY2xpcCA/PSBmYWxzZVxuXHRcdG9wdGlvbnMuaGVpZ2h0ID89IDYwXG5cdFx0b3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgPz0gaWYgb3B0aW9ucy5zZXR1cCB0aGVuIFwicmdiYSgyNTUsIDYwLCA0NywgLjUpXCIgZWxzZSBcInRyYW5zcGFyZW50XCJcblx0XHRvcHRpb25zLmZvbnRTaXplID89IDMwXG5cdFx0b3B0aW9ucy5saW5lSGVpZ2h0ID89IDMwXG5cdFx0b3B0aW9ucy5wYWRkaW5nID89IDEwXG5cdFx0b3B0aW9ucy50ZXh0ID89IFwiXCJcblx0XHRvcHRpb25zLnBsYWNlaG9sZGVyID89IFwiXCJcblx0XHRvcHRpb25zLnZpcnR1YWxLZXlib2FyZCA/PSBpZiBVdGlscy5pc01vYmlsZSgpIHRoZW4gZmFsc2UgZWxzZSB0cnVlXG5cdFx0b3B0aW9ucy50eXBlID89IFwidGV4dFwiXG5cdFx0b3B0aW9ucy5nb0J1dHRvbiA/PSBmYWxzZVxuXHRcdG9wdGlvbnMuYXV0b0NvcnJlY3QgPz0gXCJvblwiXG5cdFx0b3B0aW9ucy5hdXRvQ29tcGxldGUgPz0gXCJvblwiXG5cdFx0b3B0aW9ucy5hdXRvQ2FwaXRhbGl6ZSA/PSBcIm9uXCJcblx0XHRvcHRpb25zLnNwZWxsQ2hlY2sgPz0gXCJvblwiXG5cdFx0b3B0aW9ucy5hdXRvZm9jdXMgPz0gZmFsc2VcblxuXHRcdHN1cGVyIG9wdGlvbnNcblxuXHRcdEBwbGFjZWhvbGRlckNvbG9yID0gb3B0aW9ucy5wbGFjZWhvbGRlckNvbG9yIGlmIG9wdGlvbnMucGxhY2Vob2xkZXJDb2xvcj9cblx0XHRAaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50IFwiaW5wdXRcIlxuXHRcdEBpbnB1dC5pZCA9IFwiaW5wdXQtI3tfLm5vdygpfVwiXG5cdFx0QGlucHV0LnN0eWxlLmNzc1RleHQgPSBcIm91dGxpbmU6IG5vbmU7IGZvbnQtc2l6ZTogI3tvcHRpb25zLmZvbnRTaXplfXB4OyBsaW5lLWhlaWdodDogI3tvcHRpb25zLmxpbmVIZWlnaHR9cHg7IHBhZGRpbmc6ICN7b3B0aW9ucy5wYWRkaW5nfXB4OyB3aWR0aDogI3tvcHRpb25zLndpZHRofXB4OyBoZWlnaHQ6ICN7b3B0aW9ucy5oZWlnaHR9cHg7IGJvcmRlcjogbm9uZTsgYmFja2dyb3VuZC1pbWFnZTogdXJsKGFib3V0OmJsYW5rKTsgYmFja2dyb3VuZC1jb2xvcjogI3tvcHRpb25zLmJhY2tncm91bmRDb2xvcn07XCJcblx0XHRAaW5wdXQudmFsdWUgPSBvcHRpb25zLnRleHRcblx0XHRAaW5wdXQudHlwZSA9IG9wdGlvbnMudHlwZVxuXHRcdEBpbnB1dC5wbGFjZWhvbGRlciA9IG9wdGlvbnMucGxhY2Vob2xkZXJcblx0XHRAaW5wdXQuc2V0QXR0cmlidXRlIFwiYXV0b2NvcnJlY3RcIiwgb3B0aW9ucy5hdXRvQ29ycmVjdFxuXHRcdEBpbnB1dC5zZXRBdHRyaWJ1dGUgXCJhdXRvY29tcGxldGVcIiwgb3B0aW9ucy5hdXRvQ29tcGxldGVcblx0XHRAaW5wdXQuc2V0QXR0cmlidXRlIFwiYXV0b2NhcGl0YWxpemVcIiwgb3B0aW9ucy5hdXRvQ2FwaXRhbGl6ZVxuXHRcdGlmIG9wdGlvbnMuYXV0b2ZvY3VzID09IHRydWVcblx0XHRcdEBpbnB1dC5zZXRBdHRyaWJ1dGUgXCJhdXRvZm9jdXNcIiwgdHJ1ZVxuXHRcdEBpbnB1dC5zZXRBdHRyaWJ1dGUgXCJzcGVsbGNoZWNrXCIsIG9wdGlvbnMuc3BlbGxDaGVja1xuXHRcdEBmb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBcImZvcm1cIlxuXG5cdFx0aWYgb3B0aW9ucy5nb0J1dHRvblxuXHRcdFx0QGZvcm0uYWN0aW9uID0gXCIjXCJcblx0XHRcdEBmb3JtLmFkZEV2ZW50TGlzdGVuZXIgXCJzdWJtaXRcIiwgKGV2ZW50KSAtPlxuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cblx0XHRAZm9ybS5hcHBlbmRDaGlsZCBAaW5wdXRcblx0XHRAX2VsZW1lbnQuYXBwZW5kQ2hpbGQgQGZvcm1cblxuXHRcdEBiYWNrZ3JvdW5kQ29sb3IgPSBcInRyYW5zcGFyZW50XCJcblx0XHRAdXBkYXRlUGxhY2Vob2xkZXJDb2xvciBvcHRpb25zLnBsYWNlaG9sZGVyQ29sb3IgaWYgQHBsYWNlaG9sZGVyQ29sb3JcblxuXHRcdCNvbmx5IHNob3cgaG9ub3IgdmlydHVhbCBrZXlib2FyZCBvcHRpb24gd2hlbiBub3Qgb24gbW9iaWxlLFxuXHRcdCNvdGhlcndpc2UgaWdub3JlXG5cdFx0aWYgIVV0aWxzLmlzTW9iaWxlKCkgJiYgb3B0aW9ucy52aXJ0dWFsS2V5Ym9hcmQgaXMgdHJ1ZVxuXHRcdFx0QGlucHV0LmFkZEV2ZW50TGlzdGVuZXIgXCJmb2N1c1wiLCAtPlxuXHRcdFx0XHRleHBvcnRzLmtleWJvYXJkTGF5ZXIuYnJpbmdUb0Zyb250KClcblx0XHRcdFx0ZXhwb3J0cy5rZXlib2FyZExheWVyLnN0YXRlQ3ljbGUoKVxuXHRcdFx0QGlucHV0LmFkZEV2ZW50TGlzdGVuZXIgXCJibHVyXCIsIC0+XG5cdFx0XHRcdGV4cG9ydHMua2V5Ym9hcmRMYXllci5hbmltYXRlKFwiZGVmYXVsdFwiKVxuXG5cdHVwZGF0ZVBsYWNlaG9sZGVyQ29sb3I6IChjb2xvcikgLT5cblx0XHRAcGxhY2Vob2xkZXJDb2xvciA9IGNvbG9yXG5cdFx0aWYgQHBhZ2VTdHlsZT9cblx0XHRcdGRvY3VtZW50LmhlYWQucmVtb3ZlQ2hpbGQgQHBhZ2VTdHlsZVxuXHRcdEBwYWdlU3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50IFwic3R5bGVcIlxuXHRcdEBwYWdlU3R5bGUudHlwZSA9IFwidGV4dC9jc3NcIlxuXHRcdGNzcyA9IFwiIyN7QGlucHV0LmlkfTo6LXdlYmtpdC1pbnB1dC1wbGFjZWhvbGRlciB7IGNvbG9yOiAje0BwbGFjZWhvbGRlckNvbG9yfTsgfVwiXG5cdFx0QHBhZ2VTdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSBjc3MpXG5cdFx0ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZCBAcGFnZVN0eWxlXG5cblx0Zm9jdXM6ICgpIC0+XG5cdFx0QGlucHV0LmZvY3VzKClcblxuXHRvbkZvY3VzOiAoY2IpIC0+XG5cdFx0QGlucHV0LmFkZEV2ZW50TGlzdGVuZXIgXCJmb2N1c1wiLCAtPlxuXHRcdFx0Y2IuYXBwbHkoQClcblxuXHRvbkJsdXI6IChjYikgLT5cblx0XHRAaW5wdXQuYWRkRXZlbnRMaXN0ZW5lciBcImJsdXJcIiwgLT5cblx0XHRcdGNiLmFwcGx5KEApXG4iLCJjbGFzcyBDYW1lcmFMYXllciBleHRlbmRzIFZpZGVvTGF5ZXJcbiAgY29uc3RydWN0b3I6IChvcHRpb25zID0ge30pIC0+XG4gICAgY3VzdG9tUHJvcHMgPVxuICAgICAgZmFjaW5nOiB0cnVlXG4gICAgICBmbGlwcGVkOiB0cnVlXG4gICAgICBhdXRvRmxpcDogdHJ1ZVxuICAgICAgcmVzb2x1dGlvbjogdHJ1ZVxuICAgICAgZml0OiB0cnVlXG5cbiAgICBiYXNlT3B0aW9ucyA9IE9iamVjdC5rZXlzKG9wdGlvbnMpXG4gICAgICAuZmlsdGVyIChrZXkpIC0+ICFjdXN0b21Qcm9wc1trZXldXG4gICAgICAucmVkdWNlIChjbG9uZSwga2V5KSAtPlxuICAgICAgICBjbG9uZVtrZXldID0gb3B0aW9uc1trZXldXG4gICAgICAgIGNsb25lXG4gICAgICAsIHt9XG5cbiAgICBzdXBlcihiYXNlT3B0aW9ucylcblxuICAgIEBfZmFjaW5nID0gb3B0aW9ucy5mYWNpbmcgPyAnYmFjaydcbiAgICBAX2ZsaXBwZWQgPSBvcHRpb25zLmZsaXBwZWQgPyBmYWxzZVxuICAgIEBfYXV0b0ZsaXAgPSBvcHRpb25zLmF1dG9GbGlwID8gdHJ1ZVxuICAgIEBfcmVzb2x1dGlvbiA9IG9wdGlvbnMucmVzb2x1dGlvbiA/IDQ4MFxuXG4gICAgQF9zdGFydGVkID0gZmFsc2VcbiAgICBAX2RldmljZSA9IG51bGxcbiAgICBAX21hdGNoZWRGYWNpbmcgPSAndW5rbm93bidcbiAgICBAX3N0cmVhbSA9IG51bGxcbiAgICBAX3NjaGVkdWxlZFJlc3RhcnQgPSBudWxsXG4gICAgQF9yZWNvcmRpbmcgPSBudWxsXG5cbiAgICBAYmFja2dyb3VuZENvbG9yID0gJ3RyYW5zcGFyZW50J1xuICAgIEBjbGlwID0gdHJ1ZVxuXG4gICAgQHBsYXllci5zcmMgPSAnJ1xuICAgIEBwbGF5ZXIuYXV0b3BsYXkgPSB0cnVlXG4gICAgQHBsYXllci5tdXRlZCA9IHRydWVcbiAgICBAcGxheWVyLnN0eWxlLm9iamVjdEZpdCA9IG9wdGlvbnMuZml0ID8gJ2NvdmVyJ1xuXG4gIEBkZWZpbmUgJ2ZhY2luZycsXG4gICAgZ2V0OiAtPiBAX2ZhY2luZ1xuICAgIHNldDogKGZhY2luZykgLT5cbiAgICAgIEBfZmFjaW5nID0gaWYgZmFjaW5nID09ICdmcm9udCcgdGhlbiBmYWNpbmcgZWxzZSAnYmFjaydcbiAgICAgIEBfc2V0UmVzdGFydCgpXG5cbiAgQGRlZmluZSAnZmxpcHBlZCcsXG4gICAgZ2V0OiAtPiBAX2ZsaXBwZWRcbiAgICBzZXQ6IChmbGlwcGVkKSAtPlxuICAgICAgQF9mbGlwcGVkID0gZmxpcHBlZFxuICAgICAgQF9zZXRSZXN0YXJ0KClcblxuICBAZGVmaW5lICdhdXRvRmxpcCcsXG4gICAgZ2V0OiAtPiBAX2F1dG9GbGlwXG4gICAgc2V0OiAoYXV0b0ZsaXApIC0+XG4gICAgICBAX2F1dG9GbGlwID0gYXV0b0ZsaXBcbiAgICAgIEBfc2V0UmVzdGFydCgpXG5cbiAgQGRlZmluZSAncmVzb2x1dGlvbicsXG4gICAgZ2V0OiAtPiBAX3Jlc29sdXRpb25cbiAgICBzZXQ6IChyZXNvbHV0aW9uKSAtPlxuICAgICAgQF9yZXNvbHV0aW9uID0gcmVzb2x1dGlvblxuICAgICAgQF9zZXRSZXN0YXJ0KClcblxuICBAZGVmaW5lICdmaXQnLFxuICAgIGdldDogLT4gQHBsYXllci5zdHlsZS5vYmplY3RGaXRcbiAgICBzZXQ6IChmaXQpIC0+IEBwbGF5ZXIuc3R5bGUub2JqZWN0Rml0ID0gZml0XG5cbiAgQGRlZmluZSAnaXNSZWNvcmRpbmcnLFxuICAgIGdldDogLT4gQF9yZWNvcmRpbmc/LnJlY29yZGVyLnN0YXRlID09ICdyZWNvcmRpbmcnXG5cbiAgdG9nZ2xlRmFjaW5nOiAtPlxuICAgIEBfZmFjaW5nID0gaWYgQF9mYWNpbmcgPT0gJ2Zyb250JyB0aGVuICdiYWNrJyBlbHNlICdmcm9udCdcbiAgICBAX3NldFJlc3RhcnQoKVxuXG4gIGNhcHR1cmU6ICh3aWR0aCA9IEB3aWR0aCwgaGVpZ2h0ID0gQGhlaWdodCwgcmF0aW8gPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbykgLT5cbiAgICBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpXG4gICAgY2FudmFzLndpZHRoID0gcmF0aW8gKiB3aWR0aFxuICAgIGNhbnZhcy5oZWlnaHQgPSByYXRpbyAqIGhlaWdodFxuXG4gICAgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIilcbiAgICBAZHJhdyhjb250ZXh0KVxuXG4gICAgdXJsID0gY2FudmFzLnRvRGF0YVVSTCgpXG4gICAgQGVtaXQoJ2NhcHR1cmUnLCB1cmwpXG5cbiAgICB1cmxcblxuICBkcmF3OiAoY29udGV4dCkgLT5cbiAgICByZXR1cm4gdW5sZXNzIGNvbnRleHRcblxuICAgIGNvdmVyID0gKHNyY1csIHNyY0gsIGRzdFcsIGRzdEgpIC0+XG4gICAgICBzY2FsZVggPSBkc3RXIC8gc3JjV1xuICAgICAgc2NhbGVZID0gZHN0SCAvIHNyY0hcbiAgICAgIHNjYWxlID0gaWYgc2NhbGVYID4gc2NhbGVZIHRoZW4gc2NhbGVYIGVsc2Ugc2NhbGVZXG4gICAgICB3aWR0aDogc3JjVyAqIHNjYWxlLCBoZWlnaHQ6IHNyY0ggKiBzY2FsZVxuXG4gICAge3ZpZGVvV2lkdGgsIHZpZGVvSGVpZ2h0fSA9IEBwbGF5ZXJcblxuICAgIGNsaXBCb3ggPSB3aWR0aDogY29udGV4dC5jYW52YXMud2lkdGgsIGhlaWdodDogY29udGV4dC5jYW52YXMuaGVpZ2h0XG4gICAgbGF5ZXJCb3ggPSBjb3ZlcihAd2lkdGgsIEBoZWlnaHQsIGNsaXBCb3gud2lkdGgsIGNsaXBCb3guaGVpZ2h0KVxuICAgIHZpZGVvQm94ID0gY292ZXIodmlkZW9XaWR0aCwgdmlkZW9IZWlnaHQsIGxheWVyQm94LndpZHRoLCBsYXllckJveC5oZWlnaHQpXG5cbiAgICB4ID0gKGNsaXBCb3gud2lkdGggLSB2aWRlb0JveC53aWR0aCkgLyAyXG4gICAgeSA9IChjbGlwQm94LmhlaWdodCAtIHZpZGVvQm94LmhlaWdodCkgLyAyXG5cbiAgICBjb250ZXh0LmRyYXdJbWFnZShAcGxheWVyLCB4LCB5LCB2aWRlb0JveC53aWR0aCwgdmlkZW9Cb3guaGVpZ2h0KVxuXG4gIHN0YXJ0OiAtPlxuICAgIEBfZW51bWVyYXRlRGV2aWNlcygpXG4gICAgLnRoZW4gKGRldmljZXMpID0+XG4gICAgICBkZXZpY2VzID0gZGV2aWNlcy5maWx0ZXIgKGRldmljZSkgLT4gZGV2aWNlLmtpbmQgPT0gJ3ZpZGVvaW5wdXQnXG5cbiAgICAgIGZvciBkZXZpY2UgaW4gZGV2aWNlc1xuICAgICAgICBpZiBkZXZpY2UubGFiZWwuaW5kZXhPZihAX2ZhY2luZykgIT0gLTFcbiAgICAgICAgICBAX21hdGNoZWRGYWNpbmcgPSBAX2ZhY2luZ1xuICAgICAgICAgIHJldHVybiBkZXZpY2VcblxuICAgICAgQF9tYXRjaGVkRmFjaW5nID0gJ3Vua25vd24nXG5cbiAgICAgIGlmIGRldmljZXMubGVuZ3RoID4gMCB0aGVuIGRldmljZXNbMF0gZWxzZSBQcm9taXNlLnJlamVjdCgpXG5cbiAgICAudGhlbiAoZGV2aWNlKSA9PlxuICAgICAgcmV0dXJuIGlmICFkZXZpY2UgfHwgZGV2aWNlLmRldmljZUlkID09IEBfZGV2aWNlPy5kZXZpY2VJZFxuXG4gICAgICBAc3RvcCgpXG4gICAgICBAX2RldmljZSA9IGRldmljZVxuXG4gICAgICBjb25zdHJhaW50cyA9XG4gICAgICAgIHZpZGVvOlxuICAgICAgICAgIG1hbmRhdG9yeToge21pbldpZHRoOiBAX3Jlc29sdXRpb24sIG1pbkhlaWdodDogQF9yZXNvbHV0aW9ufVxuICAgICAgICAgIG9wdGlvbmFsOiBbe3NvdXJjZUlkOiBAX2RldmljZS5kZXZpY2VJZH1dXG4gICAgICAgIGF1ZGlvOlxuICAgICAgICAgIHRydWVcblxuICAgICAgQF9nZXRVc2VyTWVkaWEoY29uc3RyYWludHMpXG5cbiAgICAudGhlbiAoc3RyZWFtKSA9PlxuICAgICAgQHBsYXllci5zcmMgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKHN0cmVhbSlcbiAgICAgIEBfc3RhcnRlZCA9IHRydWVcbiAgICAgIEBfc3RyZWFtID0gc3RyZWFtXG4gICAgICBAX2ZsaXAoKVxuXG4gICAgLmNhdGNoIChlcnJvcikgLT5cbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpXG5cbiAgc3RvcDogLT5cbiAgICBAX3N0YXJ0ZWQgPSBmYWxzZVxuXG4gICAgQHBsYXllci5wYXVzZSgpXG4gICAgQHBsYXllci5zcmMgPSAnJ1xuXG4gICAgQF9zdHJlYW0/LmdldFRyYWNrcygpLmZvckVhY2ggKHRyYWNrKSAtPiB0cmFjay5zdG9wKClcbiAgICBAX3N0cmVhbSA9IG51bGxcbiAgICBAX2RldmljZSA9IG51bGxcblxuICAgIGlmIEBfc2NoZWR1bGVkUmVzdGFydFxuICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUoQF9zY2hlZHVsZWRSZXN0YXJ0KVxuICAgICAgQF9zY2hlZHVsZWRSZXN0YXJ0ID0gbnVsbFxuXG4gIHN0YXJ0UmVjb3JkaW5nOiAtPlxuICAgIGlmIEBfcmVjb3JkaW5nXG4gICAgICBAX3JlY29yZGluZy5yZWNvcmRlci5zdG9wKClcbiAgICAgIEBfcmVjb3JkaW5nID0gbnVsbFxuXG4gICAgY2h1bmtzID0gW11cblxuICAgIHJlY29yZGVyID0gbmV3IE1lZGlhUmVjb3JkZXIoQF9zdHJlYW0sIHttaW1lVHlwZTogJ3ZpZGVvL3dlYm0nfSlcbiAgICByZWNvcmRlci5hZGRFdmVudExpc3RlbmVyICdzdGFydCcsIChldmVudCkgPT4gQGVtaXQoJ3N0YXJ0cmVjb3JkaW5nJylcbiAgICByZWNvcmRlci5hZGRFdmVudExpc3RlbmVyICdkYXRhYXZhaWxhYmxlJywgKGV2ZW50KSAtPiBjaHVua3MucHVzaChldmVudC5kYXRhKVxuICAgIHJlY29yZGVyLmFkZEV2ZW50TGlzdGVuZXIgJ3N0b3AnLCAoZXZlbnQpID0+XG4gICAgICBibG9iID0gbmV3IEJsb2IoY2h1bmtzKVxuICAgICAgdXJsID0gd2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYilcbiAgICAgIEBlbWl0KCdzdG9wcmVjb3JkaW5nJylcbiAgICAgIEBlbWl0KCdyZWNvcmQnLCB1cmwpXG5cbiAgICByZWNvcmRlci5zdGFydCgpXG5cbiAgICBAX3JlY29yZGluZyA9IHtyZWNvcmRlciwgY2h1bmtzfVxuXG4gIHN0b3BSZWNvcmRpbmc6IC0+XG4gICAgcmV0dXJuIGlmICFAX3JlY29yZGluZ1xuICAgIEBfcmVjb3JkaW5nLnJlY29yZGVyLnN0b3AoKVxuICAgIEBfcmVjb3JkaW5nID0gbnVsbFxuXG4gIG9uQ2FwdHVyZTogKGNhbGxiYWNrKSAtPiBAb24oJ2NhcHR1cmUnLCBjYWxsYmFjaylcbiAgb25TdGFydFJlY29yZGluZzogKGNhbGxiYWNrKSAtPiBAb24oJ3N0YXJ0cmVjb3JkaW5nJywgY2FsbGJhY2spXG4gIG9uU3RvcFJlY29yZGluZzogKGNhbGxiYWNrKSAtPiBAb24oJ3N0b3ByZWNvcmRpbmcnLCBjYWxsYmFjaylcbiAgb25SZWNvcmQ6IChjYWxsYmFjaykgLT4gQG9uKCdyZWNvcmQnLCBjYWxsYmFjaylcblxuICBfc2V0UmVzdGFydDogLT5cbiAgICByZXR1cm4gaWYgIUBfc3RhcnRlZCB8fCBAX3NjaGVkdWxlZFJlc3RhcnRcblxuICAgIEBfc2NoZWR1bGVkUmVzdGFydCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSA9PlxuICAgICAgQF9zY2hlZHVsZWRSZXN0YXJ0ID0gbnVsbFxuICAgICAgQHN0YXJ0KClcblxuICBfZmxpcDogLT5cbiAgICBAX2ZsaXBwZWQgPSBAX21hdGNoZWRGYWNpbmcgPT0gJ2Zyb250JyBpZiBAX2F1dG9GbGlwXG4gICAgeCA9IGlmIEBfZmxpcHBlZCB0aGVuIC0xIGVsc2UgMVxuICAgIEBwbGF5ZXIuc3R5bGUud2Via2l0VHJhbnNmb3JtID0gXCJzY2FsZSgje3h9LCAxKVwiXG5cbiAgX2VudW1lcmF0ZURldmljZXM6IC0+XG4gICAgdHJ5XG4gICAgICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmVudW1lcmF0ZURldmljZXMoKVxuICAgIGNhdGNoXG4gICAgICBQcm9taXNlLnJlamVjdCgpXG5cbiAgX2dldFVzZXJNZWRpYTogKGNvbnN0cmFpbnRzKSAtPlxuICAgIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgICB0cnlcbiAgICAgICAgZ3VtID0gbmF2aWdhdG9yLmdldFVzZXJNZWRpYSB8fCBuYXZpZ2F0b3Iud2Via2l0R2V0VXNlck1lZGlhXG4gICAgICAgIGd1bS5jYWxsKG5hdmlnYXRvciwgY29uc3RyYWludHMsIHJlc29sdmUsIHJlamVjdClcbiAgICAgIGNhdGNoXG4gICAgICAgIHJlamVjdCgpXG5cbm1vZHVsZS5leHBvcnRzID0gQ2FtZXJhTGF5ZXIgaWYgbW9kdWxlP1xuRnJhbWVyLkNhbWVyYUxheWVyID0gQ2FtZXJhTGF5ZXJcbiIsIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBR0FBO0FEQUEsSUFBQSxXQUFBO0VBQUE7OztBQUFNOzs7RUFDUyxxQkFBQyxPQUFEO0FBQ1gsUUFBQTs7TUFEWSxVQUFVOztJQUN0QixXQUFBLEdBQ0U7TUFBQSxNQUFBLEVBQVEsSUFBUjtNQUNBLE9BQUEsRUFBUyxJQURUO01BRUEsUUFBQSxFQUFVLElBRlY7TUFHQSxVQUFBLEVBQVksSUFIWjtNQUlBLEdBQUEsRUFBSyxJQUpM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
