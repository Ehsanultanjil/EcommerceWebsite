package com.nova.adapter;

/** Shape returned by the (mock) third-party payment SDK — not ours to change. */
public record ExternalChargeResponse(boolean success, String referenceId) {
}
