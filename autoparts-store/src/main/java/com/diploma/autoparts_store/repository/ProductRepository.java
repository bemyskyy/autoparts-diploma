package com.diploma.autoparts_store.repository;

import com.diploma.autoparts_store.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryId(Long categoryId);

    List<Product> findByNameContainingIgnoreCaseOrSkuContainingIgnoreCase(String name, String sku);

    @Query("SELECT p FROM Product p WHERE " +
            "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
            "(:query IS NULL OR LOWER(p.name) LIKE :query OR LOWER(p.sku) LIKE :query)")
    List<Product> searchProducts(@Param("categoryId") Long categoryId, @Param("query") String query);
}
