package com.cube.data.top;

import java.util.List;

import org.springframework.jdbc.core.support.JdbcDaoSupport;

public class TopInfoDaoImpl extends JdbcDaoSupport implements TopInfoDao {
	@Override
	public void add(TopInfoEntity p) {
		String sql = "INSERT INTO `cube`.`top` VALUES(null, ?, ?, ?, ?)";
		this.getJdbcTemplate().update(sql, p.get_tnick(), p.get_tlevel(), p.get_tscore(), p.get_tdesc());
	}
	
	@Override
	public void update(TopInfoEntity p) {
		String sql = "UPDATE `cube`.`top` SET tnick=?, tlevel=?, tscore=?, tdesc=? WHERE tid=?";
		this.getJdbcTemplate().update(sql, p.get_tnick(), p.get_tlevel(), p.get_tscore(), p.get_tdesc(), p.get_tid());
	}
	
	@Override
	public void delete(int id) {
		String sql = "DELETE FROM `cube`.`top` WHERE tid=?";
		this.getJdbcTemplate().update(sql, id);
	}
	
	@Override
	public List<TopInfoEntity> find_by_id(int id) {
		String sql = "SELECT * FROM `cube`.`top` WHERE tid=?";
		return this.getJdbcTemplate().query(sql, new Object[]{id}, new TopInfoMapper());
	}
	
	@Override
	public List<TopInfoEntity> find_all() {
		String sql = "SELECT * FROM `cube`.`top` ORDER BY tid";
		return this.getJdbcTemplate().query(sql, new TopInfoMapper());
	}
	
	@Override
	public List<TopInfoEntity> find_top(int n) {
		String sql = "SELECT * FROM `cube`.`top` ORDER BY tscore desc LIMIT ?";
		return this.getJdbcTemplate().query(sql, new Object[]{n}, new TopInfoMapper());
	}
	
	@Override
	public List<TopInfoEntity> find_top_all() {
		String sql = "SELECT * FROM `cube`.`top` ORDER BY tscore desc";
		return this.getJdbcTemplate().query(sql, new TopInfoMapper());
	}
}
