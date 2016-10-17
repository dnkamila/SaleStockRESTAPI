--
-- PostgreSQL database dump
--

-- Dumped from database version 9.3.14
-- Dumped by pg_dump version 9.3.14
-- Started on 2016-10-17 19:36:19 KST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 1 (class 3079 OID 11789)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2044 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 177 (class 1259 OID 17191)
-- Name: cart; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE cart (
    customer_id bigint NOT NULL,
    coupon_id bigint
);


ALTER TABLE public.cart OWNER TO postgres;

--
-- TOC entry 178 (class 1259 OID 17206)
-- Name: cart_item; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE cart_item (
    customer_id bigint NOT NULL,
    product_id bigint NOT NULL,
    quantity integer
);


ALTER TABLE public.cart_item OWNER TO postgres;

--
-- TOC entry 176 (class 1259 OID 17185)
-- Name: coupon; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE coupon (
    id bigint NOT NULL,
    name character varying(25),
    start_valid_date date,
    end_valid_date date,
    stock integer,
    type character varying(10),
    amount integer
);


ALTER TABLE public.coupon OWNER TO postgres;

--
-- TOC entry 175 (class 1259 OID 17183)
-- Name: coupon_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE coupon_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.coupon_id_seq OWNER TO postgres;

--
-- TOC entry 2045 (class 0 OID 0)
-- Dependencies: 175
-- Name: coupon_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE coupon_id_seq OWNED BY coupon.id;


--
-- TOC entry 172 (class 1259 OID 17167)
-- Name: customer; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE customer (
    id bigint NOT NULL,
    name character varying(50),
    phone character varying(15),
    email character varying(50),
    address character varying(100)
);


ALTER TABLE public.customer OWNER TO postgres;

--
-- TOC entry 171 (class 1259 OID 17165)
-- Name: customer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE customer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.customer_id_seq OWNER TO postgres;

--
-- TOC entry 2046 (class 0 OID 0)
-- Dependencies: 171
-- Name: customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE customer_id_seq OWNED BY customer.id;


--
-- TOC entry 180 (class 1259 OID 17223)
-- Name: order; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE "order" (
    id bigint NOT NULL,
    customer_id bigint,
    coupon_id bigint,
    status character varying(10),
    order_date date,
    name character varying(25),
    phone character varying(15),
    email character varying(50),
    address character varying(100),
    proof character varying(50)
);


ALTER TABLE public."order" OWNER TO postgres;

--
-- TOC entry 179 (class 1259 OID 17221)
-- Name: order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE order_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_id_seq OWNER TO postgres;

--
-- TOC entry 2047 (class 0 OID 0)
-- Dependencies: 179
-- Name: order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE order_id_seq OWNED BY "order".id;


--
-- TOC entry 181 (class 1259 OID 17239)
-- Name: order_item; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE order_item (
    order_id bigint NOT NULL,
    product_id bigint NOT NULL,
    quantity integer
);


ALTER TABLE public.order_item OWNER TO postgres;

--
-- TOC entry 174 (class 1259 OID 17177)
-- Name: product; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE product (
    id bigint NOT NULL,
    name character varying(50),
    price integer,
    stock integer
);


ALTER TABLE public.product OWNER TO postgres;

--
-- TOC entry 173 (class 1259 OID 17175)
-- Name: product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE product_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_id_seq OWNER TO postgres;

--
-- TOC entry 2048 (class 0 OID 0)
-- Dependencies: 173
-- Name: product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE product_id_seq OWNED BY product.id;


--
-- TOC entry 1893 (class 2604 OID 17188)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY coupon ALTER COLUMN id SET DEFAULT nextval('coupon_id_seq'::regclass);


--
-- TOC entry 1891 (class 2604 OID 17170)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY customer ALTER COLUMN id SET DEFAULT nextval('customer_id_seq'::regclass);


--
-- TOC entry 1894 (class 2604 OID 17226)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "order" ALTER COLUMN id SET DEFAULT nextval('order_id_seq'::regclass);


--
-- TOC entry 1892 (class 2604 OID 17180)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY product ALTER COLUMN id SET DEFAULT nextval('product_id_seq'::regclass);


--
-- TOC entry 2032 (class 0 OID 17191)
-- Dependencies: 177
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: postgres
--




--
-- TOC entry 2033 (class 0 OID 17206)
-- Dependencies: 178
-- Data for Name: cart_item; Type: TABLE DATA; Schema: public; Owner: postgres
--




--
-- TOC entry 2031 (class 0 OID 17185)
-- Dependencies: 176
-- Data for Name: coupon; Type: TABLE DATA; Schema: public; Owner: postgres
--




--
-- TOC entry 2049 (class 0 OID 0)
-- Dependencies: 175
-- Name: coupon_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('coupon_id_seq', 1, false);


--
-- TOC entry 2027 (class 0 OID 17167)
-- Dependencies: 172
-- Data for Name: customer; Type: TABLE DATA; Schema: public; Owner: postgres
--




