package com.cube.data.count;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

public class CountInfoMapper implements RowMapper<CountInfoEntity> {
	public CountInfoEntity mapRow(ResultSet rs, int rownum) throws SQLException {
		CountInfoEntity card = new CountInfoEntity();
		card.set_tid(rs.getInt("tid"));
		card.set_tcount(rs.getInt("tcount"));
		return card;
	}
}
