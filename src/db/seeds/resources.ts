import { db } from '@/db';
import { resources } from '@/db/schema';

async function main() {
    const sampleResources = [
        {
            title: 'Getting Started with React Hooks',
            type: 'article',
            authorId: 1,
            description: 'A comprehensive guide to using React Hooks effectively',
            content: 'React Hooks revolutionized how we write components. This guide covers useState, useEffect, and custom hooks with practical examples.',
            tags: JSON.stringify(['React', 'JavaScript', 'Tutorial']),
            upvotes: 45,
            createdAt: new Date('2024-01-15').toISOString(),
        },
        {
            title: 'REST API Design Best Practices',
            type: 'article',
            authorId: 3,
            description: 'Learn how to design scalable and maintainable REST APIs',
            content: 'Explore best practices for REST API design including proper HTTP methods, status codes, versioning, and documentation.',
            tags: JSON.stringify(['API', 'Backend', 'Best Practices']),
            upvotes: 67,
            createdAt: new Date('2024-01-18').toISOString(),
        },
        {
            title: 'Startup Pitch Deck Template',
            type: 'template',
            authorId: 4,
            description: 'Professional pitch deck template for early-stage startups',
            content: 'Includes slides for problem, solution, market size, business model, team, and financials.',
            tags: JSON.stringify(['Startup', 'Business', 'Template']),
            upvotes: 89,
            createdAt: new Date('2024-01-20').toISOString(),
        },
        {
            title: 'UI Design System Components',
            type: 'template',
            authorId: 2,
            description: 'Reusable design system components for web applications',
            content: 'Complete set of UI components including buttons, forms, cards, navigation, and modals with design tokens.',
            tags: JSON.stringify(['Design', 'UI', 'Components']),
            upvotes: 123,
            createdAt: new Date('2024-01-22').toISOString(),
        },
        {
            title: 'Introduction to Machine Learning',
            type: 'article',
            authorId: 5,
            description: 'Beginner-friendly introduction to ML concepts and algorithms',
            content: 'Learn the fundamentals of machine learning including supervised learning, neural networks, and practical applications.',
            tags: JSON.stringify(['Machine Learning', 'AI', 'Tutorial']),
            upvotes: 78,
            createdAt: new Date('2024-01-25').toISOString(),
        },
        {
            title: 'Docker for Developers',
            type: 'article',
            authorId: 9,
            description: 'Master containerization with Docker',
            content: 'Step-by-step guide to Docker basics, Dockerfile creation, docker-compose, and container orchestration.',
            tags: JSON.stringify(['Docker', 'DevOps', 'Tutorial']),
            upvotes: 92,
            createdAt: new Date('2024-01-28').toISOString(),
        },
        {
            title: 'Social Media Content Calendar Template',
            type: 'template',
            authorId: 8,
            description: 'Plan and schedule your social media content effectively',
            content: 'Monthly content calendar template with post ideas, hashtags, and engagement tracking.',
            tags: JSON.stringify(['Marketing', 'Social Media', 'Template']),
            upvotes: 56,
            createdAt: new Date('2024-02-01').toISOString(),
        },
        {
            title: 'Mobile App Wireframe Kit',
            type: 'template',
            authorId: 7,
            description: 'Professional wireframe templates for iOS and Android',
            content: 'Complete set of wireframe screens for common mobile app patterns including onboarding, profiles, feeds, and settings.',
            tags: JSON.stringify(['Mobile', 'Design', 'Wireframes']),
            upvotes: 103,
            createdAt: new Date('2024-02-05').toISOString(),
        }
    ];

    await db.insert(resources).values(sampleResources);
    
    console.log('✅ Resources seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});