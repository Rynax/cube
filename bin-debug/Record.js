var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Cube;
(function (Cube) {
    var Record = (function (_super) {
        __extends(Record, _super);
        function Record() {
            var _this = _super.call(this) || this;
            _this.skinName = "recordSkin";
            _this.horizontalCenter = "0";
            _this.submit.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.send_record, _this);
            return _this;
        }
        Record.prototype.send_record = function () {
            this.submit.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.send_record, this);
            this.submit.touchEnabled = false;
            this.submit.alpha = 0;
            this.nick.touchEnabled = false;
            this.nick.textDisplay.touchEnabled = false;
            this.desc.touchEnabled = false;
            this.desc.width = 460;
            this.desc.textDisplay.touchEnabled = false;
            var record = "data={\"n\":" + this.nick.text + "," + "\"l\":" + this.level.text + "," + "\"s\":" + this.score.text + "," + "\"d\":" + this.desc.text + "}";
            var request = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.TEXT;
            request.open("put.do", egret.HttpMethod.POST);
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            request.send(record);
        };
        return Record;
    }(eui.Component));
    Cube.Record = Record;
    __reflect(Record.prototype, "Cube.Record", ["eui.UIComponent", "egret.DisplayObject"]);
})(Cube || (Cube = {}));
//# sourceMappingURL=Record.js.map