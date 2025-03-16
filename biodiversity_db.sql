--
-- PostgreSQL database dump
--

-- Dumped from database version 17.3
-- Dumped by pg_dump version 17.3

-- Started on 2025-03-14 17:38:50

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE IF EXISTS biodiversity_db;
--
-- TOC entry 5092 (class 1262 OID 16552)
-- Name: biodiversity_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE biodiversity_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en-US';


ALTER DATABASE biodiversity_db OWNER TO postgres;

\connect biodiversity_db

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5082 (class 0 OID 17180)
-- Dependencies: 241
-- Data for Name: cultural_content; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.cultural_content (id, species_id, content_type, title, content, language, source, author_id, status, created_at, updated_at, last_modified_by) VALUES (4, '5220063_1_359', 'myth', 'Test Title', 'This is test content that is at least 10 characters', 'en', 'Test source', 4, 'pending', '2025-03-08 19:13:12.664744+02', '2025-03-08 19:13:12.664744+02', NULL);
INSERT INTO public.cultural_content (id, species_id, content_type, title, content, language, source, author_id, status, created_at, updated_at, last_modified_by) VALUES (5, '2436124_1_359', 'myth', 'Mountain Gorilla Legend', 'According to Rwandan folklore, mountain gorillas were once humans who were turned into apes for their laziness.', 'en', 'Local elders', 3, 'pending', '2025-03-13 11:46:52.129643+02', '2025-03-13 11:46:52.129643+02', NULL);
INSERT INTO public.cultural_content (id, species_id, content_type, title, content, language, source, author_id, status, created_at, updated_at, last_modified_by) VALUES (6, '2436448_1_359', 'myth', 'Gorilla', 'We used to pray to them', 'en', NULL, 4, 'pending', '2025-03-13 12:11:31.732558+02', '2025-03-13 12:11:31.732558+02', NULL);


--
-- TOC entry 5084 (class 0 OID 17209)
-- Dependencies: 243
-- Data for Name: cultural_content_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.cultural_content_history (id, content_id, modified_by, modification_type, old_status, new_status, old_content, new_content, modified_at, reason) VALUES (4, 4, 4, 'create', NULL, 'pending', NULL, 'This is test content that is at least 10 characters', '2025-03-08 19:13:12.664744+02', NULL);
INSERT INTO public.cultural_content_history (id, content_id, modified_by, modification_type, old_status, new_status, old_content, new_content, modified_at, reason) VALUES (5, 5, 3, 'create', NULL, 'pending', NULL, 'According to Rwandan folklore, mountain gorillas were once humans who were turned into apes for their laziness.', '2025-03-13 11:46:52.129643+02', NULL);
INSERT INTO public.cultural_content_history (id, content_id, modified_by, modification_type, old_status, new_status, old_content, new_content, modified_at, reason) VALUES (6, 6, 4, 'create', NULL, 'pending', NULL, 'We used to pray to them', '2025-03-13 12:11:31.732558+02', NULL);


--
-- TOC entry 5086 (class 0 OID 17236)
-- Dependencies: 245
-- Data for Name: debug_species_ids; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.debug_species_ids (id, submitted_id, "timestamp") VALUES (1, '2436124_1_359', '2025-03-13 11:46:52.096288');
INSERT INTO public.debug_species_ids (id, submitted_id, "timestamp") VALUES (2, '2436448_1_359', '2025-03-13 12:11:31.719848');


