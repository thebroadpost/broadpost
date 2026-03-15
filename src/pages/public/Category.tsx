import { Suspense, lazy } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { getCategories } from '../../lib/api';
import { Skeleton } from '../../components/ui/Skeleton';
import { LazyRender } from '../../components/ui/LazyRender';

const PostGrid = lazy(() =>
  import('../../components/blog/PostGrid').then((module) => ({ default: module.PostGrid }))
);
const Sidebar = lazy(() =>
  import('../../components/layout/Sidebar').then((module) => ({ default: module.Sidebar }))
);

export default function Category() {
  const { slug } = useParams<{ slug: string }>();

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });

  const category = categories?.find(c => c.slug === slug);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <Skeleton className="w-full h-[300px]" />
        <div className="px-4 lg:px-8 py-16 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
           <Skeleton className="lg:col-span-8 h-[600px]" />
           <Skeleton className="lg:col-span-4 h-[600px]" />
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="py-20 text-center font-sans">
        <h2 className="text-3xl font-serif font-bold text-primary mb-4">Category not found</h2>
        <p className="text-gray-500">The category you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{category.name} | BROADPOST</title>
        <meta name="description" content={category.description || `Stay updated with the latest news and analysis on ${category.name}.`} />
      </Helmet>

      {/* Category Hero */}
      <section className="bg-primary text-white py-20 px-4 lg:px-8 block w-full">
        <div className="max-w-[1600px] mx-auto">
           <h1 className="font-serif font-bold text-5xl md:text-6xl lg:text-7xl mb-6">{category.name}</h1>
           {category.description && (
             <p className="font-sans text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed">
               {category.description}
             </p>
           )}
        </div>
      </section>

      {/* Main Content + Sidebar */}
      <LazyRender
        fallback={
          <section className="px-4 lg:px-8 py-16 max-w-[1600px] mx-auto">
            <div className="flex flex-col lg:flex-row gap-12">
              <Skeleton className="lg:w-[70%] h-[650px]" />
              <Skeleton className="lg:w-[30%] h-[450px]" />
            </div>
          </section>
        }
      >
        <section className="px-4 lg:px-8 py-16 max-w-[1600px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-[70%]">
              <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
                <PostGrid categorySlug={category.slug} />
              </Suspense>
            </div>

            <div className="lg:w-[30%]">
              <Suspense fallback={<Skeleton className="w-full h-[450px]" />}>
                <Sidebar />
              </Suspense>
            </div>
          </div>
        </section>
      </LazyRender>
    </>
  );
}
