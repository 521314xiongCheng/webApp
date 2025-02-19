"use strict";

exports.__esModule = true;
exports.default = void 0;

require('vant/lib/circle/index.css')
var _utils = require("vant/lib/utils");

var _raf = require("vant/lib/utils/dom/raf");

var _constant = require("vant/lib/utils/constant");

var _createNamespace = (0, _utils.createNamespace)('circle'),
    createComponent = _createNamespace[0],
    bem = _createNamespace[1];

var uid = 0;

function format(rate) {
  return Math.min(Math.max(rate, 0), 100);
}

function getPath(clockwise, viewBoxSize, viewBoxBaseWidth, strokeWidth) {
  var bgWidth = viewBoxBaseWidth/2
  var sweepFlag = clockwise ? 1 : 0;
  return "M " + viewBoxSize / 2 + " " + viewBoxSize / 2 + " m 0, -" + bgWidth + " a " + bgWidth + ", " + bgWidth + " 0 1, " + sweepFlag + " 0, " + bgWidth*2 + " a " + bgWidth + ", " + bgWidth + " 0 1, " + sweepFlag + " 0, -" + bgWidth*2 + "";
}

function getBgPath(clockwise, viewBoxSize, viewBoxBaseWidth, strokeWidth) {
  var bgWidth = viewBoxBaseWidth/2 - strokeWidth/2
  var sweepFlag = clockwise ? 1 : 0;
  return "M " + viewBoxSize / 2 + " " + viewBoxSize / 2 + " m 0, -" + bgWidth + " a " + bgWidth + ", " + bgWidth + " 0 1, " + sweepFlag + " 0, " + bgWidth*2 + " a " + bgWidth + ", " + bgWidth + " 0 1, " + sweepFlag + " 0, -" + bgWidth*2 + "";
}

var _default = createComponent({
  data: function() {
    return {
      viewBoxBaseWidth: 800
    }
  },
  props: {
    text: String,
    strokeLinecap: String,
    value: {
      type: Number,
      default: 0
    },
    speed: {
      type: [Number, String],
      default: 0
    },
    size: {
      type: [Number, String],
      default: 100
    },
    fill: {
      type: String,
      default: 'none'
    },
    rate: {
      type: [Number, String],
      default: 100
    },
    layerColor: {
      type: String,
      default: _constant.WHITE
    },
    color: {
      type: [String, Object],
      default: _constant.BLUE
    },
    strokeWidth: {
      type: [Number, String],
      default: 40
    },
    clockwise: {
      type: Boolean,
      default: true
    }
  },
  beforeCreate: function beforeCreate() {
    this.uid = "van-circle-gradient-" + uid++;
  },
  computed: {
    style: function style() {
      var size = (0, _utils.addUnit)(this.size);
      return {
        width: size,
        height: size
      };
    },
    bgPath: function bgPath() {
      return getBgPath(this.clockwise, this.viewBoxSize, this.viewBoxBaseWidth, this.strokeWidth);
    },
    path: function path() {
      return getPath(this.clockwise, this.viewBoxSize, this.viewBoxBaseWidth, this.strokeWidth);
    },
    viewBoxSize: function viewBoxSize() {
      return +this.strokeWidth + this.viewBoxBaseWidth;
    },
    layerStyle: function layerStyle() {
      var PERIMETER = this.viewBoxBaseWidth * Math.PI
      PERIMETER = PERIMETER.toFixed(0)
      var offset = PERIMETER * this.value / 100;
      return {
        stroke: "" + this.color,
        strokeWidth: +this.strokeWidth + 1 + "px",
        strokeLinecap: this.strokeLinecap,
        strokeDasharray: offset + "px " + PERIMETER + "px"
      };
    },
    hoverStyle: function hoverStyle() {
      return {
        fill: "" + this.fill,
        stroke: "" + this.layerColor,
        strokeWidth: this.strokeWidth*2 + "px"
      };
    },
    gradient: function gradient() {
      return (0, _utils.isObject)(this.color);
    },
    LinearGradient: function LinearGradient() {
      var _this = this;

      var h = this.$createElement;

      if (!this.gradient) {
        return;
      }

      var Stops = Object.keys(this.color).sort(function (a, b) {
        return parseFloat(a) - parseFloat(b);
      }).map(function (key, index) {
        return h("stop", {
          "key": index,
          "attrs": {
            "offset": key,
            "stop-color": _this.color[key]
          }
        });
      });
      return h("defs", [h("linearGradient", {
        "attrs": {
          "id": this.uid,
          "x1": "100%",
          "y1": "0%",
          "x2": "0%",
          "y2": "0%"
        }
      }, [Stops])]);
    }
  },
  watch: {
    rate: {
      handler: function handler(rate) {
        this.startTime = Date.now();
        this.startRate = this.value;
        this.endRate = format(rate);
        this.increase = this.endRate > this.startRate;
        this.duration = Math.abs((this.startRate - this.endRate) * 1000 / this.speed);

        if (this.speed) {
          (0, _raf.cancelRaf)(this.rafId);
          this.rafId = (0, _raf.raf)(this.animate);
        } else {
          this.$emit('input', this.endRate);
        }
      },
      immediate: true
    }
  },
  methods: {
    animate: function animate() {
      var now = Date.now();
      var progress = Math.min((now - this.startTime) / this.duration, 1);
      var rate = progress * (this.endRate - this.startRate) + this.startRate;
      this.$emit('input', format(parseFloat(rate.toFixed(1))));

      if (this.increase ? rate < this.endRate : rate > this.endRate) {
        this.rafId = (0, _raf.raf)(this.animate);
      }
    }
  },
  render: function render() {
    var h = arguments[0];
    return h("div", {
      "class": bem(),
      "style": this.style
    }, [h("svg", {
      "attrs": {
        "viewBox": "0 0 " + this.viewBoxSize + " " + this.viewBoxSize,
      }
    }, [this.LinearGradient, h("path", {
      "class": bem('hover'),
      "style": this.hoverStyle,
      "attrs": {
        "d": this.bgPath
      }
    }), h("path", {
      "attrs": {
        "d": this.path,
        "stroke": this.gradient ? "url(#" + this.uid + ")" : this.color
      },
      "class": bem('layer'),
      "style": this.layerStyle
    })]), this.slots() || this.text && h("div", {
      "class": bem('text')
    }, [this.text])]);
  }
});

exports.default = _default;