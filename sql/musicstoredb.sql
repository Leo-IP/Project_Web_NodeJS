-- phpMyAdmin SQL Dump
-- version 4.0.4.2
-- http://www.phpmyadmin.net
--
-- 主機: localhost
-- 產生日期: 2019 年 04 月 22 日 15:12
-- 伺服器版本: 5.6.13
-- PHP 版本: 5.4.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 資料庫: `musicstoredb`
--
CREATE DATABASE IF NOT EXISTS `musicstoredb` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `musicstoredb`;

-- --------------------------------------------------------

--
-- 表的結構 `adminaccounts`
--

CREATE TABLE IF NOT EXISTS `adminaccounts` (
  `AdminId` int(11) NOT NULL AUTO_INCREMENT,
  `Username` varchar(50) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `AddDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ModifyDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Flag` varchar(1) NOT NULL,
  PRIMARY KEY (`AdminId`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- 轉存資料表中的資料 `adminaccounts`
--

INSERT INTO `adminaccounts` (`AdminId`, `Username`, `Password`, `AddDate`, `ModifyDate`, `Flag`) VALUES
(1, 'admin1122', 'f792ae09104e6afbf9b9662d65637205', '2019-04-21 06:26:02', '2019-04-21 06:26:25', 'A');

-- --------------------------------------------------------

--
-- 表的結構 `albums`
--

CREATE TABLE IF NOT EXISTS `albums` (
  `AlbumId` int(11) NOT NULL AUTO_INCREMENT,
  `ProductId` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Description` varchar(255) NOT NULL,
  `Artist` varchar(50) NOT NULL,
  `Quantity` smallint(6) NOT NULL,
  `CoverImageFile` varchar(255) NOT NULL,
  `PriceOverride` smallint(6) NOT NULL,
  `AddDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ModifyDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Flag` varchar(1) NOT NULL,
  PRIMARY KEY (`AlbumId`),
  KEY `ProductId` (`ProductId`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=18 ;


-- --------------------------------------------------------

--
-- 表的結構 `creditcodes`
--

CREATE TABLE IF NOT EXISTS `creditcodes` (
  `CreditId` int(11) NOT NULL AUTO_INCREMENT,
  `Code` varchar(255) NOT NULL,
  `Amounts` smallint(6) NOT NULL,
  `AddDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ModifyDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Flag` varchar(1) NOT NULL,
  PRIMARY KEY (`CreditId`),
  UNIQUE KEY `Code` (`Code`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=14 ;

-- --------------------------------------------------------

--
-- 表的結構 `members`
--

CREATE TABLE IF NOT EXISTS `members` (
  `MemberId` int(11) NOT NULL AUTO_INCREMENT,
  `Email` varchar(50) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `FirstName` varchar(50) NOT NULL,
  `LastName` varchar(50) NOT NULL,
  `Phone` int(8) NOT NULL,
  `Birthday` date DEFAULT NULL,
  `Credits` mediumint(9) DEFAULT NULL,
  `LPoints` mediumint(9) DEFAULT NULL,
  `AddDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ModifyDate` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `Flag` varchar(1) NOT NULL,
  PRIMARY KEY (`MemberId`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

-- --------------------------------------------------------

--
-- 表的結構 `orders`
--

CREATE TABLE IF NOT EXISTS `orders` (
  `OrderId` int(11) NOT NULL AUTO_INCREMENT,
  `MemberId` int(11) NOT NULL,
  `ProductId` int(11) NOT NULL,
  `Cost` mediumint(9) NOT NULL,
  `PayBy` varchar(2) NOT NULL,
  `AddDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`OrderId`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=9 ;

-- --------------------------------------------------------

--
-- 表的結構 `products`
--

CREATE TABLE IF NOT EXISTS `products` (
  `ProductId` int(11) NOT NULL AUTO_INCREMENT,
  `ProductType` varchar(1) NOT NULL,
  `AddDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ProductId`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=22 ;

-- --------------------------------------------------------

--
-- 表的結構 `redeemrecords`
--

CREATE TABLE IF NOT EXISTS `redeemrecords` (
  `RedeemId` int(11) NOT NULL AUTO_INCREMENT,
  `CreditId` int(11) NOT NULL,
  `MemberId` int(11) NOT NULL,
  `AddDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`RedeemId`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

-- --------------------------------------------------------

--
-- 表的結構 `refundrequests`
--

CREATE TABLE IF NOT EXISTS `refundrequests` (
  `RefundId` int(11) NOT NULL AUTO_INCREMENT,
  `MemberId` int(11) NOT NULL,
  `OrderId` int(11) NOT NULL,
  `Approved` tinyint(1) NOT NULL,
  `AddDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ModifyDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`RefundId`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=13 ;

-- --------------------------------------------------------

--
-- 表的結構 `sessions`
--

CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- 表的結構 `songs`
--

CREATE TABLE IF NOT EXISTS `songs` (
  `SongId` int(11) NOT NULL AUTO_INCREMENT,
  `AlbumId` int(11) NOT NULL,
  `ProductId` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Price` smallint(6) NOT NULL,
  `Quantity` smallint(6) NOT NULL,
  `TrialVerFile` varchar(255) NOT NULL,
  `FullVerFile` varchar(255) NOT NULL,
  `AddDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ModifyDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `Flag` varchar(1) NOT NULL,
  PRIMARY KEY (`SongId`),
  KEY `AlbumId` (`AlbumId`),
  KEY `ProductId` (`ProductId`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=22 ;

--
-- 匯出資料表的 Constraints
--

--
-- 資料表的 Constraints `albums`
--
ALTER TABLE `albums`
  ADD CONSTRAINT `albums_ibfk_1` FOREIGN KEY (`ProductId`) REFERENCES `products` (`ProductId`);

--
-- 資料表的 Constraints `songs`
--
ALTER TABLE `songs`
  ADD CONSTRAINT `songs_ibfk_1` FOREIGN KEY (`AlbumId`) REFERENCES `albums` (`AlbumId`),
  ADD CONSTRAINT `songs_ibfk_2` FOREIGN KEY (`ProductId`) REFERENCES `products` (`ProductId`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
