package com.nova.command;

/** T rather than Object — AddToCartCommand returns a CartResponse, PlaceOrderCommand an OrderResponse; no casting at call sites. */
public interface Command<T> {
    T execute();
}
