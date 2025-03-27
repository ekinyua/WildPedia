-- Set up the database context
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- Connect to the database
\connect biodiversity_db

-- Set search path
SET search_path TO public;
SELECT pg_catalog.set_config('search_path', 'public', false);

-- Insert data into taxonomic_keys
INSERT INTO public.taxonomic_keys VALUES (1, 'Plantae', 'KINGDOM', 6, NULL, '2025-02-20 10:25:21.892709');
INSERT INTO public.taxonomic_keys VALUES (2, 'Animalia', 'KINGDOM', 1, NULL, '2025-02-20 10:25:23.422261');
INSERT INTO public.taxonomic_keys VALUES (3, 'Mammalia', 'CLASS', 359, 1, '2025-02-20 10:25:23.904844');
INSERT INTO public.taxonomic_keys VALUES (4, 'Chordata', 'PHYLUM', 44, 1, '2025-02-20 10:25:25.412622');
INSERT INTO public.taxonomic_keys VALUES (5, 'Insecta', 'CLASS', 216, 1, '2025-02-20 10:25:26.917814');
INSERT INTO public.taxonomic_keys VALUES (6, 'Aves', 'CLASS', 212, 1, '2025-02-20 10:25:28.423642');
INSERT INTO public.taxonomic_keys VALUES (7, 'Amphibia', 'CLASS', 131, 1, '2025-02-20 10:25:29.933525');
INSERT INTO public.taxonomic_keys VALUES (17, 'Squamata', 'CLASS', 11592253, 44, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (18, 'Colubridae', 'FAMILY', 6172, NULL, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (19, 'Nerodia', 'GENUS', 2454456, 6172, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (23, 'Artiodactyla', 'ORDER', 731, 359, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (24, 'Cervidae', 'FAMILY', 5298, 731, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (25, 'Odocoileus', 'GENUS', 2440964, 5298, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (29, 'Carnivora', 'ORDER', 732, 359, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (30, 'Felidae', 'FAMILY', 9703, 732, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (31, 'Panthera', 'GENUS', 2435194, 9703, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (42, 'Bovidae', 'FAMILY', 9614, 731, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (43, 'Naemorhedus', 'GENUS', 2441009, 9614, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (48, 'Canidae', 'FAMILY', 9701, 732, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (49, 'Atelocynus', 'GENUS', 2434453, 9701, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (52, 'Testudines', 'CLASS', 11418114, 44, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (53, 'Trionychidae', 'FAMILY', 5469, NULL, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (54, 'Pelodiscus', 'GENUS', 7236986, 5469, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (60, 'Neotragus', 'GENUS', 2441070, 9614, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (66, 'Oreotragus', 'GENUS', 2441043, 9614, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (76, 'Suidae', 'FAMILY', 5302, 731, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (77, 'Phacochoerus', 'GENUS', 2441210, 5302, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (81, 'Scincidae', 'FAMILY', 9115, NULL, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (82, 'Trachylepis', 'GENUS', 3240904, 9115, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (85, 'Reptilia', 'CLASS', 358, 44, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (86, 'Squamata', 'ORDER', 715, 358, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (87, 'Lamprophiidae', 'FAMILY', 5789868, 715, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (88, 'Hemirhagerrhis', 'GENUS', 2459060, 5789868, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (94, 'Profelis', 'GENUS', 5219400, 9703, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (103, 'Accipitriformes', 'ORDER', 7191147, 212, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (104, 'Accipitridae', 'FAMILY', 2877, 7191147, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (105, 'Spizaetus', 'GENUS', 2480669, 2877, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (111, 'Accipiter', 'GENUS', 9405810, 2877, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (117, 'Capra', 'GENUS', 2441047, 9614, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (121, 'Lagomorpha', 'ORDER', 785, 359, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (122, 'Ochotonidae', 'FAMILY', 5467, 785, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (123, 'Ochotona', 'GENUS', 2436951, 5467, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (127, 'Rodentia', 'ORDER', 1459, 359, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (128, 'Muridae', 'FAMILY', 5510, 1459, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (129, 'Conilurus', 'GENUS', 2437958, 5510, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (135, 'Bison', 'GENUS', 2441175, 9614, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (139, 'Chiroptera', 'ORDER', 734, 359, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (140, 'Emballonuridae', 'FAMILY', 9615, 734, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (141, 'Cormura', 'GENUS', 2433101, 9615, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (147, 'Dorcatragus', 'GENUS', 2441196, 9614, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (151, 'Gruiformes', 'ORDER', 1493, 212, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (152, 'Rallidae', 'FAMILY', 9342, 1493, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (153, 'Aenigmatolimnas', 'GENUS', 2474652, 9342, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (157, 'Lacertidae', 'FAMILY', 5201, NULL, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (158, 'Thermophilus', 'GENUS', 2468992, 5201, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (164, 'Circaetus', 'GENUS', 2480661, 2877, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (168, 'Apodiformes', 'ORDER', 1448, 212, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (169, 'Apodidae', 'FAMILY', 2993, 1448, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys VALUES (170, 'Apus', 'GENUS', 2235048, 2993, '2025-03-06 01:48:23.938728');

-- Insert data into species
-- INSERT INTO public.species VALUES (400, '98053677_1_null', 98053677, 'Canis familiaris', '{Dog}', 'Animalia', 1, NULL, NULL, 'Mammalia', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Domestic dogs thrive in a variety of human-made environments—from bustling urban settings and suburban neighborhoods to rural farms and remote regions around the globe. Found in: Households worldwide, as well as in shelters, community spaces, and even as feral populations in some areas', 'Least Concern', 'The domestic dog (Canis lupus familiaris) is a highly versatile and widely beloved animal, renowned for its loyalty, intelligence, and adaptability. Descended from the gray wolf, dogs have been selectively bred over thousands of years, resulting in a vast array of breeds that vary dramatically in size, coat type, and temperament. Their acute senses—especially smell and hearing—coupled with their sociable nature, have made them excellent companions and invaluable working animals in roles ranging from herding and hunting to service and protection.', 'https://wildpedia-species-images.s3.us-east-1.amazonaws.com/species-images/1742657521444-250709844.webp', 'user_uploaded', '2025-03-20 16:31:03.516362', '2025-03-22 17:32:07.031514', NULL, NULL);

-- Insert data into users
INSERT INTO public.users VALUES (5, '{}', 'e.kinyua@alustudent.com', 'GOOGLE_AUTH', 'user', true, true, '2025-03-07 16:54:18.304769', '2025-03-07 16:54:18.216181', '2025-03-07 16:54:18.304769', '114969225431350522416', 'https://lh3.googleusercontent.com/a/ACg8ocIIUWyfjLkfN0ehLaKo8nITJ1mMh-vWxYpwriYNC6hpVrotmGU=s96-c');
INSERT INTO public.users VALUES (3, 'kenyua', 'kinyua0007@gmail.com', '$2b$10$Yadf/dEUq/zUQWaz2hlWAO0jmm7VAODshjB2HgU3fX3zDyOD/yGKK', 'user', true, false, '2025-03-22 11:01:23.964111', '2025-02-20 13:10:04.564812', '2025-03-22 11:01:23.964111', NULL, 'http://localhost:5000/uploads/profiles/profile-3-1742297314210-882729355.jpeg');
INSERT INTO public.users VALUES (4, 'elvis', 'vulgenceelvis@gmail.com', '$2b$10$uswf150Ls3vQdKmocsSnZOu/yjs9C3zrccHdu3CLhwNxr677iRxdi', 'admin', true, false, '2025-03-22 13:10:00.677011', '2025-02-21 13:44:59.918091', '2025-03-22 13:10:00.677011', '114625478163443473340', 'http://localhost:5000/uploads/profiles/profile-4-1742385790170-639534764.jpeg');

-- Insert data into user_profiles
INSERT INTO public.user_profiles VALUES (3, 'Kenyua Scholar', NULL, 'Nairobi', 'Tsavo Trust', 'Student', '2025-02-20 13:10:04.574617', '2025-02-20 13:10:04.574617');
INSERT INTO public.user_profiles VALUES (5, 'postgres Kinyua', NULL, NULL, NULL, NULL, '2025-03-07 16:54:18.2609', '2025-03-07 16:54:18.2609');

-- Insert data into user_stats
INSERT INTO public.user_stats VALUES (5, 0, 0, 0, '[]', '2025-03-07 16:54:22.829266+02', '2025-03-07 16:54:22.829266+02');
INSERT INTO public.user_stats VALUES (4, 180, 7, 18, '[{"name": "Quiz Novice", "type": "quiz_5", "awarded_at": "2025-03-13T10:34:29.143Z", "description": "Completed 5 quizzes"}]', '2025-03-07 15:30:58.87151+02', '2025-03-14 16:51:07.019723+02');
INSERT INTO public.user_stats VALUES (3, 40, 2, 4, '[]', '2025-03-17 15:07:42.429613+02', '2025-03-18 13:32:04.105242+02');

-- Insert data into cultural_content
INSERT INTO public.cultural_content VALUES (7, '5220063_1_359', 'myth', 'Spiritual Guardians', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'en', NULL, 4, 'pending', '2025-03-17 01:58:43.543705+02', '2025-03-18 13:24:58.964357+02', NULL, 0, 1, NULL);
INSERT INTO public.cultural_content VALUES (6, '2436448_1_359', 'myth', 'Gorilla', 'We used to pray to them', 'en', NULL, 4, 'pending', '2025-03-13 12:11:31.732558+02', '2025-03-19 12:12:24.060083+02', NULL, 1, 0, NULL);
INSERT INTO public.cultural_content VALUES (8, '5220063_1_359', 'myth', 'Spiritual Guides', 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', 'en', NULL, 4, 'approved', '2025-03-17 02:21:50.714173+02', '2025-03-19 14:02:50.824823+02', NULL, 1, 1, NULL);
INSERT INTO public.cultural_content VALUES (9, '5220063_1_359', 'proverb', 'Hyena Rwanda proverb', 'A hyena in sheep''s clothing still hunts at dawn', 'en', '', 4, 'approved', '2025-03-17 14:21:16.502409+02', '2025-03-19 14:13:56.586969+02', 4, 2, 0, NULL);
INSERT INTO public.cultural_content VALUES (4, '5220063_1_359', 'myth', 'Test Title', 'This is test content that is at least 9 characters', 'en', 'Test source', 4, 'rejected', '2025-03-08 19:13:12.664744+02', '2025-03-22 12:29:15.136348+02', 4, 1, 0, '2025-03-19 15:02:49.963335+02');
INSERT INTO public.cultural_content VALUES (5, '2436124_1_359', 'myth', 'Mountain Gorilla Legend', 'According to Rwandan folklore, mountain gorillas were once humans who were turned into apes for their laziness.', 'en', 'Local elders', 3, 'approved', '2025-03-13 11:46:52.129643+02', '2025-03-22 12:29:23.222044+02', 4, 0, 0, NULL);

-- Insert data into cultural_content_history
INSERT INTO public.cultural_content_history VALUES (4, 4, 4, 'create', NULL, 'pending', NULL, 'This is test content that is at least 10 characters', '2025-03-08 19:13:12.664744+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (5, 5, 3, 'create', NULL, 'pending', NULL, 'According to Rwandan folklore, mountain gorillas were once humans who were turned into apes for their laziness.', '2025-03-13 11:46:52.129643+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (6, 6, 4, 'create', NULL, 'pending', NULL, 'We used to pray to them', '2025-03-13 12:11:31.732558+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (7, 7, 4, 'create', NULL, 'pending', NULL, 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 01:58:43.543705+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (8, 8, 4, 'create', NULL, 'approved', NULL, 'In some parts of Kenya, such as among the Tugen people, hyenas are viewed as spiritual guardians. They are believed to help the dead transition into the afterlife, ensuring that the deceased can move on properly', '2025-03-17 02:21:50.714173+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (143, 4, 4, 'status_change', 'pending', 'rejected', 'This is test content that is at least 9 characters', 'This is test content that is at least 9 characters', '2025-03-22 12:29:15.136348+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (144, 4, 4, 'status_change', 'pending', 'rejected', NULL, NULL, '2025-03-22 12:29:15.136348+02', 'this is test content', NULL);
INSERT INTO public.cultural_content_history VALUES (145, 5, 4, 'status_change', 'pending', 'approved', 'According to Rwandan folklore, mountain gorillas were once humans who were turned into apes for their laziness.', 'According to Rwandan folklore, mountain gorillas were once humans who were turned into apes for their laziness.', '2025-03-22 12:29:23.222044+02', NULL, NULL);
INSERT INTO public.cultural_content_history VALUES (146, 5, 4, 'status_change', 'pending', 'approved', NULL, NULL, '2025-03-22 12:29:23.222044+02', NULL, NULL);

-- Insert data into cultural_content_votes
INSERT INTO public.cultural_content_votes VALUES (43, 6, 4, '2025-03-19 12:12:24.060083+02', 'up');
INSERT INTO public.cultural_content_votes VALUES (45, 8, 3, '2025-03-19 14:02:50.824823+02', 'up');
INSERT INTO public.cultural_content_votes VALUES (28, 7, 4, '2025-03-17 14:10:42.132703+02', 'down');
INSERT INTO public.cultural_content_votes VALUES (30, 8, 4, '2025-03-17 14:10:46.001562+02', 'down');
INSERT INTO public.cultural_content_votes VALUES (25, 4, 4, '2025-03-17 14:10:26.150269+02', 'up');
INSERT INTO public.cultural_content_votes VALUES (33, 9, 4, '2025-03-17 14:27:52.803479+02', 'up');
INSERT INTO public.cultural_content_votes VALUES (39, 9, 3, '2025-03-17 16:16:54.163947+02', 'up');

-- Insert data into debug_species_ids
INSERT INTO public.debug_species_ids VALUES (1, '2436124_1_359', '2025-03-13 11:46:52.096288');
INSERT INTO public.debug_species_ids VALUES (2, '2436448_1_359', '2025-03-13 12:11:31.719848');
INSERT INTO public.debug_species_ids VALUES (3, '5220063_1_359', '2025-03-17 01:58:43.516982');
INSERT INTO public.debug_species_ids VALUES (4, '5220063_1_359', '2025-03-17 02:21:50.699237');
INSERT INTO public.debug_species_ids VALUES (5, '5220063_1_359', '2025-03-17 14:21:16.475953');

-- Insert data into search_history
INSERT INTO public.search_history VALUES (1, 'lion', NULL, '4c1p0fnf5sc', '::1', 1, '2025-03-22 12:11:20.163342+02');
INSERT INTO public.search_history VALUES (2, 'cheetah', NULL, '4c1p0fnf5sc', '::1', 1, '2025-03-22 12:11:44.456025+02');
INSERT INTO public.search_history VALUES (3, 'lion', NULL, '4c1p0fnf5sc', '::1', 1, '2025-03-22 12:11:58.040159+02');
INSERT INTO public.search_history VALUES (4, 'lion', NULL, '4c1p0fnf5sc', '::1', 1, '2025-03-22 12:29:20.662124+02');
INSERT INTO public.search_history VALUES (5, 'lion', NULL, '4c1p0fnf5sc', '::1', 1, '2025-03-22 12:29:20.663746+02');

-- Insert data into species_views
INSERT INTO public.species_views VALUES (4, '5220013_1_359', NULL, '4c1p0fnf5sc', '::1', '2025-03-22 11:30:37.829869+02');
INSERT INTO public.species_views VALUES (3, '5220013_1_359', NULL, '4c1p0fnf5sc', '::1', '2025-03-22 11:30:36.370219+02');
INSERT INTO public.species_views VALUES (5, '5220013_1_359', NULL, '4c1p0fnf5sc', '::1', '2025-03-22 11:31:29.596151+02');
INSERT INTO public.species_views VALUES (6, '5220013_1_359', NULL, '4c1p0fnf5sc', '::1', '2025-03-22 11:31:29.697453+02');
INSERT INTO public.species_views VALUES (7, '5481342_1_359', NULL, '4c1p0fnf5sc', '::1', '2025-03-22 11:31:44.372993+02');
INSERT INTO public.species_views VALUES (8, '5481342_1_359', NULL, '4c1p0fnf5sc', '::1', '2025-03-22 11:31:44.377632+02');
INSERT INTO public.species_views VALUES (9, '5481342_1_359', NULL, '4c1p0fnf5sc', '::1', '2025-03-22 11:37:48.402126+02');
INSERT INTO public.species_views VALUES (10, '8659814_1_359', NULL, '4c1p0fnf5sc', '::1', '2025-03-22 11:37:53.214822+02');
INSERT INTO public.species_views VALUES (11, '5218799_1_359', NULL, '4c1p0fnf5sc', '::1', '2025-03-22 11:56:55.950621+02');
INSERT INTO public.species_views VALUES (12, '2436448_1_359', NULL, '4c1p0fnf5sc', '::1', '2025-03-22 12:29:36.757144+02');
INSERT INTO public.species_views VALUES (13, '98053677_1_null', NULL, 'owc9t2fri3', '::1', '2025-03-22 17:21:58.973574+02');
INSERT INTO public.species_views VALUES (14, '2437933_1_359', NULL, 'owc9t2fri3', '::1', '2025-03-22 17:22:15.522521+02');
INSERT INTO public.species_views VALUES (15, '98053677_1_null', NULL, 'owc9t2fri3', '::1', '2025-03-22 17:22:24.838875+02');
INSERT INTO public.species_views VALUES (16, '2440946_1_359', NULL, 'owc9t2fri3', '::1', '2025-03-22 17:22:36.664636+02');
INSERT INTO public.species_views VALUES (17, '98053677_1_null', NULL, 'owc9t2fri3', '::1', '2025-03-22 17:24:51.972337+02');
INSERT INTO public.species_views VALUES (18, '98053677_1_null', NULL, '4c1p0fnf5sc', '::1', '2025-03-22 17:30:49.187825+02');
INSERT INTO public.species_views VALUES (19, '98053677_1_null', NULL, '4c1p0fnf5sc', '::1', '2025-03-22 17:32:11.452318+02');
INSERT INTO public.species_views VALUES (20, '2436246_1_359', NULL, '4c1p0fnf5sc', '::1', '2025-03-22 17:32:33.363332+02');
INSERT INTO public.species_views VALUES (21, '98053677_1_null', NULL, '4c1p0fnf5sc', '::1', '2025-03-22 17:32:37.850619+02');

-- Set sequence values
SELECT pg_catalog.setval('public.cultural_content_history_id_seq', 146, true);
SELECT pg_catalog.setval('public.cultural_content_id_seq', 9, true);
SELECT pg_catalog.setval('public.cultural_content_votes_id_seq', 45, true);
SELECT pg_catalog.setval('public.debug_species_ids_id_seq', 5, true);
SELECT pg_catalog.setval('public.password_reset_tokens_id_seq', 1, true);
SELECT pg_catalog.setval('public.search_history_id_seq', 5, true);
SELECT pg_catalog.setval('public.species_facts_history_id_seq', 1, true);
SELECT pg_catalog.setval('public.species_facts_id_seq', 1, true);
SELECT pg_catalog.setval('public.species_id_seq', 400, true);
SELECT pg_catalog.setval('public.species_views_id_seq', 21, true);
SELECT pg_catalog.setval('public.taxonomic_keys_id_seq', 170, true);
SELECT pg_catalog.setval('public.users_id_seq', 5, true);
SELECT pg_catalog.setval('public.verification_tokens_id_seq', 1, true);