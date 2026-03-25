"use client";

import { useState, Suspense, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useClearCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { getColourHex } from "@/components/TShirtSvg";
import { CheckoutPrize } from "./CheckoutPrize";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const [step, setStep] = useState<"summary" | "prize">("summary");
  const { items, totalPrice } = useCartStore();
  const clearCartApi = useClearCart()
  const router = useRouter();
  const [orderId] = useState(
    () => `DR-${Math.floor(10000 + Math.random() * 90000)}`,
  );

  const prizeItems = useMemo(() => {
    const seen = new Set<string>()
    return items.map(item => ({
      color: getColourHex(item.productId.colour),
      name: item.productId.name,
    })).filter(item => {
      if (seen.has(item.name)) return false
      seen.add(item.name)
      return true
    })
  }, [items])

  useEffect(() => {
    if (step === "prize") {
      const timer = setTimeout(() => {
        clearCartApi.mutate()
        onClose();
        router.push("/");
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [step, clearCartApi, onClose, router]);

  if (!isOpen) return null;

  if (step === "prize") {
    return (
      <div className="fixed inset-0 z-[70] bg-black animate-fade-in">
        <Canvas
          camera={{ position: [0, 1, typeof window !== 'undefined' && window.innerWidth < 768 ? 3.5 : 5], fov: 50 }}
          gl={{ antialias: true, alpha: false }}
        >
          <Suspense fallback={null}>
            <CheckoutPrize items={prizeItems} />
          </Suspense>
        </Canvas>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 pointer-events-none">
          <div className="text-center animate-slide-up pointer-events-auto">
            <p className="font-mono text-accent-gold/60 text-xs tracking-[0.3em] uppercase mb-2">
              Order Confirmed
            </p>
            <h2 className="text-text-primary text-3xl font-bold mb-1 gold-gradient-text">
              Order Placed!
            </h2>
            <p className="font-mono text-accent-gold text-lg mb-6">
              #{orderId}
            </p>
            <button
              onClick={() => { clearCartApi.mutate(); onClose(); router.push('/') }}
              className="btn-gold font-mono font-bold px-8 py-3 rounded-xl text-sm"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 animate-fade-in"
        onClick={onClose}
      />
      <div className="relative glass rounded-2xl p-6 w-full max-w-sm gold-glow animate-scale-in">
        <h2 className="text-text-primary font-bold text-lg mb-4">
          Order Summary
        </h2>

        <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.productId._id}
              className="flex justify-between items-center text-sm"
            >
              <span className="text-text-secondary truncate flex-1 mr-2">
                {item.productId.name} × {item.quantity}
              </span>
              <span className="text-text-primary font-mono flex-shrink-0">
                {formatPrice(item.productId.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-border-studio to-transparent mb-4" />

        <div className="flex justify-between items-center mb-6">
          <span className="font-mono text-text-secondary text-sm">Total</span>
          <span className="font-mono text-accent-gold text-2xl font-bold">
            {formatPrice(totalPrice)}
          </span>
        </div>

        <button
          onClick={() => setStep("prize")}
          className="w-full btn-gold font-mono font-bold py-3.5 rounded-xl text-sm"
        >
          Place Order
        </button>

        <button
          onClick={onClose}
          className="w-full text-text-muted text-xs font-mono mt-3 py-2 hover:text-text-secondary transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
