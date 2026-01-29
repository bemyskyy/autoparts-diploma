export interface CategoryDto {
  id: number;
  name: string;
  parentId: number | null;
  children: CategoryDto[];
}

export interface ProductDto {
  id: number;
  sku: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string | null;
  categoryName: string;
  categoryId: number;
}
