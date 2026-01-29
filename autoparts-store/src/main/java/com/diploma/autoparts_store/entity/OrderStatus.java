package com.diploma.autoparts_store.entity;

public enum OrderStatus {
    CREATED,    // Создан
    CONFIRMED,  // Подтвержден менеджером
    PAID,       // Оплачен
    SHIPPED,    // Отправлен
    COMPLETED,  // Завершен (выдан)
    CANCELLED   // Отменен
}
