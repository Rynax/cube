module Cube {
	export class Record extends eui.Component implements eui.UIComponent{
		public border:eui.Rect;
		public rank:eui.BitmapLabel;
		public nick:eui.TextInput;
		public level:eui.BitmapLabel;
		public score:eui.BitmapLabel;
		public desc:eui.TextInput;
		public submit:eui.Button;

		public constructor() {
			super();
			this.skinName = "recordSkin";
			this.horizontalCenter="0";
			this.submit.addEventListener(egret.TouchEvent.TOUCH_TAP, this.send_record, this);
		}

		public send_record() {
			this.submit.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.send_record, this);
			this.submit.touchEnabled = false;
			this.submit.alpha = 0;
			this.nick.touchEnabled = false;
			this.nick.textDisplay.touchEnabled = false;
			this.desc.touchEnabled = false;
			this.desc.width = 460;
			this.desc.textDisplay.touchEnabled = false;
			var record:string = "data={\"n\":" + this.nick.text + "," + "\"l\":" + this.level.text + "," + "\"s\":" + this.score.text + "," + "\"d\":" + this.desc.text + "}";
			var request = new egret.HttpRequest();
			request.responseType = egret.HttpResponseType.TEXT;
			request.open("put.do", egret.HttpMethod.POST);
			request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			request.send(record);
		}
	}
}