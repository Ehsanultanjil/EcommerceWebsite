package com.nova.command;

import com.nova.dto.CheckoutRequest;
import com.nova.dto.OrderResponse;
import com.nova.facade.CheckoutFacade;

import java.util.UUID;

public class PlaceOrderCommand implements Command<OrderResponse> {

    private final CheckoutFacade checkoutFacade;
    private final UUID userId;
    private final CheckoutRequest request;

    public PlaceOrderCommand(CheckoutFacade checkoutFacade, UUID userId, CheckoutRequest request) {
        this.checkoutFacade = checkoutFacade;
        this.userId = userId;
        this.request = request;
    }

    @Override
    public OrderResponse execute() {
        return checkoutFacade.checkout(userId, request);
    }
}
