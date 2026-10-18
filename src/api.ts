export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  thumbnail: string;
  category: string;
  brand?: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export const fetchProducts = async (limit: number, skip: number, search: string): Promise<ProductsResponse> => {
  const params = new URLSearchParams({ limit: String(limit), skip: String(skip) });
  const normalizedSearch = search.trim();
  const endpoint = normalizedSearch ? "search" : "";
  if (normalizedSearch) params.set("q", normalizedSearch);
  const url = `https://dummyjson.com/products${endpoint ? `/${endpoint}` : ""}?${params}`;

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
};

export const fetchProductDetails = async (id: string): Promise<Product> => {
  const response = await fetch(`https://dummyjson.com/products/${id}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch product details");
  }

  return response.json();
};