--
-- TOC entry 5073 (class 0 OID 16914)
-- Dependencies: 231
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5068 (class 0 OID 16790)
-- Dependencies: 226
-- Data for Name: species; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5077 (class 0 OID 17052)
-- Dependencies: 235
-- Data for Name: species_facts; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5079 (class 0 OID 17079)
-- Dependencies: 237
-- Data for Name: species_facts_history; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5066 (class 0 OID 16775)
-- Dependencies: 224
-- Data for Name: taxonomic_keys; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (1, 'Plantae', 'KINGDOM', 6, NULL, '2025-02-20 10:25:21.892709');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (2, 'Animalia', 'KINGDOM', 1, NULL, '2025-02-20 10:25:23.422261');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (3, 'Mammalia', 'CLASS', 359, 1, '2025-02-20 10:25:23.904844');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (4, 'Chordata', 'PHYLUM', 44, 1, '2025-02-20 10:25:25.412622');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (5, 'Insecta', 'CLASS', 216, 1, '2025-02-20 10:25:26.917814');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (6, 'Aves', 'CLASS', 212, 1, '2025-02-20 10:25:28.423642');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (7, 'Amphibia', 'CLASS', 131, 1, '2025-02-20 10:25:29.933525');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (17, 'Squamata', 'CLASS', 11592253, 44, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (18, 'Colubridae', 'FAMILY', 6172, NULL, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (19, 'Nerodia', 'GENUS', 2454456, 6172, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (23, 'Artiodactyla', 'ORDER', 731, 359, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (24, 'Cervidae', 'FAMILY', 5298, 731, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (25, 'Odocoileus', 'GENUS', 2440964, 5298, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (29, 'Carnivora', 'ORDER', 732, 359, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (30, 'Felidae', 'FAMILY', 9703, 732, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (31, 'Panthera', 'GENUS', 2435194, 9703, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (42, 'Bovidae', 'FAMILY', 9614, 731, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (43, 'Naemorhedus', 'GENUS', 2441009, 9614, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (48, 'Canidae', 'FAMILY', 9701, 732, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (49, 'Atelocynus', 'GENUS', 2434453, 9701, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (52, 'Testudines', 'CLASS', 11418114, 44, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (53, 'Trionychidae', 'FAMILY', 5469, NULL, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (54, 'Pelodiscus', 'GENUS', 7236986, 5469, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (60, 'Neotragus', 'GENUS', 2441070, 9614, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (66, 'Oreotragus', 'GENUS', 2441043, 9614, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (76, 'Suidae', 'FAMILY', 5302, 731, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (77, 'Phacochoerus', 'GENUS', 2441210, 5302, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (81, 'Scincidae', 'FAMILY', 9115, NULL, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (82, 'Trachylepis', 'GENUS', 3240904, 9115, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (85, 'Reptilia', 'CLASS', 358, 44, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (86, 'Squamata', 'ORDER', 715, 358, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (87, 'Lamprophiidae', 'FAMILY', 5789868, 715, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (88, 'Hemirhagerrhis', 'GENUS', 2459060, 5789868, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (94, 'Profelis', 'GENUS', 5219400, 9703, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (103, 'Accipitriformes', 'ORDER', 7191147, 212, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (104, 'Accipitridae', 'FAMILY', 2877, 7191147, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (105, 'Spizaetus', 'GENUS', 2480669, 2877, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (111, 'Accipiter', 'GENUS', 9405810, 2877, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (117, 'Capra', 'GENUS', 2441047, 9614, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (121, 'Lagomorpha', 'ORDER', 785, 359, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (122, 'Ochotonidae', 'FAMILY', 5467, 785, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (123, 'Ochotona', 'GENUS', 2436951, 5467, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (127, 'Rodentia', 'ORDER', 1459, 359, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (128, 'Muridae', 'FAMILY', 5510, 1459, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (129, 'Conilurus', 'GENUS', 2437958, 5510, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (135, 'Bison', 'GENUS', 2441175, 9614, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (139, 'Chiroptera', 'ORDER', 734, 359, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (140, 'Emballonuridae', 'FAMILY', 9615, 734, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (141, 'Cormura', 'GENUS', 2433101, 9615, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (147, 'Dorcatragus', 'GENUS', 2441196, 9614, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (151, 'Gruiformes', 'ORDER', 1493, 212, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (152, 'Rallidae', 'FAMILY', 9342, 1493, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (153, 'Aenigmatolimnas', 'GENUS', 2474652, 9342, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (157, 'Lacertidae', 'FAMILY', 5201, NULL, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (158, 'Thermophilus', 'GENUS', 2468992, 5201, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (164, 'Circaetus', 'GENUS', 2480661, 2877, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (168, 'Apodiformes', 'ORDER', 1448, 212, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (169, 'Apodidae', 'FAMILY', 2993, 1448, '2025-03-06 01:48:23.938728');
INSERT INTO public.taxonomic_keys (id, name, rank, taxon_key, parent_key, created_at) VALUES (170, 'Apus', 'GENUS', 2235048, 2993, '2025-03-06 01:48:23.938728');


--
-- TOC entry 5071 (class 0 OID 16899)
-- Dependencies: 229
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.user_profiles (user_id, full_name, bio, location, organization, expertise_area, created_at, updated_at) VALUES (3, 'Kenyua Scholar', NULL, 'Nairobi', 'Tsavo Trust', 'Student', '2025-02-20 13:10:04.574617', '2025-02-20 13:10:04.574617');
INSERT INTO public.user_profiles (user_id, full_name, bio, location, organization, expertise_area, created_at, updated_at) VALUES (5, 'Elvis Kinyua', NULL, NULL, NULL, NULL, '2025-03-07 16:54:18.2609', '2025-03-07 16:54:18.2609');


--
-- TOC entry 5080 (class 0 OID 17158)
-- Dependencies: 239
-- Data for Name: user_stats; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.user_stats (user_id, xp, quizzes_completed, correct_answers, badges, created_at, updated_at) VALUES (5, 0, 0, 0, '[]', '2025-03-07 16:54:22.829266+02', '2025-03-07 16:54:22.829266+02');
INSERT INTO public.user_stats (user_id, xp, quizzes_completed, correct_answers, badges, created_at, updated_at) VALUES (4, 180, 7, 18, '[{"name": "Quiz Novice", "type": "quiz_5", "awarded_at": "2025-03-13T10:34:29.143Z", "description": "Completed 5 quizzes"}]', '2025-03-07 15:30:58.87151+02', '2025-03-14 16:51:07.019723+02');


--
-- TOC entry 5070 (class 0 OID 16882)
-- Dependencies: 228
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users (id, username, email, password_hash, role, is_active, email_verified, last_login, created_at, updated_at, google_id, profile_image_url) VALUES (4, 'elvis', 'vulgenceelvis@gmail.com', '$2b$10$uswf150Ls3vQdKmocsSnZOu/yjs9C3zrccHdu3CLhwNxr677iRxdi', 'admin', true, false, '2025-03-14 01:31:50.65277', '2025-02-21 13:44:59.918091', '2025-03-14 12:23:33.575535', '114625478163443473340', 'http://localhost:5000/uploads/profiles/profile-4-1741947813569-531175089.jpeg');
INSERT INTO public.users (id, username, email, password_hash, role, is_active, email_verified, last_login, created_at, updated_at, google_id, profile_image_url) VALUES (5, '{}', 'e.kinyua@alustudent.com', 'GOOGLE_AUTH', 'user', true, true, '2025-03-07 16:54:18.304769', '2025-03-07 16:54:18.216181', '2025-03-07 16:54:18.304769', '114969225431350522416', 'https://lh3.googleusercontent.com/a/ACg8ocIIUWyfjLkfN0ehLaKo8nITJ1mMh-vWxYpwriYNC6hpVrotmGU=s96-c');
INSERT INTO public.users (id, username, email, password_hash, role, is_active, email_verified, last_login, created_at, updated_at, google_id, profile_image_url) VALUES (3, 'kenyua', 'kinyua0007@gmail.com', '$2b$10$Yadf/dEUq/zUQWaz2hlWAO0jmm7VAODshjB2HgU3fX3zDyOD/yGKK', 'user', true, false, '2025-03-13 11:27:14.921801', '2025-02-20 13:10:04.564812', '2025-03-13 11:27:14.921801', NULL, NULL);


--
-- TOC entry 5075 (class 0 OID 16927)
-- Dependencies: 233
-- Data for Name: verification_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5106 (class 0 OID 0)
-- Dependencies: 242
-- Name: cultural_content_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cultural_content_history_id_seq', 6, true);


--
-- TOC entry 5107 (class 0 OID 0)
-- Dependencies: 240
-- Name: cultural_content_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cultural_content_id_seq', 6, true);


--
-- TOC entry 5108 (class 0 OID 0)
-- Dependencies: 244
-- Name: debug_species_ids_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.debug_species_ids_id_seq', 2, true);


--
-- TOC entry 5109 (class 0 OID 0)
-- Dependencies: 230
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.password_reset_tokens_id_seq', 1, false);


--
-- TOC entry 5110 (class 0 OID 0)
-- Dependencies: 236
-- Name: species_facts_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.species_facts_history_id_seq', 1, false);


--
-- TOC entry 5111 (class 0 OID 0)
-- Dependencies: 234
-- Name: species_facts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.species_facts_id_seq', 1, false);


--
-- TOC entry 5112 (class 0 OID 0)
-- Dependencies: 225
-- Name: species_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.species_id_seq', 397, true);


--
-- TOC entry 5113 (class 0 OID 0)
-- Dependencies: 223
-- Name: taxonomic_keys_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.taxonomic_keys_id_seq', 170, true);


--
-- TOC entry 5114 (class 0 OID 0)
-- Dependencies: 227
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 5, true);


--
-- TOC entry 5115 (class 0 OID 0)
-- Dependencies: 232
-- Name: verification_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.verification_tokens_id_seq', 1, false);


-- Completed on 2025-03-14 17:38:50

--
-- PostgreSQL database dump complete
--

