-- Extensions
create extension if not exists pgcrypto;

-- Enums
create type public.user_role as enum ('CUSTOMER', 'ADMIN');
create type public.order_status as enum ('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');
create type public.payment_method as enum ('CASH_ON_DELIVERY', 'CARD', 'MOBILE_PAYMENT');
create type public.payment_status as enum ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');
create type public.discount_type as enum ('PERCENTAGE', 'FIXED');