--
-- TOC entry 2050 (class 0 OID 0)
-- Dependencies: 171
-- Name: customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('customer_id_seq', 1, false);


--
-- TOC entry 2035 (class 0 OID 17223)
-- Dependencies: 180
-- Data for Name: order; Type: TABLE DATA; Schema: public; Owner: postgres
--




--
-- TOC entry 2051 (class 0 OID 0)
-- Dependencies: 179
-- Name: order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('order_id_seq', 1, false);


--
-- TOC entry 2036 (class 0 OID 17239)
-- Dependencies: 181
-- Data for Name: order_item; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2029 (class 0 OID 17177)
-- Dependencies: 174
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: postgres
--




--
-- TOC entry 2052 (class 0 OID 0)
-- Dependencies: 173
-- Name: product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('product_id_seq', 1, false);


--
-- TOC entry 1906 (class 2606 OID 17210)
-- Name: cart_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY cart_item
    ADD CONSTRAINT cart_item_pkey PRIMARY KEY (customer_id, product_id);


--
-- TOC entry 1904 (class 2606 OID 17195)
-- Name: cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (customer_id);


--
-- TOC entry 1902 (class 2606 OID 17190)
-- Name: coupon_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY coupon
    ADD CONSTRAINT coupon_pkey PRIMARY KEY (id);


--
-- TOC entry 1896 (class 2606 OID 17174)
-- Name: customer_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY customer
    ADD CONSTRAINT customer_email_key UNIQUE (email);


--
-- TOC entry 1898 (class 2606 OID 17172)
-- Name: customer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY customer
    ADD CONSTRAINT customer_pkey PRIMARY KEY (id);


--
-- TOC entry 1910 (class 2606 OID 17243)
-- Name: order_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY order_item
    ADD CONSTRAINT order_item_pkey PRIMARY KEY (order_id, product_id);


--
-- TOC entry 1908 (class 2606 OID 17228)
-- Name: order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY "order"
    ADD CONSTRAINT order_pkey PRIMARY KEY (id);


--
-- TOC entry 1900 (class 2606 OID 17182)
-- Name: product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY product
    ADD CONSTRAINT product_pkey PRIMARY KEY (id);


--
-- TOC entry 1912 (class 2606 OID 17201)
-- Name: cart_coupon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY cart
    ADD CONSTRAINT cart_coupon_id_fkey FOREIGN KEY (coupon_id) REFERENCES coupon(id);


--
-- TOC entry 1911 (class 2606 OID 17196)
-- Name: cart_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY cart
    ADD CONSTRAINT cart_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customer(id);


--
-- TOC entry 1913 (class 2606 OID 17211)
-- Name: cart_item_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY cart_item
    ADD CONSTRAINT cart_item_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customer(id);


--
-- TOC entry 1914 (class 2606 OID 17216)
-- Name: cart_item_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY cart_item
    ADD CONSTRAINT cart_item_product_id_fkey FOREIGN KEY (product_id) REFERENCES product(id);


--
-- TOC entry 1916 (class 2606 OID 17234)
-- Name: order_coupon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "order"
    ADD CONSTRAINT order_coupon_id_fkey FOREIGN KEY (coupon_id) REFERENCES coupon(id);


--
-- TOC entry 1915 (class 2606 OID 17229)
-- Name: order_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "order"
    ADD CONSTRAINT order_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customer(id);


--
-- TOC entry 1917 (class 2606 OID 17244)
-- Name: order_item_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY order_item
    ADD CONSTRAINT order_item_order_id_fkey FOREIGN KEY (order_id) REFERENCES "order"(id);


--
-- TOC entry 1918 (class 2606 OID 17249)
-- Name: order_item_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY order_item
    ADD CONSTRAINT order_item_product_id_fkey FOREIGN KEY (product_id) REFERENCES product(id);


--
-- TOC entry 2043 (class 0 OID 0)
-- Dependencies: 6
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2016-10-17 19:36:19 KST

--
-- PostgreSQL database dump complete
--

INSERT INTO customer(name, phone, email, address) VALUES ('kamila', '081385935613', 'dnkamila@gmail.com', 'Indonesia');
INSERT INTO customer(name, phone, email, address) VALUES ('kameliya', '081385935614', 'kameliyahani@gmail.com', 'Indonesia');
INSERT INTO product(name, price, stock) VALUES ('adidas all star', 1250000, 25);
INSERT INTO product(name, price, stock) VALUES ('celana pendek trendy', 150000, 20);
INSERT INTO coupon(name, start_valid_date, end_valid_date, stock, type, amount) VALUES ('hemat dikit', '2016-10-01', '2016-12-01', 10, 'percentage', 15);
INSERT INTO coupon(name, start_valid_date, end_valid_date, stock, type, amount) VALUES ('untung ada diskon', '2016-10-01', '2016-12-01', 10, 'nominal', 150000);