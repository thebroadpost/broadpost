export type CategoryMeta = {
  name: string;
  slug: string;
  description: string;
};

const CATEGORY_ALIAS_TO_CANONICAL: Record<string, string> = {
  // Common spelling errors seen in content entry.
  enterment: 'entertainment',
  entertianment: 'entertainment',
  entertainement: 'entertainment',

  // Handle "&" vs "and" slug forms.
  'tech-innovation': 'tech-and-innovation',
  'business-economy': 'business-and-economy',
  'politics-policy': 'politics-and-policy',

  // Map generic finance routes to the canonical category.
  finance: 'personal-finance',
};

export const CATEGORY_META: CategoryMeta[] = [
  {
    name: 'Lifestyle',
    slug: 'lifestyle',
    description: 'Fashion, wellness, travel, and modern living.',
  },
  {
    name: 'Tech & Innovation',
    slug: 'tech-and-innovation',
    description: 'The latest in technology, startups, and innovation.',
  },
  {
    name: 'Sports',
    slug: 'sports',
    description: 'Scores, analysis, and the biggest stories in sport.',
  },
  {
    name: 'Entertainment',
    slug: 'entertainment',
    description: 'Film, music, pop culture, and the people shaping it.',
  },
  {
    name: 'Business & Economy',
    slug: 'business-and-economy',
    description: 'Markets, policy, and business moves that matter.',
  },
  {
    name: 'Personal Finance',
    slug: 'personal-finance',
    description: 'Money strategies, investing insights, and smart planning.',
  },
  {
    name: 'Politics & Policy',
    slug: 'politics-and-policy',
    description: 'Power, policy, and decisions shaping public life.',
  },
];

export const CATEGORY_META_BY_SLUG = Object.fromEntries(
  CATEGORY_META.map((category) => [category.slug, category])
) as Record<string, CategoryMeta>;

function normalizeSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function toCanonicalCategorySlug(value: string): string {
  const slug = normalizeSlug(value);
  return CATEGORY_ALIAS_TO_CANONICAL[slug] || slug;
}

export function getCategoryMatchVariants(value: string): string[] {
  const requested = normalizeSlug(value);
  const canonical = toCanonicalCategorySlug(requested);

  const variants = new Set<string>([
    requested,
    canonical,
    requested.replace(/-/g, ' '),
    canonical.replace(/-/g, ' '),
    requested.split('-').filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' '),
    canonical.split('-').filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' '),
  ]);

  for (const [alias, canonicalSlug] of Object.entries(CATEGORY_ALIAS_TO_CANONICAL)) {
    if (canonicalSlug === canonical) {
      variants.add(alias);
      variants.add(alias.replace(/-/g, ' '));
      variants.add(alias.split('-').filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' '));
    }
  }

  return Array.from(variants).filter(Boolean);
}
