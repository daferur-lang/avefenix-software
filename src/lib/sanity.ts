import { createClient } from '@sanity/client';
import type { Post } from '@/types/blog';
import type { Project } from '@/types/portfolio';

const client = createClient({
  projectId: import.meta.env.SANITY_PROJECT_ID ?? 'placeholder',
  dataset:   import.meta.env.SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
  token: import.meta.env.SANITY_API_TOKEN,
});

export async function getAllPosts(): Promise<Post[]> {
  return client.fetch<Post[]>(
    `*[_type == "post"] | order(publishedAt desc) {
      _id, title, slug, excerpt, body, coverImage, publishedAt, category, readTime
    }`
  );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return client.fetch<Post | null>(
    `*[_type == "post" && slug.current == $slug][0] {
      _id, title, slug, excerpt, body, coverImage, publishedAt, category, readTime
    }`,
    { slug }
  );
}

export async function getAllProjects(): Promise<Project[]> {
  return client.fetch<Project[]>(
    `*[_type == "project"] | order(order asc) {
      _id, title, slug, description, coverImage, gallery, category, technologies, url, featured, order
    }`
  );
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return client.fetch<Project[]>(
    `*[_type == "project" && featured == true] | order(order asc) [0..2] {
      _id, title, slug, description, coverImage, category, technologies, url
    }`
  );
}
