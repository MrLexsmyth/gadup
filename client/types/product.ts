export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;            
  discountPrice?: number;    
  category: string;
  image: string; 
}
