CREATE USER 'cube'@'localhost';
SET PASSWORD FOR 'cube'@'localhost' = PASSWORD('cube');

CREATE SCHEMA `cube` DEFAULT CHARACTER SET utf8 ;

DROP TABLE IF EXISTS `cube`.`top`;

CREATE TABLE `cube`.`top` (
	tid int(11) not null AUTO_INCREMENT COMMENT 'id',
	tnick varchar(40) CHARACTER SET utf8 COLLATE utf8_general_ci not null COMMENT '昵称',
    tlevel int(4) not null COMMENT '等级',
    tscore int(11) not null COMMENT '分数',
	tdesc varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '留言',
    primary key (`tid`),
    key (`tnick`)
) ENGINE = INNODB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '';

CREATE TABLE `cube`.`count` (
	tid int(1) not null default 0 COMMENT 'id',
    tcount int(11) not null COMMENT 'count',
    primary key (`tid`)
) ENGINE = INNODB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '';

insert into `cube`.`count` values(0, 0);

GRANT SELECT ON cube.* TO 'cube'@'localhost';
GRANT ALL on cube.* TO 'cube'@'localhost';
