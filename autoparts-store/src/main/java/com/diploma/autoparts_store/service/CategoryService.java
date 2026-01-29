package com.diploma.autoparts_store.service;

import com.diploma.autoparts_store.dto.CategoryDto;
import com.diploma.autoparts_store.entity.Category;
import com.diploma.autoparts_store.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategoriesTree() {
        List<Category> roots = categoryRepository.findByParentIsNull();
        return roots.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private CategoryDto mapToDto(Category category) {
        List<CategoryDto> childrenDto = category.getChildren().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return new CategoryDto(
                category.getId(),
                category.getName(),
                category.getParent() != null ? category.getParent().getId() : null,
                childrenDto
        );
    }

    @Transactional
    public void createCategory(String name, Long parentId) {
        Category category = new Category();
        category.setName(name);

        if (parentId != null) {
            Category parent = categoryRepository.findById(parentId)
                    .orElseThrow(() -> new RuntimeException("Родительская категория не найдена"));
            category.setParent(parent);
        }

        categoryRepository.save(category);
    }

    @Transactional
    public void updateCategory(Long id, String name, Long parentId) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Категория не найдена"));

        category.setName(name);

        if (parentId != null) {
            if (parentId.equals(id)) {
                throw new RuntimeException("Категория не может быть своим родителем");
            }
            Category parent = categoryRepository.findById(parentId)
                    .orElseThrow(() -> new RuntimeException("Родительская категория не найдена"));
            category.setParent(parent);
        } else {
            category.setParent(null);
        }

        categoryRepository.save(category);
    }

    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Категория не найдена");
        }
        categoryRepository.deleteById(id);
    }
}
