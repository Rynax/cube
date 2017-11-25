package com.cube.data.count;

import java.util.List;

import org.springframework.jdbc.core.support.JdbcDaoSupport;

public class CountInfoDaoImpl extends JdbcDaoSupport implements CountInfoDao {
	@Override
	public void add(CountInfoEntity p) {
		String sql = "INSERT INTO `cube`.`count` VALUES(0, ?)";
		this.getJdbcTemplate().update(sql, p.get_tcount());
	}
	
	@Override
	public void update(CountInfoEntity p) {
		String sql = "UPDATE `cube`.`count` SET tcount=? WHERE tid=0";
		this.getJdbcTemplate().update(sql, p.get_tcount());
	}
	
	@Override
	public void delete(int id) {
		String sql = "DELETE FROM `cube`.`count` WHERE tid=?";
		this.getJdbcTemplate().update(sql, id);
	}
	
	@Override
	public List<CountInfoEntity> find_by_id(int id) {
		String sql = "SELECT * FROM `cube`.`count` WHERE tid=?";
		return this.getJdbcTemplate().query(sql, new Object[]{id}, new CountInfoMapper());
	}
	
	@Override
	public List<CountInfoEntity> find_all() {
		String sql = "SELECT * FROM `cube`.`count` ORDER BY tid";
		return this.getJdbcTemplate().query(sql, new CountInfoMapper());
	}
}
