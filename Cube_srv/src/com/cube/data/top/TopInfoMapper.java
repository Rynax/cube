package com.cube.data.top;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

public class TopInfoMapper implements RowMapper<TopInfoEntity> {
	public TopInfoEntity mapRow(ResultSet rs, int rownum) throws SQLException {
		TopInfoEntity card = new TopInfoEntity();
		card.set_tid(rs.getInt("tid"));
		card.set_tnick(rs.getString("tnick"));
		card.set_tlevel(rs.getInt("tlevel"));
		card.set_tscore(rs.getInt("tscore"));
		card.set_tdesc(rs.getString("tdesc"));
		return card;
	}
}
