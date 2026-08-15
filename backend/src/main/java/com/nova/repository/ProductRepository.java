package com.nova.repository;

import com.nova.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {

    // Note: explicit JPQL (referencing entity field names, not derived-query-method
    // parsing) — the "isNew" field's JavaBean property name would resolve to "new"
    // under Spring Data's naming conventions, which is ambiguous/easy to get wrong.

    @Query("select p from Product p where p.active = true order by p.createdAt desc")
    List<Product> findAllActive();

    @Query("select p from Product p where p.active = true and p.category.id = :categoryId order by p.createdAt desc")
    List<Product> findActiveByCategoryId(@Param("categoryId") UUID categoryId);

    @Query("select p from Product p where p.active = true and p.featured = true order by p.createdAt desc")
    List<Product> findActiveFeatured();

    @Query("select p from Product p where p.active = true and p.isNew = true order by p.createdAt desc")
    List<Product> findActiveNewArrivals();

    @Query("select p from Product p where p.active = true and lower(p.name) like lower(concat('%', :search, '%')) order by p.createdAt desc")
    List<Product> searchActiveByName(@Param("search") String search);
}
