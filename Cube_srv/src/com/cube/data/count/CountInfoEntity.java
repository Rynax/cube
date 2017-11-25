package com.cube.data.count;

import org.json.JSONException;
import org.json.JSONObject;

public class CountInfoEntity implements Cloneable {
	int tid;
	int tcount;
	
	@Override
	public Object clone() throws CloneNotSupportedException {
		return super.clone();
	}
	
	public int get_tid() {
		return tid;
	}
    
	public int get_tcount() {
		return tcount;
	}
	
	public void set_tid(int i) {
		this.tid = i;
	}
    
	public void set_tcount(int i) {
		this.tcount = i;
	}
	
	public CountInfoEntity() {
		super();
	}
	
	@Override
	public String toString() {
		String s = new String();
		s += "[" + tcount + "]\r\n";
		return s;
	}
	
	public JSONObject toJson(int trank) throws JSONException {
		JSONObject json = new JSONObject();
		json.put("c", tcount);
		return json;
	}
}
