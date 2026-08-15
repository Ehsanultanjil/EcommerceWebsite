package com.nova.controller;

import com.nova.decorator.AddOnType;
import com.nova.decorator.PricedComponent;
import com.nova.decorator.ProductPricingService;
import com.nova.dto.PricePreviewResponse;
import com.nova.dto.ProductResponse;
import com.nova.entity.Product;
import com.nova.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final ProductPricingService productPricingService;

    @GetMapping
    public List<ProductResponse> getProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(name = "newArrivals", required = false) Boolean newArrivals
    ) {
        return productService.getProducts(search, featured, newArrivals);
    }

    @GetMapping("/{id}")
    public ProductResponse getProduct(@PathVariable UUID id) {
        return productService.getProductById(id);
    }

    @GetMapping("/category/{categoryId}")
    public List<ProductResponse> getProductsByCategory(@PathVariable UUID categoryId) {
        return productService.getProductsByCategory(categoryId);
    }

    /**
     * Decorator pattern demo — price a product with optional add-ons stacked in any
     * combination (?addOns=GIFT_WRAP,EXTENDED_WARRANTY). Preview-only: the DB has no
     * column to persist which add-ons a cart/order line actually chose, so this isn't
     * wired into checkout — see com.nova.decorator for the pattern itself.
     */
    @GetMapping("/{id}/price-preview")
    public PricePreviewResponse previewPrice(
            @PathVariable UUID id,
            @RequestParam(required = false) List<AddOnType> addOns
    ) {
        Product product = productService.getActiveProductEntity(id);
        PricedComponent priced = productPricingService.priceWithAddOns(product, addOns == null ? Collections.emptyList() : addOns);
        return new PricePreviewResponse(priced.getDescription(), product.getPrice(), priced.getPrice());
    }
}
