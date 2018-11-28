-- Program Name: main.sql
-- Assignment Name: Final Project
-- Author: Elizabeth Premer
-- Date Due: 18 March 2018
-- Description: queries


-- SELECT APPOINTMENTS
SELECT  client.name_first AS fname,
        client.name_last AS lname,
        date,
        time,
        therapist.name_first AS ther_name,
        service.service_name AS serv,
        location.location_name AS loc
FROM appointment
INNER JOIN client
ON appointment.client_id = client.client_id
INNER JOIN therapist
ON appointment.therapist_id = therapist.therapist_id
INNER JOIN service
ON appointment.service_id = service.service_id
INNER JOIN location
ON appointment.location_id = location.location_id
WHERE client.name_first = [client's first name], client.name_last = [client's last name];

-- SELECT QUERY TO SHOW
-- HOW MANY CLIENTS RECEIVE DEEP TISSUE MASSAGE AT LOCATION "STUDIO"
--    includes tables: CLIENT, SERVICE, LOCATION



-- SELECT QUERY TO SHOW
-- WHICH THERAPIST SEES THE MAJORITY OF CLIENTS
--    includes tables: THERAPIST, CLIENT

-- SELECT QUERY TO SHOW
-- WHICH CLIENTS ARE SEEN AT "MBO"
--    includes tables: CLIENT, LOCATION

-- SELECT QUERY TO SHOW
-- WHICH THERAPISTS ARE CERTIFIED IN "SWEDISH" MASSAGE
-- AND *NOT* IN DEEP TISSUE
--    includes tables: THERAPIST, CERTIFICATION, CERT_TYPE

-- QUERY TO SELECT
-- RANDOM UNIQUE ID FROM *ALL* CLIENTS
-- (RAFFLE WINNER, RANDOMLY SELECTED BY ID)
--    includes tables: CLIENT

-- SELECT QUERY TO
-- COMPILE ALL CLIENT EMAIL ADDRESSES INTO ONE LIST,
-- SEPARATED BY COMMAS
--    includes tables: CLIENT
