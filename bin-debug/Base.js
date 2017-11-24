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
///<reference path="ResCube.ts" />
var Cube;
(function (Cube) {
    var Base = (function (_super) {
        __extends(Base, _super);
        function Base() {
            var _this = _super.call(this) || this;
            _this.b = [];
            _this.shade_b = [];
            _this.clevel = 1;
            _this.cscore = 0;
            _this.mult = 1;
            _this.patsrc = [];
            _this.pattgt = [];
            _this.timer = new egret.Timer(300, 0);
            _this.plex1 = 0; //0允许重叠消除
            _this.plex2 = 0;
            _this.plex3 = 0;
            _this.plex4 = 0;
            //触摸开始时设置, 触摸点相对左上角的位移
            _this.rx = 0;
            _this.ry = 0;
            //触摸开始时设置, 触摸点相对于全局的位置
            _this.ax = 0;
            _this.ay = 0;
            //屏幕可点击区域
            _this.source = [null, null, null, null];
            _this.slx = [];
            _this.srx = [];
            _this.sty = [];
            _this.sby = [];
            //当前点击对象
            _this.cidx = 3;
            //当前匹配高亮块
            _this.cb = [];
            _this.record = null;
            _this.skinName = "BaseSkin";
            _this.percentWidth = 100;
            _this.percentHeight = 100;
            var i = 0;
            var j = 0;
            for (i = 0; i < 9; i++) {
                _this.b[i] = [];
                _this.shade_b[i] = [];
                for (j = 0; j < 9; j++) {
                    _this.b[i][j] = new Cube.ResCube();
                    _this.b[i][j].currentState = "empty";
                    _this.b[i][j].top = 4 * (i + 1) + 66 * i;
                    _this.b[i][j].left = 4 * (j + 1) + 66 * j;
                    _this.base.addChild(_this.b[i][j]);
                    _this.shade_b[i][j] = new Cube.ResCube();
                    _this.shade_b[i][j].currentState = "match";
                    _this.shade_b[i][j].alpha = 0;
                    _this.shade_b[i][j].top = 4 * (i + 1) + 66 * i;
                    _this.shade_b[i][j].left = 4 * (j + 1) + 66 * j;
                    _this.base.addChild(_this.shade_b[i][j]);
                }
            }
            for (i = 0; i < Cube.GlobalArg.patsrc.length; i++) {
                _this.patsrc[i] = new Cube.S(Cube.GlobalArg.patsrc[i]);
            }
            for (i = 0; i < Cube.GlobalArg.pattgt.length; i++) {
                _this.pattgt[i] = new Cube.T(Cube.GlobalArg.pattgt[i]);
            }
            _this.timer.addEventListener(egret.TimerEvent.TIMER, _this.erase_b_field_timer, _this);
            _this.timer.stop();
            _this.touch_on();
            return _this;
        }
        Base.prototype.show_top = function () {
            this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touch_begin, this);
            this.get_score();
            this.top_shade.alpha = 0.5;
            this.top_bg.alpha = 0.9;
            this.top_head.alpha = 1;
            this.top_msg.alpha = 1;
            this.top_list.alpha = 1;
            this.top_button.currentState = "up";
            this.top_button.label = "重新开始";
            this.top_button.alpha = 1;
            this.top_button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.restart, this);
        };
        Base.prototype.get_score = function () {
            var request = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.TEXT;
            request.open("top.do", egret.HttpMethod.POST);
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            request.send();
            request.addEventListener(egret.Event.COMPLETE, this.onPostComplete, this);
            request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onPostIOError, this);
            request.addEventListener(egret.ProgressEvent.PROGRESS, this.onPostProgress, this);
        };
        Base.prototype.onPostComplete = function (event) {
            var request = event.currentTarget;
            //var str = `{"code":"0","data":[{"r":1,"s":35576,"l":313,"n":"sdfsd"},{"r":2,"s":23423,"l":312,"n":"fsef"},{"r":3,"s":12332,"l":12,"n":"qwe"},{"r":4,"s":3231,"l":1231,"n":"ers"},{"r":5,"s":567,"l":123,"n":"fsdf"},{"r":6,"s":231,"l":32,"n":"sf"},{"r":7,"s":213,"d":"asdf","l":11,"n":"abcde"}],"desc":""}`;
            //var json = JSON.parse(str);
            var json = JSON.parse(request.response);
            if (json.code != "0") {
                this.top_msg.text = json.desc;
                return;
            }
            var r = 0;
            if (json.data.length >= 10) {
                var lastone = json.data[json.data.length - 1].s;
                if (this.cscore < lastone / 100) {
                    this.top_msg.text = "您的排名, 深不见底......";
                    return;
                }
                if (this.cscore <= lastone) {
                    this.top_msg.text = "差一点就能上榜了, 加油啊!";
                    return;
                }
                r = json.data.length - 1;
            }
            else {
                r = json.data.length;
            }
            this.top_msg.text = "大神! 恭喜上榜! 快留个言BS一下下面那些智商欠费的渣渣!";
            var collection = new eui.ArrayCollection();
            this.record = new Cube.Record();
            for (var i = 0; i < json.data.length; i++) {
                if (this.cscore > json.data[i].s) {
                    r = i;
                    break;
                }
            }
            for (var i = 0; i < r; i++) {
                collection.addItem({ "rank": json.data[i].r, "name": json.data[i].n, "level": json.data[i].l, "score": json.data[i].s, "desc": json.data[i].d });
            }
            if (r != 0 && this.cscore == json.data[r - 1].s) {
                this.record.rank.text = json.data[r - 1].r;
            }
            else {
                this.record.rank.text = (r + 1).toString();
            }
            this.record.level.text = this.level.text;
            this.record.score.text = this.score.text;
            this.record.top = 110 + 70 * r;
            this.top_group.addChild(this.record);
            collection.addItem({ "rank": "", "name": "", "level": "", "score": "", "desc": "" });
            for (var i = r; i < json.data.length - 1 - r; i++) {
                collection.addItem({ "rank": (json.data[i].r + 1), "name": json.data[i].n, "level": json.data[i].l, "score": json.data[i].s, "desc": json.data[i].d });
            }
            this.top_list.dataProvider = collection;
            return;
        };
        Base.prototype.onPostIOError = function (event) {
            this.top_msg.text = "连接服务器失败!";
        };
        Base.prototype.onPostProgress = function (event) {
            this.top_msg.text = "连接服务器: " + Math.floor(100 * event.bytesLoaded / event.bytesTotal) + "%";
        };
        Base.prototype.restart = function () {
            location.reload();
        };
        Base.prototype.dp_new = function (text) {
            var dp = new eui.BitmapLabel();
            dp.font = RES.getRes("cube_font_fnt");
            dp.width = 600;
            dp.height = 80;
            dp.scaleX = 0.3;
            dp.scaleY = 0.3;
            dp.textAlign = "center";
            this.base.addChild(dp);
            dp.x = 0;
            dp.y = 0;
            dp.horizontalCenter = 120;
            dp.verticalCenter = 0;
            dp.text = text;
            egret.Tween.get(dp).to({ scaleX: 1, scaleY: 1, verticalCenter: -200 }, 500, egret.Ease.sineIn).to({ verticalCenter: -300, alpha: 0 }, 500, egret.Ease.sineIn).call(this.dp_del, dp);
        };
        Base.prototype.dp_del = function () {
            this.parent.removeChild(this);
        };
        Base.prototype.set_source_field_once = function (s, i) {
            this.slx[i] = s.localToGlobal().x;
            this.srx[i] = s.localToGlobal().x + s.width;
            this.sty[i] = s.localToGlobal().y;
            this.sby[i] = s.localToGlobal().y + s.height;
        };
        Base.prototype.set_source_field = function () {
            if (this.source1.numChildren > 0) {
                this.source[0] = this.source1.getChildAt(0);
                this.set_source_field_once(this.source[0], 0);
            }
            if (this.source2.numChildren > 0) {
                this.source[1] = this.source2.getChildAt(0);
                this.set_source_field_once(this.source[1], 1);
            }
            if (this.source3.numChildren > 0) {
                this.source[2] = this.source3.getChildAt(0);
                this.set_source_field_once(this.source[2], 2);
            }
        };
        Base.prototype.release_source = function (i) {
            switch (i) {
                case 0:
                    this.source1.removeChild(this.source[i]);
                    break;
                case 1:
                    this.source2.removeChild(this.source[i]);
                    break;
                case 2:
                    this.source3.removeChild(this.source[i]);
                    break;
                default:
                    return;
            }
            this.source[i].includeInLayout = false;
            this.source[i].b_size();
            this.addChild(this.source[i]);
        };
        Base.prototype.insert_source = function (i) {
            this.removeChild(this.source[i]);
            this.source[i].includeInLayout = true;
            this.source[i].s_size();
            switch (i) {
                case 0:
                    this.source1.addChild(this.source[i]);
                    break;
                case 1:
                    this.source2.addChild(this.source[i]);
                    break;
                case 2:
                    this.source3.addChild(this.source[i]);
                    break;
                default:
                    return;
            }
        };
        Base.prototype.erase_b_field_once = function (s, p) {
            for (var t = 0; t < 4; t++) {
                for (var i = 0; i < 9 - s.size[0].y + 1; i++) {
                    for (var j = 0; j < 9 - s.size[0].x + 1; j++) {
                        if (s.match_b_field(this.b, i, j, this.shade_b, p, Cube.GlobalArg.color[t]) == true) {
                            this.dp_new((Math.floor((Math.pow(1.3, this.clevel) * (s.d[0].y + this.clevel)) * this.mult)).toString());
                            this.cscore += Math.floor((Math.pow(1.3, this.clevel) * (s.d[0].y + this.clevel)) * this.mult);
                            this.score.text = this.cscore.toString();
                            var tl = 0;
                            for (tl = 0; tl < Cube.GlobalArg.level_score.length; tl++) {
                                if (Cube.GlobalArg.level_score[tl] > this.cscore) {
                                    break;
                                }
                            }
                            if (this.clevel < tl) {
                                this.clevel = tl;
                                egret.Tween.get(this.level).to({ text: this.clevel.toString(), scaleX: 1, scaleY: 1 }, 50, egret.Ease.sineIn).to({ scaleX: 0.43, scaleY: 0.43 }, 300, egret.Ease.sineIn);
                            }
                            this.mult++;
                            return true;
                        }
                    }
                }
            }
            return false;
        };
        Base.prototype.erase_b_field_timer = function () {
            if (this.target1.numChildren > 0) {
                if (this.erase_b_field_once(this.target1.getChildAt(0), this.plex1) == true) {
                    this.plex1++;
                    return;
                }
                if (this.plex1 > 0) {
                    this.plex1 = 0;
                    this.target1.removeChildren();
                }
            }
            if (this.target2.numChildren > 0) {
                if (this.erase_b_field_once(this.target2.getChildAt(0), this.plex2) == true) {
                    this.plex2++;
                    return;
                }
                if (this.plex2 > 0) {
                    this.plex2 = 0;
                    this.target2.removeChildren();
                }
            }
            if (this.target3.numChildren > 0) {
                if (this.erase_b_field_once(this.target3.getChildAt(0), this.plex3) == true) {
                    this.plex3++;
                    return;
                }
                if (this.plex3 > 0) {
                    this.plex3 = 0;
                    this.target3.removeChildren();
                }
            }
            if (this.target4.numChildren > 0) {
                if (this.erase_b_field_once(this.target4.getChildAt(0), this.plex4) == true) {
                    this.plex4++;
                    return;
                }
                if (this.plex4 > 0) {
                    this.plex4 = 0;
                    this.target4.removeChildren();
                }
            }
            if (this.target1.numChildren == 0 ||
                this.target2.numChildren == 0 ||
                this.target3.numChildren == 0 ||
                this.target4.numChildren == 0) {
                this.set_target();
                this.clean_b_field();
                return;
            }
            this.timer.stop();
            this.mult = 1;
            this.clean_b_field();
            this.set_source();
            if (this.check_b_field() == false) {
                this.show_top();
                return;
            }
            this.touchEnabled = true;
        };
        Base.prototype.erase_b_field = function () {
            this.timer.start();
        };
        Base.prototype.check_source_field = function (x, y) {
            for (var i = 0; i < 3; i++) {
                if (this.source[i] != null && x >= this.slx[i] && x <= this.srx[i] && y >= this.sty[i] && y <= this.sby[i]) {
                    this.cidx = i;
                    this.release_source(i);
                    this.rx = Math.floor((this.ax - this.slx[i]) * this.source[i].size[1].x / this.source[i].size[2].x);
                    this.ry = Math.floor((this.ay - this.sty[i]) * this.source[i].size[1].y / this.source[i].size[2].y);
                    this.source[i].x = this.ax - this.rx;
                    this.source[i].y = this.ay - this.ry;
                    this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touch_move, this);
                    this.addEventListener(egret.TouchEvent.TOUCH_END, this.touch_end, this);
                }
            }
        };
        Base.prototype.check_b_field_once = function (s) {
            for (var i = 0; i < 9 - s.size[0].y + 1; i++) {
                for (var j = 0; j < 9 - s.size[0].x + 1; j++) {
                    if (s.match_b_field(this.b, i, j, null, 0)) {
                        return true;
                    }
                }
            }
            return false;
        };
        Base.prototype.check_b_field = function () {
            if (this.source1.numChildren > 0) {
                if (this.check_b_field_once(this.source1.getChildAt(0)) == true) {
                    return true;
                }
            }
            if (this.source2.numChildren > 0) {
                if (this.check_b_field_once(this.source2.getChildAt(0)) == true) {
                    return true;
                }
            }
            if (this.source3.numChildren > 0) {
                if (this.check_b_field_once(this.source3.getChildAt(0)) == true) {
                    return true;
                }
            }
            return false;
        };
        Base.prototype.clean_b_field = function () {
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 9; j++) {
                    if (this.shade_b[i][j].alpha > 0) {
                        this.shade_b[i][j].alpha = 0;
                        this.b[i][j].currentState = "empty";
                    }
                }
            }
        };
        Base.prototype.set_b_field = function (s) {
            for (var i = this.cb.length - 1; i >= 0; i--) {
                this.cb.splice(i, 1);
            }
            this.removeChild(s);
            s.includeInLayout = true;
            s.s_size();
            s.alpha = 1;
            s.x = 0;
            s.y = 0;
        };
        Base.prototype.restore_b_field = function (s) {
            for (var i = this.cb.length - 1; i >= 0; i--) {
                this.cb[i].currentState = "empty";
                this.cb.splice(i, 1);
            }
            s.alpha = 1;
        };
        Base.prototype.match_b_field = function (s) {
            for (var i = 0; i < 9 - s.size[0].y + 1; i++) {
                for (var j = 0; j < 9 - s.size[0].x + 1; j++) {
                    if (s.x >= this.b[i][j].localToGlobal().x && s.x <= this.b[i][j].localToGlobal().x + this.b[i][j].width && s.y >= this.b[i][j].localToGlobal().y && s.y <= this.b[i][j].localToGlobal().y + this.b[i][j].height) {
                        if (s.match_b_field(this.b, i, j, this.cb, 1)) {
                            s.alpha = 0;
                            return;
                        }
                    }
                }
            }
            this.restore_b_field(s);
        };
        Base.prototype.touch_on = function () {
            this.touchEnabled = true;
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touch_begin, this);
        };
        Base.prototype.touch_begin = function (evt) {
            if (evt.type == egret.TouchEvent.TOUCH_BEGIN) {
                this.set_source_field();
                this.ax = evt.stageX;
                this.ay = evt.stageY;
                this.check_source_field(evt.stageX, evt.stageY);
            }
        };
        Base.prototype.touch_move = function (evt) {
            if (evt.type == egret.TouchEvent.TOUCH_MOVE) {
                if (this.source[this.cidx] == null) {
                    this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touch_move, this);
                    return;
                }
                this.source[this.cidx].x = evt.stageX - this.rx;
                this.source[this.cidx].y = evt.stageY - this.ry;
                this.match_b_field(this.source[this.cidx]);
            }
        };
        Base.prototype.touch_end = function (evt) {
            if (evt.type == egret.TouchEvent.TOUCH_END) {
                this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touch_move, this);
                this.removeEventListener(egret.TouchEvent.TOUCH_END, this.touch_end, this);
                this.touchEnabled = false;
                if (this.source[this.cidx] == null) {
                    return;
                }
                this.rx = 0;
                this.ry = 0;
                this.ax = 0;
                this.ay = 0;
                if (this.source[this.cidx].alpha == 0) {
                    this.set_b_field(this.source[this.cidx]);
                    this.erase_b_field();
                }
                else {
                    this.restore_b_field(this.source[this.cidx]);
                    this.insert_source(this.cidx);
                    this.source[this.cidx].x = 0;
                    this.source[this.cidx].y = 0;
                }
                this.cidx = 3;
            }
        };
        Base.prototype.get_random_src = function () {
            var r = Math.random() * 100;
            for (var i = 0; i < this.patsrc.length; i++) {
                if (r >= this.patsrc[i].d[0].x) {
                    r -= this.patsrc[i].d[0].x;
                }
                else {
                    return this.patsrc[i];
                }
            }
            return this.patsrc[i - 1];
        };
        Base.prototype.get_random_tgt = function () {
            var r = Math.random() * 100;
            for (var i = 0; i < this.pattgt.length; i++) {
                if (r >= this.pattgt[i].d[0].x) {
                    r -= this.pattgt[i].d[0].x;
                }
                else {
                    return this.pattgt[i];
                }
            }
            return this.pattgt[i - 1];
        };
        Base.prototype.set_source = function () {
            if (this.source1.numChildren == 0) {
                while (true) {
                    var s = this.get_random_src();
                    if ((this.source2.numChildren != 0 && this.source2.getChildAt(0) == s) ||
                        (this.source3.numChildren != 0 && this.source3.getChildAt(0) == s))
                        continue;
                    s.random_color(this.clevel);
                    this.source1.addChild(s);
                    break;
                }
            }
            if (this.source2.numChildren == 0) {
                while (true) {
                    var s = this.get_random_src();
                    if ((this.source1.numChildren != 0 && this.source1.getChildAt(0)) == s ||
                        (this.source3.numChildren != 0 && this.source3.getChildAt(0) == s))
                        continue;
                    s.random_color(this.clevel);
                    this.source2.addChild(s);
                    break;
                }
            }
            if (this.source3.numChildren == 0) {
                while (true) {
                    var s = this.get_random_src();
                    if ((this.source1.numChildren != 0 && this.source1.getChildAt(0)) == s ||
                        (this.source2.numChildren != 0 && this.source2.getChildAt(0) == s))
                        continue;
                    s.random_color(this.clevel);
                    this.source3.addChild(s);
                    break;
                }
            }
        };
        Base.prototype.set_target = function () {
            if (this.target1.numChildren == 0) {
                while (true) {
                    var t = this.get_random_tgt();
                    if ((this.target2.numChildren != 0 && this.target2.getChildAt(0) == t) ||
                        (this.target3.numChildren != 0 && this.target3.getChildAt(0) == t) ||
                        (this.target4.numChildren != 0 && this.target4.getChildAt(0) == t))
                        continue;
                    t.random_color(this.clevel);
                    this.target1.addChild(t);
                    break;
                }
            }
            if (this.target2.numChildren == 0) {
                while (true) {
                    var t = this.get_random_tgt();
                    if ((this.target1.numChildren != 0 && this.target1.getChildAt(0) == t) ||
                        (this.target3.numChildren != 0 && this.target3.getChildAt(0) == t) ||
                        (this.target4.numChildren != 0 && this.target4.getChildAt(0) == t))
                        continue;
                    t.random_color(this.clevel);
                    this.target2.addChild(t);
                    break;
                }
            }
            if (this.target3.numChildren == 0) {
                while (true) {
                    var t = this.get_random_tgt();
                    if ((this.target1.numChildren != 0 && this.target1.getChildAt(0) == t) ||
                        (this.target2.numChildren != 0 && this.target2.getChildAt(0) == t) ||
                        (this.target4.numChildren != 0 && this.target4.getChildAt(0) == t))
                        continue;
                    t.random_color(this.clevel);
                    this.target3.addChild(t);
                    break;
                }
            }
            if (this.target4.numChildren == 0) {
                while (true) {
                    var t = this.get_random_tgt();
                    if ((this.target1.numChildren != 0 && this.target1.getChildAt(0) == t) ||
                        (this.target2.numChildren != 0 && this.target2.getChildAt(0) == t) ||
                        (this.target3.numChildren != 0 && this.target3.getChildAt(0) == t))
                        continue;
                    t.random_color(this.clevel);
                    this.target4.addChild(t);
                    break;
                }
            }
        };
        Base.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
        };
        Base.prototype.childrenCreated = function () {
            _super.prototype.childrenCreated.call(this);
        };
        return Base;
    }(eui.Component));
    Cube.Base = Base;
    __reflect(Base.prototype, "Cube.Base", ["eui.UIComponent", "egret.DisplayObject"]);
})(Cube || (Cube = {}));
//# sourceMappingURL=Base.js.map