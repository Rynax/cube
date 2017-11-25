package com.cube.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cube.data.count.CountInfoDaoImpl;
import com.cube.data.count.CountInfoEntity;
import com.cube.data.top.TopInfoDaoImpl;
import com.cube.data.top.TopInfoEntity;

@Controller
public class IndexController {
	@RequestMapping( value="/{in_html}.html")
	public String all_html(@PathVariable String in_html){
		return "/view/" + in_html + ".html";
	}
	
	@RequestMapping( value="/")
	public String web_root(){
		return "/view/index.html";
	}
	
	@RequestMapping(value="/count.do")
	@ResponseBody
	public String count(HttpServletRequest request) {
		@SuppressWarnings("resource")
		ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
		CountInfoDaoImpl cdao = (CountInfoDaoImpl)context.getBean("CountInfoDaoImpl");
		List<CountInfoEntity> clist = null;
		try {
			clist = cdao.find_by_id(0);
		} catch (DataAccessException e) {
			System.out.printf("exception: %s\n", e.toString());
			return "{\"code\":\"1\",\"desc\":\"数据库异常\"}";
		}
		if(clist == null || clist.size() == 0) {
			return "{\"code\":\"0\",\"desc\":\"\",\"data\":\"\"}";
		}
		clist.get(0).set_tcount(clist.get(0).get_tcount() + 1);
		cdao.update(clist.get(0));
		
		return "{\"code\":\"0\",\"desc\":\"\",\"c\":"+ clist.get(0).get_tcount() +"}";
	}
	
	@RequestMapping(value="/top.do")
	@ResponseBody
	public String top(HttpServletRequest request) {
		@SuppressWarnings("resource")
		ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
		TopInfoDaoImpl dao = (TopInfoDaoImpl)context.getBean("TopInfoDaoImpl");
		
		List<TopInfoEntity> list = null;
		try {
			list = dao.find_top(10);
		} catch (DataAccessException e) {
			System.out.printf("exception: %s\n", e.toString());
			return "{\"code\":\"1\",\"desc\":\"数据库异常\"}";
		}
		
		JSONArray arr = new JSONArray();
		int i = 0;
		int last_score = 0;
		int rank = 0;
		for(TopInfoEntity content : list) {
			i++;
			if(content.get_tscore() != last_score) {
				rank = i;
				last_score = content.get_tscore();
			}
			try {
				arr.put(content.toJson(rank));
			} catch (JSONException e) {
				System.out.printf("exception: %s\n", e.toString());
				return "{\"code\":\"1\",\"desc\":\"数据库异常\"}";
			}
		}
		
		JSONObject resp = new JSONObject();
		try {
			resp.put("code", "0");
			resp.put("desc", "");
			resp.put("data", arr);
		} catch (JSONException e) {
			System.out.printf("exception: %s\n", e.toString());
			return "{\"code\":\"1\",\"desc\":\"服务器异常\"}";
		}
		//System.out.printf("resp: %s\n", resp.toString());
		return resp.toString();
		//return "{\"code\":\"0\",\"desc\":\"\",\"data\":\"\"}";
	}
	
	@RequestMapping( value="/put.do")
	@ResponseBody
	public String put(HttpServletRequest request) {
		String info = request.getParameter("data");
		TopInfoEntity content = new TopInfoEntity();
		System.out.printf("info: %s\n", info);
		if(info == null) {
			return "{\"code\":\"1\",\"desc\":\"数据异常\",\"url\":\"\"}";
		}
		
		JSONObject jsonObj;
		try {
			jsonObj = new JSONObject(info);
			content.set_tnick(jsonObj.getString("n"));
			content.set_tlevel(Integer.parseInt(jsonObj.getString("l")));
			content.set_tscore(Integer.parseInt(jsonObj.getString("s")));
			content.set_tdesc(jsonObj.getString("d"));
		} catch (JSONException e) {
			System.out.printf("exception: %s\n", e.toString());
			return "{\"code\":\"1\",\"desc\":\"数据异常\",\"url\":\"\"}";
		}
		System.out.printf("content: %s\n", content.toString());
		@SuppressWarnings("resource")
		ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
		TopInfoDaoImpl dao = (TopInfoDaoImpl)context.getBean("TopInfoDaoImpl");
		
		dao.add(content);
		
		return "{\"code\":\"0\",\"desc\":\"上传成功\"}";
	}
}
