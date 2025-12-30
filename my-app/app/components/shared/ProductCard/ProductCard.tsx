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
        <div className={styles.card} data-testid={`product-card-${product._id}`}>
            <div className={styles.imageContainer}>
                {product.bestOffer && (
                    <div className={styles.bestOfferBadge} data-testid={`best-offer-badge-${product._id}`}>
                        <span>🔥 Best Offer!</span>
                    </div>
                )}
                <Image
                    src={product.images[0] || '/placeholder-image.jpg'}
                    alt={product.name}
                    width={300}
                    height={200}
                    className={styles.image}
                    data-testid={`product-image-${product._id}`}
                />
            </div>
            <div className={styles.content}>
                <h3 className={styles.name} data-testid={`product-name-${product._id}`}>{product.name}</h3>
                <div className={styles.footer}>
                    <span className={`${styles.price} ${product.bestOffer ? styles.bestOffer : ''}`} data-testid={`product-price-${product._id}`}>
                        {product.bestOffer ? `Only for $${product.price}` : `$${product.price}`}
                    </span>
                    <button
                        onClick={onViewProduct}
                        className={styles.buyButton}
                        data-testid={`view-product-btn-${product._id}`}
                    >
                        View Product
                    </button>
                </div>
            </div>
        </div>
    );
}