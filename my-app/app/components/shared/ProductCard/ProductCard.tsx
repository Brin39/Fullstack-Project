'use client';

import Image from 'next/image';
import styles from './ProductCard.module.css';

import { ProductCard as Product } from '@/app/types/product';

interface ProductCardProps {
    product: Product;
    onViewProduct: () => void;
}

export default function ProductCard({ product, onViewProduct }: ProductCardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                {product.bestOffer && (
                    <div className={styles.bestOfferBadge}>
                        <span>🔥 Best Offer!</span>
                    </div>
                )}
                <Image
                    src={product.images[0] || '/placeholder-image.jpg'}
                    alt={product.name}
                    width={300}
                    height={200}
                    className={styles.image}
                />
            </div>
            <div className={styles.content}>
                <h3 className={styles.name}>{product.name}</h3>
                <div className={styles.footer}>
                    <span className={`${styles.price} ${product.bestOffer ? styles.bestOffer : ''}`}>
                        {product.bestOffer ? `Only for $${product.price}` : `$${product.price}`}
                    </span>
                    <button
                        onClick={onViewProduct}
                        className={styles.buyButton}
                    >
                        View Product
                    </button>
                </div>
            </div>
        </div>
    );
}