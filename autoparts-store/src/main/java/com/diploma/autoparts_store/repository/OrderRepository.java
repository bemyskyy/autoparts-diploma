package com.diploma.autoparts_store.repository;

import com.diploma.autoparts_store.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
    List<Order> findAllByOrderByCreatedAtDesc();
}
