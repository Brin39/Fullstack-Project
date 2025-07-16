import Footer from '@/app/components/shared/Footer/Footer';

export default function UserLayout({
     children,
}: {
     children: React.ReactNode;
}) {
     return (
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
               {children}
               <Footer />
          </div>
     );
} 