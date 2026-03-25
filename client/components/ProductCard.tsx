"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { useAddToCart } from "@/hooks/useCart";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { TShirt3D } from "./TShirt3D";
import { TShirtSvg, getColourHex } from "./TShirtSvg";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [visible, setVisible] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const addToCart = useAddToCart();
  const items = useCartStore((s) => s.items);

  const cartItem = items.find((i) => i.productId._id === product._id);
  const inCart = cartItem?.quantity ?? 0;
  const outOfStock = product.quantity === 0;
  const atMax = inCart >= product.quantity;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="glass-card rounded-2xl overflow-hidden animate-scale-in group"
      style={{ animationDelay: `${index * 0.08}s`, opacity: 0 }}
    >
      <Link href={`/products/${product._id}`} className="block">
        <div className="relative aspect-square bg-studio-base/50">
          <div
            className={`absolute inset-0 flex items-center justify-center p-8 transition-opacity duration-500 ${modelLoaded ? "opacity-0" : "opacity-100"}`}
          >
            <TShirtSvg
              color={getColourHex(product.colour)}
              className="w-[50%] h-auto"
            />
          </div>
          {visible && (
            <div
              className={`absolute inset-0 transition-opacity duration-500 ${modelLoaded ? "opacity-100" : "opacity-0"}`}
            >
              <Canvas
                camera={{ position: [0, 0, 4], fov: 45 }}
                dpr={0.75}
                frameloop="always"
                gl={{
                  antialias: false,
                  alpha: true,
                  powerPreference: "high-performance",
                }}
                onCreated={() => setTimeout(() => setModelLoaded(true), 300)}
              >
                <ambientLight intensity={0.6} />
                <directionalLight position={[3, 3, 3]} intensity={0.8} />
                <pointLight
                  position={[-2, 1, 2]}
                  intensity={0.4}
                  color="#e8c27a"
                />
                <Suspense fallback={null}>
                  <TShirt3D color={getColourHex(product.colour)} autoRotate />
                </Suspense>
              </Canvas>
            </div>
          )}
        </div>
      </Link>
      <div className="p-3 md:p-5">
        <Link href={`/products/${product._id}`}>
          <h3 className="text-text-primary text-sm md:text-base font-medium mb-0.5 md:mb-1 group-hover:text-white transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-text-muted text-[10px] md:text-xs font-mono mb-2 md:mb-3 uppercase tracking-wider">
          {product.type} · {product.gender}
        </p>
        <p className="text-accent-gold font-mono font-bold text-base md:text-lg mb-3 md:mb-4">
          {formatPrice(product.price)}
        </p>
        {atMax ? (
          <p className="text-error text-xs font-mono">
            Only {product.quantity} available
          </p>
        ) : (
          <button
            onClick={() =>
              addToCart.mutate({ productId: product._id, quantity: 1 })
            }
            disabled={outOfStock}
            className="w-full btn-gold font-mono font-bold py-2 md:py-2.5 rounded-lg md:rounded-xl text-xs md:text-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:transform-none disabled:after:hidden"
          >
            {outOfStock ? "Out of stock" : "Add to Cart"}
          </button>
        )}
      </div>
    </div>
  );
}
