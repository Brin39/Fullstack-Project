import UserHeaderWrapper from '@/app/(user)/user/UserHeaderWrapper/page';
import ProductList from '@/app/components/shared/ProductList/ProductList';
import { fetchAndFormatProducts } from '@/app/utils/productUtils';
import styles from './page.module.css';

export default async function UserPage() {
     const products = await fetchAndFormatProducts();

     return (
          <div className={styles.layout}>
               <UserHeaderWrapper />
               <main className={styles.main}>
                    <div className={styles.container}>
                         <h1 className={styles.title}>Our products</h1>
                         {products.length > 0 ? (
                              <ProductList initialProducts={products} />
                         ) : (
                              <div className={styles.error}>No products available</div>
                         )}
                    </div>
               </main>
          </div>
     );
} 