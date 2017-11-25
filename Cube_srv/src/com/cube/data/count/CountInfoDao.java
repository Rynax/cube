package com.cube.data.count;

import java.util.List;

public interface CountInfoDao {
	public void add(CountInfoEntity p);
	public void update(CountInfoEntity p);
	public void delete(int id);
	public List<CountInfoEntity> find_by_id(int id);
	public List<CountInfoEntity> find_all();
}
