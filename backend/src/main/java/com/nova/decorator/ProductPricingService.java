package com.nova.decorator;

import com.nova.entity.Product;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductPricingService {

    public PricedComponent priceWithAddOns(Product product, List<AddOnType> addOns) {
        PricedComponent component = new BaseProductPrice(product);
        for (AddOnType addOn : addOns) {
            component = switch (addOn) {
                case GIFT_WRAP -> new GiftWrapDecorator(component);
                case PREMIUM_PACKAGING -> new PremiumPackagingDecorator(component);
                case EXTENDED_WARRANTY -> new ExtendedWarrantyDecorator(component);
            };
        }
        return component;
    }
}
