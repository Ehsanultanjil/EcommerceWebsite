package com.nova.service;

import com.nova.dto.ProductRequest;
import com.nova.dto.ProductResponse;
import com.nova.entity.Category;
import com.nova.entity.Product;
import com.nova.exception.ResourceNotFoundException;
import com.nova.repository.CategoryRepository;
import com.nova.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    /**
     * Backs GET /api/products, optionally narrowed by one of the supported query
     * params. Filters are independent/exclusive (not combined) — keeps the query
     * surface simple for this phase rather than building a generic filter builder.
     */
    public List<ProductResponse> getProducts(String search, Boolean featured, Boolean newArrivals) {
        List<Product> products;
        if (search != null && !search.isBlank()) {
            products = productRepository.searchActiveByName(search.trim());
        } else if (Boolean.TRUE.equals(featured)) {
            products = productRepository.findActiveFeatured();
        } else if (Boolean.TRUE.equals(newArrivals)) {
            products = productRepository.findActiveNewArrivals();
        } else {
            products = productRepository.findAllActive();
        }
        return products.stream().map(ProductResponse::from).toList();
    }

    public ProductResponse getProductById(UUID id) {
        Product product = productRepository.findById(id)
                .filter(Product::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
        return ProductResponse.from(product);
    }

    public List<ProductResponse> getProductsByCategory(UUID categoryId) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new ResourceNotFoundException("Category not found: " + categoryId);
        }
        return productRepository.findActiveByCategoryId(categoryId).stream()
                .map(ProductResponse::from)
                .toList();
    }

    /** Entity (not DTO) — used where a caller needs to operate on the product itself, e.g. pricing decorators. */
    public Product getActiveProductEntity(UUID id) {
        return productRepository.findById(id)
                .filter(Product::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
    }

    // ---- Admin ----

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        Category category = requireCategory(request.categoryId());
        validateComparePrice(request);

        Product product = new Product();
        applyRequest(product, request, category);
        OffsetDateTime now = OffsetDateTime.now();
        product.setCreatedAt(now);
        product.setUpdatedAt(now);

        return ProductResponse.from(productRepository.save(product));
    }

    @Transactional
    public ProductResponse updateProduct(UUID id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
        Category category = requireCategory(request.categoryId());
        validateComparePrice(request);

        applyRequest(product, request, category);
        product.setUpdatedAt(OffsetDateTime.now());

        return ProductResponse.from(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(UUID id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found: " + id);
        }
        productRepository.deleteById(id);
    }

    private Category requireCategory(UUID categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + categoryId));
    }

    private void validateComparePrice(ProductRequest request) {
        if (request.comparePrice() != null && request.comparePrice().compareTo(request.price()) <= 0) {
            throw new IllegalArgumentException("comparePrice must be greater than price");
        }
    }

    private void applyRequest(Product product, ProductRequest request, Category category) {
        product.setCategory(category);
        product.setName(request.name());
        product.setSlug(request.slug());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setComparePrice(request.comparePrice());
        product.setStock(request.stock());
        product.setImageUrl(request.imageUrl());
        product.setFeatured(request.featured());
        product.setNew(request.isNew());
        product.setActive(request.active());
    }
}
