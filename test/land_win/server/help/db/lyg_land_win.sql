-- --------------------------------------------------------
-- 호스트:                          localhost
-- 서버 버전:                        11.2.0-MariaDB - mariadb.org binary distribution
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  12.3.0.6589
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- lyg_land_win 데이터베이스 구조 내보내기
CREATE DATABASE IF NOT EXISTS `lyg_land_win` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `lyg_land_win`;

-- 테이블 lyg_land_win.ba_login_token 구조 내보내기
CREATE TABLE IF NOT EXISTS `ba_login_token` (
  `token_id` varchar(100) NOT NULL COMMENT '토큰아이디',
  `token_user_seq` int(11) DEFAULT NULL COMMENT '유저키',
  `token_expire_date` datetime DEFAULT NULL COMMENT '만료일',
  `token_data` mediumtext DEFAULT NULL COMMENT '토큰데이터',
  `token_ip` varchar(30) DEFAULT NULL COMMENT '아이피',
  `token_server_ip` varchar(30) DEFAULT NULL COMMENT '서버아이피',
  `token_agent` varchar(50) DEFAULT NULL,
  `token_create_date` datetime DEFAULT NULL COMMENT '작성일',
  PRIMARY KEY (`token_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='로그인토큰';

-- 테이블 데이터 lyg_land_win.ba_login_token:~2 rows (대략적) 내보내기
DELETE FROM `ba_login_token`;
INSERT INTO `ba_login_token` (`token_id`, `token_user_seq`, `token_expire_date`, `token_data`, `token_ip`, `token_server_ip`, `token_agent`, `token_create_date`) VALUES
	('1_da5f6073-3d30-4a66-8157-67bdd9bc679a', 1, '2034-05-30 00:00:00', 'eyJ1c2VyX2luZm8iOnsiYV9zZXEiOjEsImFfdXNlcl9pZCI6Imx5ZyIsImFfdXNlcl9uYW1lIjoi66eI7Iqk7YSwIiwiYV91c2VyX25pY2tuYW1lIjoi66eI7Iqk7YSwIiwiYV91c2VyX3Bob25lIjoiIiwiYV9lbWFpbCI6IiIsImFfdXNlcl9ncmFkZSI6Im0ifX0=', '::1', 'localhost', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWeb', '2024-06-01 02:49:35'),
	('1_e9fac943-ab8a-43db-bd68-861da2a8f23a', 1, '2036-01-09 00:00:00', 'eyJ1c2VyX2luZm8iOnsiYV9zZXEiOjEsImFfdXNlcl9pZCI6Imx5ZyIsImFfdXNlcl9uYW1lIjoi66eI7Iqk7YSwIiwiYV91c2VyX25pY2tuYW1lIjoi66eI7Iqk7YSwIiwiYV91c2VyX3Bob25lIjoiIiwiYV9lbWFpbCI6IiIsImFfdXNlcl9ncmFkZSI6Im0ifX0=', '::1', 'localhost', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWeb', '2026-01-11 09:09:17');

-- 테이블 lyg_land_win.ba_user 구조 내보내기
CREATE TABLE IF NOT EXISTS `ba_user` (
  `user_seq` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '키값',
  `user_user_id` varchar(30) DEFAULT NULL COMMENT '아이디',
  `user_user_pw` varchar(200) DEFAULT NULL COMMENT '암호',
  `user_user_grade` varchar(1) DEFAULT NULL COMMENT '회원등급(m:마스터,c:일반)',
  `user_is_login` varchar(1) DEFAULT NULL COMMENT '로그인허용여부',
  `user_user_name` varchar(50) DEFAULT NULL COMMENT '이름',
  `user_user_nickname` varchar(50) DEFAULT NULL COMMENT '닉네임',
  `user_user_phone` varchar(30) DEFAULT NULL COMMENT '핸드폰',
  `user_email` varchar(100) DEFAULT NULL COMMENT '이메일',
  `user_last_login_date` datetime DEFAULT NULL COMMENT '마지막로그인',
  `user_login_cnt` int(10) unsigned DEFAULT NULL COMMENT '로그인수',
  `user_create_date` datetime DEFAULT NULL COMMENT '작성일',
  `user_update_date` datetime DEFAULT NULL COMMENT '수정일',
  `user_create_seq` int(10) unsigned DEFAULT NULL COMMENT '작성자',
  `user_update_seq` int(10) unsigned DEFAULT NULL COMMENT '수정자',
  PRIMARY KEY (`user_seq`) USING BTREE,
  UNIQUE KEY `user_user_id` (`user_user_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='회원';

-- 테이블 데이터 lyg_land_win.ba_user:~3 rows (대략적) 내보내기
DELETE FROM `ba_user`;
INSERT INTO `ba_user` (`user_seq`, `user_user_id`, `user_user_pw`, `user_user_grade`, `user_is_login`, `user_user_name`, `user_user_nickname`, `user_user_phone`, `user_email`, `user_last_login_date`, `user_login_cnt`, `user_create_date`, `user_update_date`, `user_create_seq`, `user_update_seq`) VALUES
	(1, 'lyg', '4FB5DCFF1E2825CFB154032A43E93903', 'm', '1', '마스터', '마스터', NULL, NULL, '2026-01-11 09:09:17', 61, NULL, '2026-01-11 09:09:17', NULL, NULL),
	(8, 'test', '0E655C3674C28287FC86CD52A2DB19C1', 'c', '1', 'test', 'test3', '', '', '2024-06-01 02:32:34', 1, '2024-05-18 19:59:42', '2024-06-01 02:32:34', 0, 0),
	(9, 'user', '19620EFD4D68F1AC4EDA659EF31B26AB', 'c', '1', '유저', '유', '', '', '2024-05-19 00:54:14', 1, '2024-05-19 00:47:34', '2024-05-19 00:54:14', 0, 0);

-- 테이블 lyg_land_win.test 구조 내보내기
CREATE TABLE IF NOT EXISTS `test` (
  `a` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='a';

-- 테이블 데이터 lyg_land_win.test:~0 rows (대략적) 내보내기
DELETE FROM `test`;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
