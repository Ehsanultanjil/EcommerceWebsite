package com.nova.adapter;

/** Our internal shape for a gateway charge result — independent of any vendor's API. */
public record GatewayChargeResult(boolean success, String transactionReference) {
}
