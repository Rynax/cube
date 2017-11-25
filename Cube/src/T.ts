module Cube {
	export class T extends eui.Component implements eui.UIComponent{
		//图案格子位置标记, x表示格子横向编号, y表示格子纵向编号
		public d:egret.Point[] = null;

		//图案尺寸, [0]所占格子数, [1]大尺寸, [2]小尺寸(source或target)
		public size:egret.Point[] = [new egret.Point(), new egret.Point(), new egret.Point()];

		public g:eui.Group = new eui.Group();
		public c:Cube.ResCube[] = [];

		public constructor(d:egret.Point[]) {
			super();
			this.d = d;

			this.g.percentWidth = 100;
			this.g.percentHeight = 100;
			this.g.top = 0;
			this.g.left = 0;
			this.addChild(this.g);

			for(var i = 1; i < this.d.length; i++) {
				if(this.size[0].x < this.d[i].x) {
					this.size[0].x = this.d[i].x;
				}
				if(this.size[0].y < this.d[i].y) {
					this.size[0].y = this.d[i].y;
				}
			}
			this.size[0].x++;
			this.size[0].y++;
			this.size[1].x = this.size[0].x * Cube.GlobalArg.bsize.x;
			this.size[1].y = this.size[0].y * Cube.GlobalArg.bsize.y;
			this.size[2].x = this.size[0].x * Cube.GlobalArg.tsize.x;
			this.size[2].y = this.size[0].y * Cube.GlobalArg.tsize.y;

			for(var i = 0; i < this.d.length-1; i++) {
				this.c[i] = new Cube.ResCube();
				this.c[i].skinName = "ResCubeSkin";
				this.c[i].currentState = "base";
				this.c[i].percentWidth = 100/this.size[0].x;
				this.c[i].percentHeight = 100/this.size[0].y;
				this.c[i].left = (this.c[i].percentWidth * this.d[i+1].x)+"%";
				this.c[i].top = (this.c[i].percentHeight * this.d[i+1].y)+"%";
				this.c[i].touchEnabled = false;
				this.g.addChild(this.c[i]);
			}

			this.horizontalCenter = 0;
			this.verticalCenter = 0;
			this.touchEnabled = false;
			this.s_size();
		}

		public b_size() {
			this.width = this.size[1].x;
			this.height = this.size[1].y;
		}

		public s_size() {
			this.width = this.size[2].x;
			this.height = this.size[2].y;
		}

		public match_b_field(b:Cube.ResCube[][], i:number, j:number, sb:Cube.ResCube[], p:number, c:string):boolean {
			for(var t = 1; t < this.d.length; t++) {
				if(b[i+this.d[t].y][j+this.d[t].x].currentState == "empty") {
					return false;
				}
			}
			if(p > 0) {
				for(var t = 1; t < this.d.length; t++) {
					if(sb[i+this.d[t].y][j+this.d[t].x].alpha > 0) {
						return false;
					}
				}
			}
			for(var t = 0; t < this.d.length-1; t++) {
				if(this.c[t].currentState != "base" && b[i+this.d[t+1].y][j+this.d[t+1].x].currentState != this.c[t].currentState) {
					return false;
				}
				if(this.c[t].currentState == "base" && b[i+this.d[t+1].y][j+this.d[t+1].x].currentState != c) {
					return false;
				}
			}
			for(var t = 1; t < this.d.length; t++) {
				egret.Tween.get(sb[i+this.d[t].y][j+this.d[t].x]).to({alpha:1}, 50, egret.Ease.sineIn).to({alpha:0.8}, 50, egret.Ease.sineIn);
			}
			return true;
		}

		public random_color(level:number) {
			var num = 0;
			if(level <= 29) num = 0;
			else if(level <= 34) num = 1;
			else if(level <= 39) num = 2;
			else if(level <= 44) num = 3;
			else num = 4;
			for(var t = 0; t < this.d.length-1; t++) {
				if(this.c[t].currentState != "base") {
					this.c[t].currentState = "base";
				}
			}
			for(; num > 0; num--) {
				var i = Math.floor(Math.random()*(this.d.length-1));   //获取随机下标
				while(this.c[i].currentState != "base") {
					i++;
					if(i >= num) {
						i = 0;
					}
				}
				this.c[i].currentState = Cube.GlobalArg.color[Math.floor(Math.random()*num)];
			}
		}

		protected partAdded(partName:string,instance:any):void
		{
			super.partAdded(partName,instance);
		}

		protected childrenCreated():void
		{
			super.childrenCreated();
		}
	}
}