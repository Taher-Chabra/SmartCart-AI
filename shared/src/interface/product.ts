export interface IProduct {
   name: string;
   description: string;
   price: number;
   stock: number;
   images: string[];
   variants?: Map<string, string>;
   ratings?: {
      average: number;
      reviews: string[];
   };
}

export interface IProductReview {
   comment?: string;
   rating: number;
}