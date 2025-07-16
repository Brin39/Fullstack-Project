export interface CartProduct {
     _id: string;
     product: {
          _id: string;
          name: string;
          price: number;
          images: string[];
          description: string;
          stock?: number;
          bestOffer?: boolean;
     };
     quantity: number;
} 