///<reference path="ResCube.ts" />
module Cube {
	export class Base extends eui.Component implements eui.UIComponent{
		public bg:eui.Image;
		public level:eui.BitmapLabel;
		public score:eui.BitmapLabel;
		public targetr:eui.Rect;
		public targetl:eui.Label;
		public target1:eui.Group;
		public target2:eui.Group;
		public target3:eui.Group;
		public target4:eui.Group;
		public base:eui.Group;
		public source1:eui.Group;
		public source2:eui.Group;
		public source3:eui.Group;
		public count:eui.Label;
		public top_shade:eui.Rect;
		public top_group:eui.Group;
		public top_bg:eui.Rect;
		public top_head:eui.Label;
		public top_list:eui.List;
		public top_msg:eui.Label;
		public top_button:eui.Button;

		public b:Cube.ResCube[][] = [];
		public shade_b:Cube.ResCube[][] = [];
		public clevel:number = 1;
		public cscore:number = 0;
		public mult:number = 1;
		public patsrc:Cube.S[] = [];
		public pattgt:Cube.T[] = [];

		private timer:egret.Timer = new egret.Timer(300, 0);
		private plex1:number = 0;	//0允许重叠消除
		private plex2:number = 0;
		private plex3:number = 0;
		private plex4:number = 0;

		//触摸开始时设置, 触摸点相对左上角的位移
		private rx:number = 0;
		private ry:number = 0;

		//触摸开始时设置, 触摸点相对于全局的位置
		private ax:number = 0;
		private ay:number = 0;

    	//屏幕可点击区域
    	private source:any[] = [null, null, null, null];
    	private slx:number[] = [];
    	private srx:number[] = [];
    	private sty:number[] = [];
    	private sby:number[] = [];

    	//当前点击对象
    	private cidx:number = 3;

		//当前匹配高亮块
		public cb:Cube.ResCube[] = [];

		private record:Cube.Record = null;

		public constructor() {
			super();
			this.skinName = "BaseSkin";
			this.percentWidth = 100;
			this.percentHeight = 100;
			this.show_count();
			var i = 0;
			var j = 0;
			for(i = 0; i < 9; i++) {
				this.b[i] = [];
				this.shade_b[i] = [];
				for(j = 0; j < 9; j++) {
					this.b[i][j] = new Cube.ResCube();
					this.b[i][j].currentState = "empty";
					this.b[i][j].top = 4*(i+1) + 66*i;
					this.b[i][j].left = 4*(j+1) + 66*j;
					this.base.addChild(this.b[i][j]);
					this.shade_b[i][j] = new Cube.ResCube();
					this.shade_b[i][j].currentState = "match";
					this.shade_b[i][j].alpha = 0;
					this.shade_b[i][j].top = 4*(i+1) + 66*i;
					this.shade_b[i][j].left = 4*(j+1) + 66*j;
					this.base.addChild(this.shade_b[i][j]);
				}
			}
			for(i = 0; i < Cube.GlobalArg.patsrc.length; i++) {
				this.patsrc[i] = new Cube.S(Cube.GlobalArg.patsrc[i]);
			}
			for(i = 0; i < Cube.GlobalArg.pattgt.length; i++) {
				this.pattgt[i] = new Cube.T(Cube.GlobalArg.pattgt[i]);
			}
			this.timer.addEventListener(egret.TimerEvent.TIMER, this.erase_b_field_timer, this);
			this.timer.stop();
			this.touch_on();
		}

		public show_top() {
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
		}
		
		public show_count() {
			var request = new egret.HttpRequest();
			request.responseType = egret.HttpResponseType.TEXT;
			request.open("count.do", egret.HttpMethod.POST);
			request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			request.send();
			request.addEventListener(egret.Event.COMPLETE, this.onCountComplete, this);
			request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onCountIOError, this);
			request.addEventListener(egret.ProgressEvent.PROGRESS, this.onCountProgress, this);
		}

		private onCountComplete(event:egret.Event):void {
		    var request = <egret.HttpRequest>event.currentTarget;
			var json = JSON.parse(request.response);
			if(json.code != "0") {
				this.count.text = json.desc;
				return;
			}

			this.count.text = "共有" + json.c + "位玩家进行了游戏";
			return;
		}

