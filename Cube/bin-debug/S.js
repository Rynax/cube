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
    var S = (function (_super) {
        __extends(S, _super);
        function S(d) {
            var _this = _super.call(this) || this;
            //图案格子位置标记, x表示格子横向编号, y表示格子纵向编号
            _this.d = null;
            //图案尺寸, [0]所占格子数, [1]大尺寸, [2]小尺寸(source或target)
            _this.size = [new egret.Point(), new egret.Point(), new egret.Point()];
            _this.g = new eui.Group();
            _this.c = [];
            _this.d = d;
            _this.g.percentWidth = 100;
            _this.g.percentHeight = 100;
            _this.g.top = 0;
            _this.g.left = 0;
            _this.addChild(_this.g);
            for (var i = 1; i < _this.d.length; i++) {
                if (_this.size[0].x < _this.d[i].x) {
                    _this.size[0].x = _this.d[i].x;
                }
                if (_this.size[0].y < _this.d[i].y) {
                    _this.size[0].y = _this.d[i].y;
                }
            }
            _this.size[0].x++;
            _this.size[0].y++;
            _this.size[1].x = _this.size[0].x * Cube.GlobalArg.bsize.x;
            _this.size[1].y = _this.size[0].y * Cube.GlobalArg.bsize.y;
            _this.size[2].x = _this.size[0].x * Cube.GlobalArg.ssize.x;
            _this.size[2].y = _this.size[0].y * Cube.GlobalArg.ssize.y;
            for (var i = 0; i < _this.d.length - 1; i++) {
                _this.c[i] = new Cube.ResCube();
                _this.c[i].skinName = "ResCubeSkin";
                _this.c[i].currentState = "base";
                _this.c[i].percentWidth = 100 / _this.size[0].x;
                _this.c[i].percentHeight = 100 / _this.size[0].y;
                _this.c[i].left = (_this.c[i].percentWidth * _this.d[i + 1].x) + "%";
                _this.c[i].top = (_this.c[i].percentHeight * _this.d[i + 1].y) + "%";
                _this.c[i].touchEnabled = false;
                _this.g.addChild(_this.c[i]);
            }
            _this.horizontalCenter = 0;
            _this.verticalCenter = 0;
            _this.touchEnabled = false;
            _this.s_size();
            return _this;
        }
        S.prototype.b_size = function () {
            this.width = this.size[1].x;
            this.height = this.size[1].y;
        };
        S.prototype.s_size = function () {
            this.width = this.size[2].x;
            this.height = this.size[2].y;
        };
        S.prototype.restore_b_field = function (cb) {
            for (var i = cb.length - 1; i >= 0; i--) {
                cb[i].currentState = "empty";
                cb.splice(i, 1);
            }
        };
        S.prototype.match_b_field = function (b, i, j, cb, f) {
            if (cb != null && cb.length > 0) {
                if (cb.length != this.d.length - 1) {
                    this.restore_b_field(cb);
                }
                else {
                    for (var t = 0; t < this.d.length - 1; t++) {
                        if (cb[t] != b[i + this.d[t + 1].y][j + this.d[t + 1].x]) {
                            this.restore_b_field(cb);
                            break;
                        }
                    }
                    if (cb.length > 0) {
                        return true;
                    }
                }
            }
            for (var t = 1; t < this.d.length; t++) {
                if (b[i + this.d[t].y][j + this.d[t].x].currentState != "empty") {
                    return false;
                }
            }
            if (f == 0) {
                return true;
            }
            for (var t = 0; t < this.d.length - 1; t++) {
                b[i + this.d[t + 1].y][j + this.d[t + 1].x].currentState = this.c[t].currentState;
                cb[t] = b[i + this.d[t + 1].y][j + this.d[t + 1].x];
            }
            return true;
        };
        S.prototype.random_color = function (level) {
            var num = 0;
            if (level <= 1)
                num = 2;
            else if (level <= 9)
                num = 2;
            else if (level <= 19)
                num = 3;
            else
                num = 4;
            for (var i = 0; i < this.d.length - 1; i++) {
                this.c[i].currentState = Cube.GlobalArg.color[Math.floor(Math.random() * num)];
            }
        };
        S.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
        };
        S.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
        };
        return S;
    }(eui.Component));
    Cube.S = S;
    __reflect(S.prototype, "Cube.S", ["eui.UIComponent", "egret.DisplayObject"]);
})(Cube || (Cube = {}));
//# sourceMappingURL=S.js.map