export interface CartDto {
  items: CartItemDto[];
  totalPrice: number;
}

export interface CartItemDto {
  id: number;
  productId: number;
  sku: string;
  name: string;
  imageUrl: string | null;
  quantity: number;
  price: number;
  sum: number;
}
