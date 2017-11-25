package com.cube.data.top;

import java.util.List;

public interface TopInfoDao {
	public void add(TopInfoEntity p);
	public void update(TopInfoEntity p);
	public void delete(int id);
	public List<TopInfoEntity> find_by_id(int id);
	public List<TopInfoEntity> find_all();
	public List<TopInfoEntity> find_top(int n);
	public List<TopInfoEntity> find_top_all();
}
