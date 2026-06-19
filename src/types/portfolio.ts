export interface Project {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  coverImage: {
    asset: { url: string };
    alt: string;
  };
  gallery?: Array<{ asset: { url: string }; alt: string }>;
  category: 'Web' | 'Software' | 'SEO' | 'Automatización';
  technologies: string[];
  url?: string;
  featured: boolean;
  order: number;
}
