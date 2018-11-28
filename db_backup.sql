-- Program Name: main.sql
-- Assignment Name: Final Project
-- Author: Elizabeth Premer
-- Date Due: 18 March 2018
-- Description: table creation

DROP TABLE IF EXISTS `Clients`;
DROP TABLE IF EXISTS `Therapists`;
DROP TABLE IF EXISTS `Appointments`;
DROP TABLE IF EXISTS `Positions`;
DROP TABLE IF EXISTS `Certs`;
DROP TABLE IF EXISTS `Services`;
DROP TABLE IF EXISTS `Locations`;
DROP TABLE IF EXISTS `Therapists_services`;
DROP TABLE IF EXISTS `Therapists_positions`;
DROP TABLE IF EXISTS `Therapists_certs`;

CREATE TABLE `Clients` (
  `c_client_id` int(11) NOT NULL AUTO_INCREMENT,
  `c_name_first` varchar(255) NOT NULL,
  `c_name_last` varchar(255) NOT NULL,
  `email` varchar(50) NOT NULL,  -- validate in frontend in html
  `phone` int(11) NOT NULL,
  `address_st` varchar(255),
  `address_city` varchar(255),
  `address_state` varchar(255),
  `address_zip` int(5),
  `dob` date,
  PRIMARY KEY (`c_client_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `Therapists` (
  `t_therapist_id` int(11) NOT NULL AUTO_INCREMENT,
  `t_name_first` varchar(255) NOT NULL,
  `t_name_last` varchar(255) NOT NULL,
  PRIMARY KEY (`t_therapist_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `Services` (
  `s_service_id` int(11) NOT NULL AUTO_INCREMENT,
  `s_name` varchar(255) NOT NULL,
  PRIMARY KEY (`s_service_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `Appointments` (
  `a_visit_id` int(11) NOT NULL AUTO_INCREMENT,
  `a_client_id` int(11),
  `date` date NOT NULL,
  `time` time NOT NULL,
  `a_therapist_id` int(11) NOT NULL,
  `a_service_id` int(11) NOT NULL,
  `a_location_id` int(11) NOT NULL,
  PRIMARY KEY (`a_visit_id`), /* should prim key be combo of visit AND client ids? */
                              /* should client and visit ids be unique? does it matter? */
  FOREIGN KEY (`a_client_id`) REFERENCES `Clients` (`c_client_id`),
  FOREIGN KEY (`a_therapist_id`) REFERENCES `Therapists` (`t_therapist_id`),
  FOREIGN KEY (`a_service_id`) REFERENCES `Services` (`s_service_id`),
  FOREIGN KEY (`a_location_id`) REFERENCES `Locations` (`l_location_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `Locations` (
  `l_location_id` int(11) NOT NULL AUTO_INCREMENT,
  `l_name` varchar(255) NOT NULL,
  `address_st` varchar(255),
  `address_city` varchar(255),
  `address_state` varchar(255),
  `address_zip` varchar(255),
  PRIMARY KEY (`l_location_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `Certs` (
  `c_cert_id` int(11) NOT NULL AUTO_INCREMENT,
  `c_name` varchar(255) NOT NULL,
  PRIMARY KEY (`c_cert_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `Positions` (
  `p_position_id` int(11) NOT NULL AUTO_INCREMENT,
  `p_name` varchar(255) NOT NULL,
  PRIMARY KEY (`p_position_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `Therapists_services` (
  `ts_therapist_id` int(11),
  `ts_service_id` int(11),
  PRIMARY KEY (`ts_therapist_id`, `ts_service_id`),
  FOREIGN KEY (`ts_therapist_id`) REFERENCES `Therapists` (`t_therapist_id`) ON DELETE CASCADE,
  FOREIGN KEY (`ts_service_id`) REFERENCES `Services` (`s_service_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `Therapists_positions` (
  `tp_therapist_id` int(11),
  `tp_position_id` int(11),
  PRIMARY KEY (`tp_therapist_id`, `tp_position_id`),
  FOREIGN KEY (`tp_therapist_id`) REFERENCES `Therapists` (`t_therapist_id`) ON DELETE CASCADE,
  FOREIGN KEY (`tp_position_id`) REFERENCES `Positions` (`p_position_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `Therapists_certs` (
  `tc_therapist_id` int(11),
  `tc_cert_id` int(11),
  `date_acquired` date NOT NULL,
  `date_expires` date,
  PRIMARY KEY (`tc_therapist_id`, `tc_cert_id`),
  FOREIGN KEY (`tc_cert_id`) REFERENCES `Certs` (`c_cert_id`) ON DELETE CASCADE,
  FOREIGN KEY (`tc_therapist_id`) REFERENCES `Therapists` (`t_therapist_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


/*  PRE-POPULATED DATA */
-- insert the following into the client table:
INSERT INTO `Clients` (`c_name_first`, `c_name_last`, `email`, `phone`, `address_st`, `address_city`, `address_state`, `address_zip`, `dob`)
  VALUES ('Sara', 'Smith', 'sarasmiles@someaddress.com', '8055551234', '1358 20th Street', 'Oceano', 'CA', '93445', '1983-12-11');

INSERT INTO `Clients` (`c_name_first`, `c_name_last`, `email`, `phone`, `address_st`, `address_city`, `address_state`, `address_zip`, `dob`)
    VALUES ('Barbara', 'Jones', 'bababarbara.ann@someaddress.com', '8055552345', '1353 20th Street', 'Oceano', 'CA', '93445', '1991-01-21');

INSERT INTO `Clients` (`c_name_first`, `c_name_last`, `email`, `phone`, `address_st`, `address_city`, `address_state`, `address_zip`, `dob`)
      VALUES ('Danny', 'Angel', 'earth.angel@someaddress.com', '8055559876', '1531 Hillcrest Dr', 'Arroyo Grande', 'CA', '93420', '1989-06-19');

INSERT INTO `Clients` (`c_name_first`, `c_name_last`, `email`, `phone`, `address_st`, `address_city`, `address_state`, `address_zip`, `dob`)
        VALUES ('Katie', 'Smith', 'ktbug@someaddress.com', '8055556978', '1531 Hillcrest Dr', 'Arroyo Grande', 'CA', '93420', '1989-01-01');

INSERT INTO `Clients` (`c_name_first`, `c_name_last`, `email`, `phone`, `address_st`, `address_city`, `address_state`, `address_zip`, `dob`)
          VALUES ('Julia', 'Matthews', 'jules@someaddress.com', '8055552323', '1531 Hillcrest Dr', 'Arroyo Grande', 'CA', '93420', '1983-12-11');


-- insert the following into the therapist table
INSERT INTO `Therapists` (`t_name_first`, `t_name_last`) VALUES ('Lizzie', 'Premer');

INSERT INTO `Therapists` (`t_name_first`, `t_name_last`) VALUES ('Rebekah', 'Hughton');

INSERT INTO `Therapists` (`t_name_first`, `t_name_last`) VALUES ('Stanley', 'Baldwin');

-- insert the following into the certfication table:
INSERT INTO `Certs` (`c_name`) VALUES ('Ashiatsu');

INSERT INTO `Certs` (`c_name`) VALUES ('CAMTC');

INSERT INTO `Certs` (`c_name`) VALUES ('Deep Tissue');

-- insert the following into the service table:
INSERT INTO `Services` (`s_name`) VALUES ('Swedish');

INSERT INTO `Services` (`s_name`) VALUES ('Ashiatsu');

INSERT INTO `Services` (`s_name`) VALUES ('Deep Tissue');

INSERT INTO `Services` (`s_name`) VALUES ('Prenatal');


-- insert the following into the location table:
INSERT INTO `Locations` (`l_name`, `address_st`, `address_city`, `address_state`, `address_zip`)
  VALUES ('Studio', '825 El Capitan Way, Ste 18A', 'San Luis Obispo', 'CA', '93401');

INSERT INTO `Locations` (`l_name`, `address_st`, `address_city`, `address_state`, `address_zip`)
    VALUES ('MBO', '4051 Broad St', 'San Luis Obispo', 'CA', '93401');



-- insert the following into the position table:
INSERT INTO `Positions` (`p_name`) VALUES ('Owner');

INSERT INTO `Positions` (`p_name`) VALUES ('Massage Therapist');



-- insert into the therapist_service table:
INSERT INTO `Therapists_services` (`ts_therapist_id`, `ts_service_id`)
  VALUES ( (SELECT `t_therapist_id` FROM `Therapists` WHERE `t_name_first` = 'Lizzie'),
          (SELECT `s_service_id` FROM `Services` WHERE `s_name` = 'Ashiatsu'));

INSERT INTO `Therapists_services` (`ts_therapist_id`, `ts_service_id`)
  VALUES ( (SELECT `t_therapist_id` FROM `Therapists` WHERE `t_name_first` = 'Lizzie'),
          (SELECT `s_service_id` FROM `Services` WHERE `s_name` = 'Deep Tissue'));

INSERT INTO `Therapists_services` (`ts_therapist_id`, `ts_service_id`)
  VALUES ( (SELECT `t_therapist_id` FROM `Therapists` WHERE `t_name_first` = 'Rebekah'),
          (SELECT `s_service_id` FROM `Services` WHERE `s_name` = 'Deep Tissue'));


-- insert into the therapist_position table:
INSERT INTO `Therapists_positions` (`tp_therapist_id`, `tp_position_id`)
  VALUES ( (SELECT `t_therapist_id` FROM `Therapists` WHERE `t_name_first` = 'Lizzie'),
          (SELECT `p_position_id` FROM `Positions` WHERE `p_name` = 'Owner'));

INSERT INTO `Therapists_positions` (`tp_therapist_id`, `tp_position_id`)
  VALUES ( (SELECT `t_therapist_id` FROM `Therapists` WHERE `t_name_first` = 'Lizzie'),
          (SELECT `p_position_id` FROM `Positions` WHERE `p_name` = 'Massage Therapist'));

INSERT INTO `Therapists_positions` (`tp_therapist_id`, `tp_position_id`)
  VALUES ( (SELECT `t_therapist_id` FROM `Therapists` WHERE `t_name_first` = 'Rebekah'),
          (SELECT `p_position_id` FROM `Positions` WHERE `p_name` = 'Massage Therapist'));


-- insert into the therapist_certs tables
INSERT INTO `Therapists_certs` (`tc_therapist_id`, `tc_cert_id`, `date_acquired`, `date_expires`)
  VALUES ( (SELECT `t_therapist_id` FROM `Therapists` WHERE `t_name_first` = 'Lizzie'),
          (SELECT `c_cert_id` FROM `Certs` WHERE `c_name` = 'CAMTC'),
          '2014-05-15', '2019-05-14');

INSERT INTO `Therapists_certs` (`tc_therapist_id`, `tc_cert_id`, `date_acquired`)
  VALUES ( (SELECT `t_therapist_id` FROM `Therapists` WHERE `t_name_first` = 'Lizzie'),
          (SELECT `c_cert_id` FROM `Certs` WHERE `c_name` = 'Ashiatsu'),
          '2015-07-01'); -- NULL for date_expires?

          -- insert the following into the appointment table:

-- first visit of client 1 (Sara Smith), with therapist 1 (lizzie), for service 1 (swedish) in location 1 (studio)
INSERT INTO `Appointments` (`a_client_id`, `date`, `time`, `a_therapist_id`, `a_service_id`, `a_location_id`)
    VALUES ( (SELECT `c_client_id` FROM `Clients` WHERE `c_name_first` = 'Sara' AND `c_name_last` = 'Smith'), '2018-03-01', '12:30:00',
        (SELECT `t_therapist_id` FROM `Therapists` WHERE `t_name_first` = 'Lizzie' AND `t_name_last` = 'Premer'),
        (SELECT `s_service_id` FROM `Services` WHERE `s_name` = 'Swedish'),
        (SELECT `l_location_id` FROM `Locations` WHERE `l_name` = 'studio') );

-- second visit of client 1 (Sara Smith), with therapist 1 (lizzie), for service 1 (swedish) in location 1 (studio)
INSERT INTO `Appointments` (`a_client_id`, `date`, `time`, `a_therapist_id`, `a_service_id`, `a_location_id`)
    VALUES ( (SELECT `c_client_id` FROM `Clients` WHERE `c_name_first` = 'Sara' AND `c_name_last` = 'Smith'), '2018-03-11', '12:30:00',
        (SELECT `t_therapist_id` FROM `Therapists` WHERE `t_name_first` = 'Lizzie' AND `t_name_last` = 'Premer'),
        (SELECT `s_service_id` FROM `Services` WHERE `s_name` = 'Swedish'),
        (SELECT `l_location_id` FROM `Locations` WHERE `l_name` = 'studio') );

-- first visit of client 2 (Barbara Jones), with therapist 2 (rebekah), for service 2 (ashiatsu) in location 1 (studio)
INSERT INTO `Appointments` (`a_client_id`, `date`, `time`, `a_therapist_id`, `a_service_id`, `a_location_id`)
    VALUES ( (SELECT `c_client_id` FROM `Clients` WHERE `c_name_first` = 'Danny' AND `c_name_last` = 'Angel'), '2018-02-25', '14:30:00',
        (SELECT `t_therapist_id` FROM `Therapists` WHERE `t_name_first` = 'Rebekah' AND `t_name_last` = 'Hughton'),
        (SELECT `s_service_id` FROM `Services` WHERE `s_name` = 'Ashiatsu'),
        (SELECT `l_location_id` FROM `Locations` WHERE `l_name` = 'studio') );
