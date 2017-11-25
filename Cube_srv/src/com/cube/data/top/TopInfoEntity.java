package com.cube.data.top;

import org.json.JSONException;
import org.json.JSONObject;

public class TopInfoEntity implements Cloneable {
	int tid;
	String tnick;
	int tlevel;
	int tscore;
	String tdesc;
	
	@Override
	public Object clone() throws CloneNotSupportedException {
		return super.clone();
	}
	
	public int get_tid() {
		return tid;
	}
    
	public String get_tnick() {
		return tnick;
	}
	
	public int get_tlevel() {
		return tlevel;
	}
	
	public int get_tscore() {
		return tscore;
	}
	
	public String get_tdesc() {
		return tdesc;
	}
	
	public void set_tid(int i) {
		this.tid = i;
	}
    
	public void set_tnick(String s) {
		this.tnick = s;
	}
	
	public void set_tlevel(int i) {
		this.tlevel = i;
	}
	
	public void set_tscore(int i) {
		this.tscore = i;
	}
	
	public void set_tdesc(String s) {
		this.tdesc = s;
	}
	
	public TopInfoEntity() {
		super();
	}
	
	@Override
	public String toString() {
		String s = new String();
		s += "[" + tnick + ":" + tlevel + ":" + tscore + ":" + tdesc + "]\r\n";
		return s;
	}
	
	public JSONObject toJson(int trank) throws JSONException {
		JSONObject json = new JSONObject();
		json.put("r", trank);
		json.put("n", tnick);
		json.put("l", tlevel);
		json.put("s", tscore);
		json.put("d", tdesc);
		return json;
	}
}
