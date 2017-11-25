var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Cube;
(function (Cube) {
    var GlobalArg = (function () {
        function GlobalArg() {
        }
        GlobalArg.color = [
            "red",
            "blue",
            "yellow",
            "green",
            "base",
            "empty",
            "match"
        ];
        //吸力, 像素点
        GlobalArg.attract = 4;
        //单格大小
        GlobalArg.bsize = new egret.Point(66, 66);
        GlobalArg.ssize = new egret.Point(52, 52);
        GlobalArg.tsize = new egret.Point(25, 25);
        GlobalArg.patsrc = [
            [new egret.Point(8, 0), new egret.Point(0, 0)],
            [new egret.Point(8, 0), new egret.Point(0, 0), new egret.Point(1, 0)],
            [new egret.Point(8, 0), new egret.Point(0, 0), new egret.Point(0, 1)],
            [new egret.Point(5, 0), new egret.Point(0, 0), new egret.Point(0, 1), new egret.Point(1, 1)],
            [new egret.Point(5, 0), new egret.Point(0, 0), new egret.Point(1, 0), new egret.Point(0, 1)],
            [new egret.Point(5, 0), new egret.Point(0, 0), new egret.Point(1, 0), new egret.Point(1, 1)],
            [new egret.Point(5, 0), new egret.Point(1, 0), new egret.Point(0, 1), new egret.Point(1, 1)],
            [new egret.Point(2, 0), new egret.Point(0, 0), new egret.Point(0, 1), new egret.Point(1, 0), new egret.Point(1, 1)],
            [new egret.Point(3, 0), new egret.Point(1, 0), new egret.Point(0, 1), new egret.Point(1, 1), new egret.Point(2, 1)],
            [new egret.Point(3, 0), new egret.Point(0, 0), new egret.Point(1, 0), new egret.Point(2, 0), new egret.Point(1, 1)],
            [new egret.Point(3, 0), new egret.Point(0, 0), new egret.Point(0, 1), new egret.Point(1, 0), new egret.Point(1, 1)],
            [new egret.Point(3, 0), new egret.Point(1, 0), new egret.Point(0, 1), new egret.Point(1, 1), new egret.Point(1, 2)],
            [new egret.Point(3, 0), new egret.Point(0, 0), new egret.Point(0, 1), new egret.Point(1, 1), new egret.Point(1, 2)],
            [new egret.Point(3, 0), new egret.Point(1, 0), new egret.Point(0, 1), new egret.Point(1, 1), new egret.Point(0, 2)],
            [new egret.Point(3, 0), new egret.Point(1, 0), new egret.Point(2, 0), new egret.Point(0, 1), new egret.Point(1, 1)],
            [new egret.Point(3, 0), new egret.Point(0, 0), new egret.Point(1, 0), new egret.Point(1, 1), new egret.Point(2, 1)],
            [new egret.Point(3, 0), new egret.Point(1, 0), new egret.Point(1, 1), new egret.Point(0, 2), new egret.Point(1, 2)],
            [new egret.Point(3, 0), new egret.Point(0, 0), new egret.Point(0, 1), new egret.Point(1, 1), new egret.Point(2, 1)],
            [new egret.Point(3, 0), new egret.Point(0, 0), new egret.Point(1, 0), new egret.Point(0, 1), new egret.Point(0, 2)],
            [new egret.Point(3, 0), new egret.Point(0, 0), new egret.Point(1, 0), new egret.Point(2, 0), new egret.Point(2, 1)],
            [new egret.Point(3, 0), new egret.Point(0, 0), new egret.Point(0, 1), new egret.Point(0, 2), new egret.Point(1, 2)],
            [new egret.Point(3, 0), new egret.Point(0, 0), new egret.Point(1, 0), new egret.Point(2, 0), new egret.Point(0, 1)],
            [new egret.Point(3, 0), new egret.Point(0, 0), new egret.Point(1, 0), new egret.Point(1, 1), new egret.Point(1, 2)],
            [new egret.Point(3, 0), new egret.Point(2, 0), new egret.Point(0, 1), new egret.Point(1, 1), new egret.Point(2, 1)],
            [new egret.Point(3, 0), new egret.Point(0, 0), new egret.Point(1, 0), new egret.Point(2, 0), new egret.Point(3, 0)],
            [new egret.Point(3, 0), new egret.Point(0, 0), new egret.Point(0, 1), new egret.Point(0, 2), new egret.Point(0, 3)]
        ];
        GlobalArg.pattgt = [
            [new egret.Point(3, 50), new egret.Point(0, 0), new egret.Point(0, 1), new egret.Point(1, 1)],
            [new egret.Point(3, 50), new egret.Point(0, 0), new egret.Point(1, 0), new egret.Point(0, 1)],
            [new egret.Point(3, 50), new egret.Point(0, 0), new egret.Point(1, 0), new egret.Point(1, 1)],
            [new egret.Point(3, 50), new egret.Point(1, 0), new egret.Point(0, 1), new egret.Point(1, 1)],
            [new egret.Point(3, 50), new egret.Point(0, 0), new egret.Point(1, 0), new egret.Point(2, 0)],
            [new egret.Point(3, 50), new egret.Point(0, 0), new egret.Point(0, 1), new egret.Point(0, 2)],
            [new egret.Point(3, 50), new egret.Point(0, 0), new egret.Point(1, 1), new egret.Point(2, 2)],
            [new egret.Point(3, 50), new egret.Point(2, 0), new egret.Point(1, 1), new egret.Point(0, 2)],
            [new egret.Point(3, 50), new egret.Point(0, 0), new egret.Point(0, 1), new egret.Point(1, 0), new egret.Point(1, 1)],
            [new egret.Point(3, 100), new egret.Point(1, 0), new egret.Point(0, 1), new egret.Point(2, 1), new egret.Point(1, 2)],
            [new egret.Point(3, 100), new egret.Point(1, 0), new egret.Point(0, 1), new egret.Point(1, 1), new egret.Point(2, 1)],
            [new egret.Point(3, 100), new egret.Point(0, 0), new egret.Point(1, 0), new egret.Point(2, 0), new egret.Point(1, 1)],
            [new egret.Point(3, 100), new egret.Point(0, 0), new egret.Point(0, 1), new egret.Point(1, 0), new egret.Point(1, 1)],
            [new egret.Point(3, 100), new egret.Point(1, 0), new egret.Point(0, 1), new egret.Point(1, 1), new egret.Point(1, 2)],
            [new egret.Point(3, 100), new egret.Point(0, 0), new egret.Point(0, 1), new egret.Point(1, 1), new egret.Point(1, 2)],
            [new egret.Point(3, 100), new egret.Point(1, 0), new egret.Point(0, 1), new egret.Point(1, 1), new egret.Point(0, 2)],
            [new egret.Point(3, 100), new egret.Point(1, 0), new egret.Point(2, 0), new egret.Point(0, 1), new egret.Point(1, 1)],
            [new egret.Point(3, 100), new egret.Point(0, 0), new egret.Point(1, 0), new egret.Point(1, 1), new egret.Point(2, 1)],
            [new egret.Point(3, 100), new egret.Point(1, 0), new egret.Point(1, 1), new egret.Point(0, 2), new egret.Point(1, 2)],
            [new egret.Point(3, 100), new egret.Point(0, 0), new egret.Point(0, 1), new egret.Point(1, 1), new egret.Point(2, 1)],
            [new egret.Point(3, 100), new egret.Point(0, 0), new egret.Point(1, 0), new egret.Point(0, 1), new egret.Point(0, 2)],
            [new egret.Point(3, 100), new egret.Point(0, 0), new egret.Point(1, 0), new egret.Point(2, 0), new egret.Point(2, 1)],
            [new egret.Point(3, 100), new egret.Point(0, 0), new egret.Point(0, 1), new egret.Point(0, 2), new egret.Point(1, 2)],
            [new egret.Point(3, 100), new egret.Point(0, 0), new egret.Point(1, 0), new egret.Point(2, 0), new egret.Point(0, 1)],
            [new egret.Point(3, 100), new egret.Point(0, 0), new egret.Point(1, 0), new egret.Point(1, 1), new egret.Point(1, 2)],
            [new egret.Point(3, 100), new egret.Point(2, 0), new egret.Point(0, 1), new egret.Point(1, 1), new egret.Point(2, 1)],
            [new egret.Point(3, 100), new egret.Point(0, 0), new egret.Point(1, 0), new egret.Point(2, 0), new egret.Point(3, 0)],
            [new egret.Point(3, 100), new egret.Point(0, 0), new egret.Point(0, 1), new egret.Point(0, 2), new egret.Point(0, 3)],
            //[new egret.Point(4, 200), new egret.Point(0, 0), new egret.Point(0, 1), new egret.Point(0, 2), new egret.Point(1, 0), new egret.Point(1, 1), new egret.Point(1, 2), new egret.Point(2, 0), new egret.Point(2, 1), new egret.Point(2, 2)],
            [new egret.Point(4, 200), new egret.Point(1, 0), new egret.Point(0, 1), new egret.Point(1, 1), new egret.Point(2, 1), new egret.Point(1, 2)],
            [new egret.Point(4, 200), new egret.Point(0, 0), new egret.Point(2, 0), new egret.Point(1, 1), new egret.Point(0, 2), new egret.Point(2, 2)],
            [new egret.Point(4, 100), new egret.Point(0, 0), new egret.Point(1, 0), new egret.Point(2, 0), new egret.Point(0, 1), new egret.Point(1, 1), new egret.Point(2, 1)],
            [new egret.Point(4, 100), new egret.Point(0, 0), new egret.Point(1, 0), new egret.Point(0, 1), new egret.Point(1, 1), new egret.Point(0, 2), new egret.Point(1, 2)]
        ];
        //等级->分数公式: score=(level+1.5^level)*(level+100), 基础消除分数: (1.3^level)*(level+pattgt[i][0].y)
        GlobalArg.level_score = [253, 434, 657, 943, 1322, 1843, 2577, 3632, 5171, 7443, 10822, 15876, 23461, 34876, 52083, 78050, 117265, 176515, 266065, 401431, 606075, 915467, 1383226, 2090406, 3159521, 4775747, 7218950, 10912089, 16494332, 24931538, 37683144, 56954289, 86076646, 130083681, 196579522, 297051256, 448850855, 678188293, 1024651549, 1548032125, 2338631567, 3532823641, 5336551160, 8060801598, 12175166035, 18388695907, 27771965585, 41941332451, 63337076322, 95643232532];
        return GlobalArg;
    }());
    Cube.GlobalArg = GlobalArg;
    __reflect(GlobalArg.prototype, "Cube.GlobalArg");
})(Cube || (Cube = {}));
//# sourceMappingURL=GlobalArg.js.map