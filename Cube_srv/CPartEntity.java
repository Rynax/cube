package com.deeper.data.cbase;

import org.json.JSONException;

import com.deeper.global.GlobalArg;

public class CPartEntity extends CBaseEntity {
	public int ctarget;
	public int caction;
	public int cdamage;
	public int chull;
	public int cshield;
	public int cfightback;
	
	@Override
	public Object clone() throws CloneNotSupportedException {
		return super.clone();
	}
	
	public CPartEntity() {
		super();
	}
	
	public String get_type_str() {
		switch(ctype) {
		case 0:
			return "母舰";
		case 1:
			return "战列舰";
		case 2:
			return "巡洋舰";
		case 3:
			return "驱逐舰";
		case 4:
			return "炮舰";
		case 5:
			return "护卫舰";
		case 6:
			return "轰炸机";
		case 7:
			return "战斗机";
		default:
			return "舰船类型错误";
		}
	}
	
	public String get_target_str() {
		switch(ctarget) {
		case 0:
			return "己方单体";
		case 1:
			return "己方全体";
		default:
			return "目标类型错误";
		}
	}
	
	@Override
	public String toString() {
		String s = new String();
		s += "[" + "[零件]" + get_type_str() + ":" + get_target_str() + "]\r\n";
		s += super.toString();
		s += "[行动力: " + caction + "]\r\n";
		s += "[反击次数: " + cfightback + "]\r\n";
		s += "[伤害: " + cdamage  + "]\r\n";
		s += "[护盾: " + cshield + "]\r\n";
		s += "[船体: " + chull + "]";
		return s;
	}
	
	public JSONObject toJson() throws JSONException {
		JSONObject json = new JSONObject();
		json.put("n", cname);
		json.put("a", Integer.toString(cdamage_ammo));
		json.put("l", Integer.toString(cdamage_laser));
		json.put("p", Integer.toString(cdamage_particle));
		json.put("h", Integer.toString(chull));
		json.put("r", Integer.toString(carmor));
		json.put("s", Integer.toString(cshield));
		json.put("t", Integer.toString(ctype));
		json.put("u", cpicture);
		return json;
	}
}
