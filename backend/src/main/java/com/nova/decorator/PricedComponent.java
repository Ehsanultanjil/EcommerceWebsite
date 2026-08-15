package com.nova.decorator;

import java.math.BigDecimal;

public interface PricedComponent {
    BigDecimal getPrice();
    String getDescription();
}
