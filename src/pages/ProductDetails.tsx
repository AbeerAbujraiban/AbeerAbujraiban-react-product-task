import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { fetchProductDetails } from "../api";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductDetails(id!),
    enabled: !!id,
  });

  if (isLoading) return <p className="detail-state">Loading product details...</p>;
  if (isError || !product) return <p className="detail-state">Product details could not be loaded.</p>;

  return (
    <main className="detail-page">
      <Link className="detail-back" to="/">
        <ArrowLeft size={17} aria-hidden="true" />
        Back to Shop
      </Link>

      <article className="detail-card">
        <div className="detail-image-wrap">
          <img className="detail-image" src={product.thumbnail} alt={product.title} />
        </div>
        <div className="detail-copy">
          <p className="product-category">{product.category}</p>
          <h1>{product.title}</h1>
          <p>{product.description}</p>
          <p className="detail-price">${product.price.toFixed(2)}</p>
          <span className="detail-rating">Rating: {product.rating} / 5</span>
        </div>
      </article>
    </main>
  );
}
