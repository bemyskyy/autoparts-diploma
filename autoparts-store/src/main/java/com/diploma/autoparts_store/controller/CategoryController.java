package com.diploma.autoparts_store.controller;

import com.diploma.autoparts_store.dto.CategoryDto;
import com.diploma.autoparts_store.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping
    public List<CategoryDto> getTree() {
        return categoryService.getAllCategoriesTree();
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public void create(@RequestParam String name, @RequestParam(required = false) Long parentId) {
        categoryService.createCategory(name, parentId);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public void update(@PathVariable Long id,
                       @RequestParam String name,
                       @RequestParam(required = false) Long parentId) {
        categoryService.updateCategory(id, name, parentId);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public void delete(@PathVariable Long id) {
        categoryService.deleteCategory(id);
    }
}
