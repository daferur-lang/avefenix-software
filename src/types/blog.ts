export interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  body: unknown;
  coverImage: {
    asset: { url: string };
    alt: string;
  };
  publishedAt: string;
  category: 'SEO' | 'Desarrollo' | 'Automatización' | 'Negocio';
  readTime: number;
}
