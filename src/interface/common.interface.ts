export interface ICategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export interface IDisease {
  id: string;
  name: string;
  slug: string;
  summary: string;
  symptoms: string;
  category: string;
  targetAnimals: string[];
}

export interface IBlog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  date: string;
}

export interface ICertificate {
  id: string;
  title: string;
  issuedBy: string;
  imageUrl: string;
}

export interface ITestimonial {
  id: string;
  farmerName: string;
  location: string;
  animalType: string;
  comment: string;
  rating: number;
}

export interface IFAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'DEALER' | 'USER';
}
