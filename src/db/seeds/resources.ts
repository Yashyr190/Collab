import { db } from '@/db';
import { resources } from '@/db/schema';

async function main() {
    const sampleResources = [
        {
            title: 'Complete Guide to React Hooks',
            description: 'A comprehensive guide covering all React Hooks with practical examples and best practices for modern React development.',
            category: 'article',
            url: 'https://dev.to/react-hooks-guide',
            upvotes: 127,
            createdBy: 3,
            createdAt: new Date('2024-01-15').toISOString(),
        },
        {
            title: 'Next.js Starter Template with TypeScript',
            description: 'Production-ready Next.js starter template with TypeScript, ESLint, Prettier, and Tailwind CSS configured out of the box.',
            category: 'template',
            url: 'https://github.com/templates/nextjs-starter',
            upvotes: 89,
            createdBy: 7,
            createdAt: new Date('2024-01-22').toISOString(),
        },
        {
            title: 'Building Scalable APIs with Node.js',
            description: 'Learn how to design and build scalable RESTful APIs using Node.js, Express, and MongoDB with real-world examples.',
            category: 'video',
            url: 'https://youtube.com/watch?v=api-tutorial',
            upvotes: 156,
            createdBy: 2,
            createdAt: new Date('2024-01-08').toISOString(),
        },
        {
            title: 'Figma Design System Template',
            description: 'Complete design system template for Figma with components, typography, colors, and spacing guidelines for consistent UI design.',
            category: 'template',
            url: 'https://figma.com/@/design-system',
            upvotes: 103,
            createdBy: 5,
            createdAt: new Date('2024-01-18').toISOString(),
        },
        {
            title: 'Understanding State Management in React',
            description: 'Deep dive into React state management patterns including Context API, Redux, and Zustand with performance optimization tips.',
            category: 'article',
            url: 'https://medium.com/state-management',
            upvotes: 78,
            createdBy: 1,
            createdAt: new Date('2024-02-01').toISOString(),
        },
        {
            title: 'Microservices Architecture Explained',
            description: 'Comprehensive video tutorial on microservices architecture covering design patterns, communication, and deployment strategies.',
            category: 'video',
            url: 'https://youtube.com/watch?v=microservices',
            upvotes: 142,
            createdBy: 8,
            createdAt: new Date('2024-01-12').toISOString(),
        },
        {
            title: 'REST API Best Practices',
            description: 'Essential best practices for designing RESTful APIs including versioning, authentication, error handling, and documentation.',
            category: 'article',
            url: 'https://dev.to/api-best-practices',
            upvotes: 95,
            createdBy: 4,
            createdAt: new Date('2024-01-25').toISOString(),
        },
        {
            title: 'Tailwind CSS Component Library',
            description: 'Beautiful and accessible component library built with Tailwind CSS including buttons, forms, modals, and navigation components.',
            category: 'template',
            url: 'https://github.com/templates/tailwind-components',
            upvotes: 68,
            createdBy: 9,
            createdAt: new Date('2024-02-05').toISOString(),
        },
        {
            title: 'Introduction to GraphQL',
            description: 'Beginner-friendly video series introducing GraphQL concepts, queries, mutations, and how to build a GraphQL API from scratch.',
            category: 'video',
            url: 'https://youtube.com/watch?v=graphql-intro',
            upvotes: 134,
            createdBy: 6,
            createdAt: new Date('2024-01-14').toISOString(),
        },
        {
            title: 'Deploying Apps to Production: A Guide',
            description: 'Step-by-step guide to deploying web applications to production covering CI/CD, Docker, Kubernetes, and cloud platforms.',
            category: 'article',
            url: 'https://blog.dev/deploy-production',
            upvotes: 51,
            createdBy: 10,
            createdAt: new Date('2024-02-10').toISOString(),
        }
    ];

    await db.insert(resources).values(sampleResources);
    
    console.log('✅ Resources seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});