import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchProducts, type Product } from "../api";
import { Card } from "../components/ui/card";

type Category = "all" | "skincare" | "haircare" | "makeup" | "bath";

const categories: {
  id: Category;
  label: string;
  icon?: string;
}[] = [
  { id: "all", label: "All Products" },
  { id: "skincare", label: "Skincare", icon: "/assets/icon-skincare.svg" },
  { id: "haircare", label: "Haircare", icon: "/assets/icon-haircare.svg" },
  { id: "makeup", label: "Makeup", icon: "/assets/icon-makeup.svg" },
  { id: "bath", label: "Bath & Body", icon: "/assets/icon-bath-body.svg" },
];

const matchesCategory = (product: Product, category: Category) => {
  if (category === "all") return true;

  const text = `${product.category} ${product.title} ${product.description}`.toLowerCase();
  if (category === "skincare") return /skin|face|moistur|serum|cream|cleanser/.test(text);
  if (category === "haircare") return /hair|shampoo|conditioner|scalp/.test(text);
  if (category === "makeup") return /makeup|lipstick|mascara|eyeshadow|foundation|beauty/.test(text);
  return /bath|body|soap|lotion|deodorant/.test(text);
};

export default function Products() {
  const [search, setSearch] = useState("");
  const [skip, setSkip] = useState(0);
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const limit = 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", limit, skip, search],
    queryFn: () => fetchProducts(limit, skip, search),
  });

  const filteredProducts = useMemo(
    () => data?.products.filter((product) => matchesCategory(product, activeCategory)) ?? [],
    [activeCategory, data?.products],
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    setSkip(0);
  };

  return (
    <div className="shop-page">
      <header className="shop-header">
        <a className="brand-card" href="/" aria-label="Crystal home">
          <img src="/assets/icon-diamond.svg" alt="" aria-hidden="true" />
          <span>crystal.</span>
        </a>

        <nav className="main-nav" aria-label="Main navigation">
          <a href="#products" aria-current="page">Shop</a>
          <a href="#collections">Collections</a>
          <a href="#contact">Contact</a>
          <a href="#about">About</a>
        </nav>

        <label className="search-box">
          <input
            type="search"
            aria-label="Search products"
            placeholder="Search"
            value={search}
            onChange={(event) => handleSearch(event.target.value)}
          />
          <Search aria-hidden="true" />
        </label>

        <button className="cart-button" type="button">
          <img className="cart-icon" src="/assets/icon-cart.svg" alt="" aria-hidden="true" />
          <span>View Cart</span>
        </button>
      </header>

      <main>
        <section className="hero-panel" id="about">
          <div className="hero-art" aria-hidden="true">
            <img className="hero-wave hero-wave-upper" src="/assets/hero-wave-upper.svg" alt="" />
            <img className="hero-wave hero-wave-lower" src="/assets/hero-wave-lower.svg" alt="" />
            <img className="hero-burst hero-burst-left" src="/assets/burst-pucker-accent.svg" alt="" />
            <img className="hero-burst hero-burst-center" src="/assets/burst-star.svg" alt="" />
            <img className="hero-burst hero-burst-right" src="/assets/burst-pucker-large.svg" alt="" />
            <img className="hero-burst hero-burst-small" src="/assets/burst-pucker-small.svg" alt="" />
            <img className="hero-burst hero-burst-tiny" src="/assets/hero-burst-vector.svg" alt="" />
            <img className="hero-hand" src="/assets/hero-hand.svg" alt="" />
          </div>
          <h1>Explore Our Shop</h1>
          <p>
            From skincare to makeup, our platform features a wide range of products that cater to
            all your beauty needs. We strive to provide our customers with a luxury shopping
            experience, from browsing through our carefully selected products to receiving them in
            our signature packaging. Shop with us for the ultimate in beauty luxury.
          </p>
        </section>

        <section className="catalog-panel" id="products" aria-label="Shop products">
          <div className="category-tabs" role="group" aria-label="Filter products by category">
            {categories.map(({ id, label, icon: Icon }) => (
              <button
                className="category-tab"
                type="button"
                key={id}
                aria-pressed={activeCategory === id}
                onClick={() => {
                  setActiveCategory(id);
                  setSkip(0);
                }}
              >
                {Icon && <img className="category-icon" src={Icon} alt="" aria-hidden="true" />}
                {label}
              </button>
            ))}
          </div>

          {isLoading && <p className="products-message">Loading your luxury products...</p>}
          {isError && <p className="products-message">Products could not be loaded. Please try again.</p>}
          {!isLoading && !isError && filteredProducts.length === 0 && (
            <p className="products-message">
              No products found{activeCategory !== "all" ? " in this category" : ""}.
            </p>
          )}

          {!isLoading && !isError && filteredProducts.length > 0 && (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <article className="product-tile" key={product.id}>
                  <Link to={`/product/${product.id}`} className="product-link">
                    <Card className="product-card">
                      <div className="product-image-wrap">
                        <img
                          className="product-image"
                          src={product.thumbnail}
                          alt={product.title}
                          loading="lazy"
                        />
                      </div>
                      <div className="product-info">
                        <h2 className="product-title" title={product.title}>{product.title}</h2>
                        <p className="product-category">{product.brand || product.category}</p>
                        <p className="product-price">${product.price.toFixed(2)}</p>
                      </div>
                  </Card>
                  </Link>
                </article>
              ))}
            </div>
          )}

          <div className="pagination" aria-label="Product pages">
            <button
              type="button"
              onClick={() => setSkip((previous) => Math.max(0, previous - limit))}
              disabled={skip === 0}
            >
              Previous
            </button>
            <span>Page {Math.floor(skip / limit) + 1}</span>
            <button
              type="button"
              onClick={() => setSkip((previous) => previous + limit)}
              disabled={!data || skip + limit >= data.total}
            >
              Next
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
