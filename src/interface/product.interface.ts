export type AnimalType = 'COW' | 'BUFFALO' | 'GOAT' | 'SHEEP' | 'POULTRY' | 'HORSE' | 'CAMEL' | 'PIG' | 'PET';

export interface ProductIngredient {
  name: string;
  quantity: string;
}

export interface IProduct {
  id: string;
  title: string;
  slug: string;
  sku: string;
  category: string;
  summary: string;
  description: string;
  targetAnimals: AnimalType[] | string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  image: string;
  variants: string[];
  benefits: string[];
  ingredients: ProductIngredient[];
  dosage: string;
  diseases: string[];
  created_at?: string | Date;
}