		private onCountIOError(event:egret.IOErrorEvent):void {
			this.count.text = "连接服务器失败";
		}

		private onCountProgress(event:egret.ProgressEvent):void {
			this.count.text = "连接服务器: " + Math.floor(100*event.bytesLoaded/event.bytesTotal) + "%";
		}

		public get_score() {
			//this.onPostComplete(null);
			//return;
			var request = new egret.HttpRequest();
			request.responseType = egret.HttpResponseType.TEXT;
			request.open("top.do", egret.HttpMethod.POST);
			request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			request.send();
			request.addEventListener(egret.Event.COMPLETE, this.onPostComplete, this);
			request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onPostIOError, this);
			request.addEventListener(egret.ProgressEvent.PROGRESS, this.onPostProgress, this);
		}

		private onPostComplete(event:egret.Event):void {
		    var request = <egret.HttpRequest>event.currentTarget;
			//var str = `{"code":"0","data":[{"r":1,"s":35576,"l":313,"n":"sdfsd"},{"r":2,"s":23423,"l":312,"n":"fsef"},{"r":3,"s":12332,"l":12,"n":"qwe"},{"r":4,"s":3231,"l":1231,"n":"ers"},{"r":5,"s":567,"l":123,"n":"fsdf"},{"r":6,"s":231,"l":32,"n":"sf"},{"r":7,"s":213,"d":"asdf","l":11,"n":"abcde"}],"desc":""}`;
			//var json = JSON.parse(str);
			var json = JSON.parse(request.response);
			if(json.code != "0") {
				this.top_msg.text = json.desc;
				return;
			}

			var r:number = 0;
			var len:number = 10;
			if(json.data.length >= 10) {
				var lastone = json.data[json.data.length-1].s;
				if(this.cscore < lastone/100) {
					this.top_msg.text = "您的排名, 深不见底......";
					return;
				}

				if(this.cscore <= lastone) {
					this.top_msg.text = "差一点就能上榜了, 加油啊!";
					return;
				}

				r = json.data.length-1;
				len = json.data.length-1;
			}else {
				r = json.data.length;
				len = json.data.length;
			}

			
			this.top_msg.text = "大神! 恭喜上榜! 快留个言BS一下下面那些智商欠费的渣渣!";
			var collection = new eui.ArrayCollection();
			this.record = new Cube.Record();
			for(var i = 0; i < json.data.length; i++) {
				if(this.cscore > json.data[i].s) {
					r = i;
					break;
				}
			}
			for(var i = 0; i < r; i++) {
				collection.addItem({"rank":json.data[i].r,"name":json.data[i].n,"level":json.data[i].l,"score":json.data[i].s,"desc":json.data[i].d});
			}
			if(r != 0 && this.cscore == json.data[r-1].s) {
				this.record.rank.text = json.data[r-1].r;
			}else {
				this.record.rank.text = (r+1).toString();
			}
			this.record.level.text = this.level.text;
			this.record.score.text = this.score.text;
			this.record.top = 110 + 70*r;
			this.top_group.addChild(this.record);
			collection.addItem({"rank":"","name":"","level":"","score":"","desc":""});
			for(var i = r; i < len; i++) {
				collection.addItem({"rank":(json.data[i].r+1),"name":json.data[i].n,"level":json.data[i].l,"score":json.data[i].s,"desc":json.data[i].d});
			}

			this.top_list.dataProvider = collection;
			return;
		}

		private onPostIOError(event:egret.IOErrorEvent):void {
			this.top_msg.text = "连接服务器失败!";
		}

		private onPostProgress(event:egret.ProgressEvent):void {
			this.top_msg.text = "连接服务器: " + Math.floor(100*event.bytesLoaded/event.bytesTotal) + "%";
		}

		public restart() {
			location.reload();
		}

		public dp_new(text:string) {
			var dp:eui.BitmapLabel = new eui.BitmapLabel();
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
			egret.Tween.get(dp).to({scaleX:1.5,scaleY:1.5,verticalCenter:-200}, 750, egret.Ease.sineIn).to({verticalCenter:-350,alpha:0}, 750, egret.Ease.sineIn).call(this.dp_del, dp);
		}

		public dp_del() {
			this.parent.removeChild(this);
		}

    	private set_source_field_once(s:any, i:number) {
    	    this.slx[i] = s.localToGlobal().x;
    	    this.srx[i] = s.localToGlobal().x + s.width;
    	    this.sty[i] = s.localToGlobal().y;
    	    this.sby[i] = s.localToGlobal().y + s.height;
    	}

    	private set_source_field() {
    	    if(this.source1.numChildren > 0) {
    	        this.source[0] = this.source1.getChildAt(0);
    	        this.set_source_field_once(this.source[0], 0);
    	    }
    	    if(this.source2.numChildren > 0) {
    	        this.source[1] = this.source2.getChildAt(0);
    	        this.set_source_field_once(this.source[1], 1);
    	    }
    	    if(this.source3.numChildren > 0) {
    	        this.source[2] = this.source3.getChildAt(0);
    	        this.set_source_field_once(this.source[2], 2);
    	    }
    	}

		private release_source(i:number) {
			switch(i) {
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
		}

		private insert_source(i:number) {
			this.removeChild(this.source[i]);
			this.source[i].includeInLayout = true;
			this.source[i].s_size();
			switch(i) {
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
		}

		private erase_b_field_once(s:any, p:number):boolean {
			for(var t = 0; t < 4; t++) {
			for(var i = 0; i < 9-s.size[0].y+1; i++) {
				for(var j = 0; j < 9-s.size[0].x+1; j++) {
					if(s.match_b_field(this.b, i, j, this.shade_b, p, Cube.GlobalArg.color[t]) == true) {
						this.dp_new((Math.floor((Math.pow(1.3, this.clevel)*(s.d[0].y+this.clevel)) * this.mult)).toString());
						this.cscore += Math.floor((Math.pow(1.3,this.clevel)*(s.d[0].y+this.clevel)) * this.mult);
						this.score.text = this.cscore.toString();
						var tl:number = 0;
						for(tl = 0; tl < Cube.GlobalArg.level_score.length; tl++) {
							if(Cube.GlobalArg.level_score[tl] > this.cscore) {
								break;
							}
						}
						if(this.clevel < tl) {
							this.clevel = tl;
							egret.Tween.get(this.level).to({text:this.clevel.toString(), scaleX:1.5,scaleY:1.5}, 50, egret.Ease.sineIn).to({scaleX:0.43,scaleY:0.43}, 700, egret.Ease.sineIn);
						}
						this.mult++;
						return true;
					}
				}
			}
			}
			return false;
		}

		private erase_b_field_timer() {
			if(this.target1.numChildren > 0) {
				if(this.erase_b_field_once(this.target1.getChildAt(0), this.plex1) == true) {
					this.plex1++;
					return;
				}
				if(this.plex1 > 0) {
					this.plex1 = 0;
					this.target1.removeChildren();
				}
			}
			if(this.target2.numChildren > 0) {
				if(this.erase_b_field_once(this.target2.getChildAt(0), this.plex2) == true) {
					this.plex2++;
					return;
				}
				if(this.plex2 > 0) {
					this.plex2 = 0;
					this.target2.removeChildren();
				}
			}
			if(this.target3.numChildren > 0) {
				if(this.erase_b_field_once(this.target3.getChildAt(0), this.plex3) == true) {
					this.plex3++;
					return;
				}
				if(this.plex3 > 0) {
					this.plex3 = 0;
					this.target3.removeChildren();
				}
			}
			if(this.target4.numChildren > 0) {
				if(this.erase_b_field_once(this.target4.getChildAt(0), this.plex4) == true) {
					this.plex4++;
					return;
				}
				if(this.plex4 > 0) {
					this.plex4 = 0;
					this.target4.removeChildren();
				}
			}
			if(this.target1.numChildren == 0 ||
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
			if(this.check_b_field() == false) {
				this.show_top();
				return;
			}
			this.touchEnabled = true;
		}

		private erase_b_field() {
			this.timer.start();
		}

    	private check_source_field(x:number, y:number) {
    	    for(var i = 0; i < 3; i++) {
    	        if(this.source[i] != null && x >= this.slx[i] && x <= this.srx[i] && y >= this.sty[i] && y <= this.sby[i]) {
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
    	}

		private check_b_field_once(s:any):boolean {
			for(var i = 0; i < 9-s.size[0].y+1; i++) {
				for(var j = 0; j < 9-s.size[0].x+1; j++) {
					if(s.match_b_field(this.b, i, j, null, 0)) {
						return true;
					}
				}
			}
			return false;
		}

		private check_b_field():boolean {
			if(this.source1.numChildren > 0) {
				if(this.check_b_field_once(this.source1.getChildAt(0)) == true) {
					return true;
				}
			}
			if(this.source2.numChildren > 0) {
				if(this.check_b_field_once(this.source2.getChildAt(0)) == true) {
					return true;
				}
			}
			if(this.source3.numChildren > 0) {
				if(this.check_b_field_once(this.source3.getChildAt(0)) == true) {
					return true;
				}
			}
			return false;
		}

		private clean_b_field() {
			for(var i = 0; i < 9; i++) {
				for(var j = 0; j < 9; j++) {
					if(this.shade_b[i][j].alpha > 0) {
						this.shade_b[i][j].alpha = 0;
						this.b[i][j].currentState = "empty";
					}
				}
			}
		}

		private set_b_field(s:any) {
			for(var i = this.cb.length-1; i >= 0; i--) {
				this.cb.splice(i,1);
			}
			this.removeChild(s);
			s.includeInLayout = true;
			s.s_size();
			s.alpha = 1;
			s.x = 0;
			s.y = 0;
		}

		private restore_b_field(s:any) {
			for(var i = this.cb.length-1; i >= 0; i--) {
				this.cb[i].currentState = "empty";
				this.cb.splice(i,1);
			}
			s.alpha = 1;
		}

		private match_b_field(s:any) {
			for(var i = 0; i < 9-s.size[0].y+1; i++) {
				for(var j = 0; j < 9-s.size[0].x+1; j++) {
					if(s.x+Cube.GlobalArg.bsize.x/2 >= this.b[i][j].localToGlobal().x-Cube.GlobalArg.attract && 
					s.x+Cube.GlobalArg.bsize.x/2 <= this.b[i][j].localToGlobal().x+this.b[i][j].width+Cube.GlobalArg.attract && 
					s.y+Cube.GlobalArg.bsize.y/2 >= this.b[i][j].localToGlobal().y-Cube.GlobalArg.attract && 
					s.y+Cube.GlobalArg.bsize.y/2 <= this.b[i][j].localToGlobal().y+this.b[i][j].height+Cube.GlobalArg.attract) {
						if(s.match_b_field(this.b, i, j, this.cb, 1)) {
							s.alpha = 0;
							return;
						}
					}
				}
			}
			this.restore_b_field(s);
		}

    	private touch_on() {
    	    this.touchEnabled = true;
			this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touch_begin, this);
		}

		private touch_begin(evt:egret.TouchEvent):void {
			if(evt.type == egret.TouchEvent.TOUCH_BEGIN) {
    	        this.set_source_field();
				this.ax = evt.stageX;
				this.ay = evt.stageY;
    	        this.check_source_field(evt.stageX, evt.stageY);
			}
		}

		private touch_move(evt:egret.TouchEvent):void {
			if(evt.type == egret.TouchEvent.TOUCH_MOVE) {
    	        if(this.source[this.cidx] == null) {
    	            this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touch_move, this);
    	            return;
    	        }
				this.source[this.cidx].x = evt.stageX - this.rx;
    	        this.source[this.cidx].y = evt.stageY - this.ry;
				this.match_b_field(this.source[this.cidx]);
			}
		}

		private touch_end(evt:egret.TouchEvent):void {
			if(evt.type == egret.TouchEvent.TOUCH_END) {
				this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touch_move, this);
				this.removeEventListener(egret.TouchEvent.TOUCH_END, this.touch_end, this);
				this.touchEnabled = false;
    	        if(this.source[this.cidx] == null) {
    	            return;
    	        }
				this.rx = 0;
				this.ry = 0;
				this.ax = 0;
				this.ay = 0;
				if(this.source[this.cidx].alpha == 0) {
					this.set_b_field(this.source[this.cidx]);
					this.erase_b_field();
				}else {
					this.restore_b_field(this.source[this.cidx]);
					this.insert_source(this.cidx);
					this.source[this.cidx].x = 0;
					this.source[this.cidx].y = 0;
				}
    	        this.cidx = 3;
			}
		}

		public get_random_src():Cube.S {
			var r = Math.random()*100;
			for(var i = 0; i < this.patsrc.length; i++) {
				if(r >= this.patsrc[i].d[0].x) {
					r -= this.patsrc[i].d[0].x;
				}else {
					return this.patsrc[i];
				}
			}
			return this.patsrc[i-1];
		}

		public get_random_tgt():Cube.T {
			var r = Math.random()*100;
			for(var i = 0; i < this.pattgt.length; i++) {
				if(r >= this.pattgt[i].d[0].x) {
					r -= this.pattgt[i].d[0].x;
				}else {
					return this.pattgt[i];
				}
			}
			return this.pattgt[i-1];
		}

		public set_source() {
			if(this.source1.numChildren == 0) {
				while(true) {
					var s = this.get_random_src();
					if((this.source2.numChildren != 0 && this.source2.getChildAt(0) == s) ||
						(this.source3.numChildren != 0 && this.source3.getChildAt(0) == s)) continue;
					s.random_color(this.clevel);
    	        	this.source1.addChild(s);
					break;
				}
    	    }
    	    if(this.source2.numChildren == 0) {
    	        while(true) {
					var s = this.get_random_src();
					if((this.source1.numChildren != 0 && this.source1.getChildAt(0)) == s ||
						(this.source3.numChildren != 0 && this.source3.getChildAt(0) == s)) continue;
    	        	s.random_color(this.clevel);
					this.source2.addChild(s);
					break;
				}
    	    }
    	    if(this.source3.numChildren == 0) {
    	        while(true) {
					var s = this.get_random_src();
					if((this.source1.numChildren != 0 && this.source1.getChildAt(0)) == s ||
						(this.source2.numChildren != 0 && this.source2.getChildAt(0) == s)) continue;
    	        	s.random_color(this.clevel);
					this.source3.addChild(s);
					break;
				}
    	    }
		}

		public set_target() {
			if(this.target1.numChildren == 0) {
				while(true) {
					var t = this.get_random_tgt();
					if((this.target2.numChildren != 0 && this.target2.getChildAt(0) == t) ||
						(this.target3.numChildren != 0 && this.target3.getChildAt(0) == t) ||
						(this.target4.numChildren != 0 && this.target4.getChildAt(0) == t)) continue;
					t.random_color(this.clevel);
    	        	this.target1.addChild(t);
					break;
				}
    	    }
    	    if(this.target2.numChildren == 0) {
				while(true) {
					var t = this.get_random_tgt();
					if((this.target1.numChildren != 0 && this.target1.getChildAt(0) == t) ||
						(this.target3.numChildren != 0 && this.target3.getChildAt(0) == t) ||
						(this.target4.numChildren != 0 && this.target4.getChildAt(0) == t)) continue;
					t.random_color(this.clevel);
    	        	this.target2.addChild(t);
					break;
				}
    	    }
    	    if(this.target3.numChildren == 0) {
				while(true) {
					var t = this.get_random_tgt();
					if((this.target1.numChildren != 0 && this.target1.getChildAt(0) == t) ||
						(this.target2.numChildren != 0 && this.target2.getChildAt(0) == t) ||
						(this.target4.numChildren != 0 && this.target4.getChildAt(0) == t)) continue;
					t.random_color(this.clevel);
    	        	this.target3.addChild(t);
					break;
				}
    	    }
			if(this.target4.numChildren == 0) {
				while(true) {
					var t = this.get_random_tgt();
					if((this.target1.numChildren != 0 && this.target1.getChildAt(0) == t) ||
						(this.target2.numChildren != 0 && this.target2.getChildAt(0) == t) ||
						(this.target3.numChildren != 0 && this.target3.getChildAt(0) == t)) continue;
					t.random_color(this.clevel);
    	        	this.target4.addChild(t);
					break;
				}
    	    }
		}

		protected partAdded(partName:string,instance:any):void{
			super.partAdded(partName,instance);
		}

		protected childrenCreated():void{
			super.childrenCreated();
		}
	}
}