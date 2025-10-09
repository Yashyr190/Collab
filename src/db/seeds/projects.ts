import { db } from '@/db';
import { projects } from '@/db/schema';

async function main() {
    const sampleProjects = [
        {
            ownerId: 1,
            title: 'E-commerce Dashboard',
            description: 'A comprehensive dashboard for managing online store operations, including inventory tracking, sales analytics, and customer management. Built with modern web technologies to provide real-time insights and seamless user experience.',
            members: [1, 2, 4],
            tasks: [
                { id: 1, title: 'Design dashboard layout', completed: true },
                { id: 2, title: 'Implement analytics charts', completed: true },
                { id: 3, title: 'Build inventory management module', completed: false }
            ],
            status: 'active',
            progress: 65,
            createdAt: new Date('2024-01-15').toISOString(),
            updatedAt: new Date('2024-02-10').toISOString(),
        },
        {
            ownerId: 5,
            title: 'Social Media Analytics Tool',
            description: 'Advanced analytics platform for tracking social media performance across multiple platforms. Features include engagement metrics, audience insights, competitor analysis, and automated reporting capabilities.',
            members: [5, 8],
            tasks: [
                { id: 1, title: 'Set up API integrations', completed: true },
                { id: 2, title: 'Create data visualization components', completed: false },
                { id: 3, title: 'Build reporting engine', completed: false },
                { id: 4, title: 'Implement user authentication', completed: true }
            ],
            status: 'active',
            progress: 40,
            createdAt: new Date('2024-02-01').toISOString(),
            updatedAt: new Date('2024-03-05').toISOString(),
        },
        {
            ownerId: 3,
            title: 'Mobile Fitness Tracker',
            description: 'Cross-platform mobile application for tracking workouts, nutrition, and health metrics. Includes AI-powered recommendations, social features, and integration with popular wearable devices.',
            members: [3, 2, 10],
            tasks: [
                { id: 1, title: 'Design mobile UI/UX', completed: true },
                { id: 2, title: 'Implement workout tracking', completed: true },
                { id: 3, title: 'Build nutrition database', completed: true },
                { id: 4, title: 'Add wearable device sync', completed: true },
                { id: 5, title: 'Create social sharing features', completed: false }
            ],
            status: 'active',
            progress: 80,
            createdAt: new Date('2023-12-10').toISOString(),
            updatedAt: new Date('2024-03-20').toISOString(),
        },
        {
            ownerId: 9,
            title: 'AI Content Writer',
            description: 'Intelligent content generation platform powered by advanced AI models. Supports multiple content types including blog posts, social media content, product descriptions, and marketing copy with SEO optimization.',
            members: [9, 5, 8],
            tasks: [
                { id: 1, title: 'Integrate AI model API', completed: true },
                { id: 2, title: 'Build content templates library', completed: true },
                { id: 3, title: 'Implement SEO optimization features', completed: true },
                { id: 4, title: 'Create user dashboard and history', completed: true }
            ],
            status: 'completed',
            progress: 100,
            createdAt: new Date('2023-11-20').toISOString(),
            updatedAt: new Date('2024-02-28').toISOString(),
        },
        {
            ownerId: 4,
            title: 'Crypto Portfolio Manager',
            description: 'Comprehensive cryptocurrency portfolio tracking and management platform. Real-time price updates, profit/loss calculations, transaction history, and advanced charting with support for 100+ cryptocurrencies.',
            members: [4, 7],
            tasks: [
                { id: 1, title: 'Set up cryptocurrency API connections', completed: true },
                { id: 2, title: 'Build portfolio dashboard', completed: false },
                { id: 3, title: 'Implement transaction tracking', completed: false }
            ],
            status: 'active',
            progress: 25,
            createdAt: new Date('2024-03-01').toISOString(),
            updatedAt: new Date('2024-03-15').toISOString(),
        },
        {
            ownerId: 10,
            title: 'Design System Library',
            description: 'Complete design system and component library for building consistent user interfaces. Includes reusable components, design tokens, typography system, color palettes, and comprehensive documentation.',
            members: [10, 2],
            tasks: [
                { id: 1, title: 'Create design tokens and variables', completed: true },
                { id: 2, title: 'Build core component library', completed: true },
                { id: 3, title: 'Write documentation and examples', completed: true }
            ],
            status: 'completed',
            progress: 100,
            createdAt: new Date('2023-10-15').toISOString(),
            updatedAt: new Date('2024-01-20').toISOString(),
        },
        {
            ownerId: 6,
            title: 'Booking Management System',
            description: 'Enterprise-level booking and reservation management system for hospitality businesses. Features include calendar management, automated notifications, payment processing, and customer relationship management.',
            members: [6],
            tasks: [
                { id: 1, title: 'Design database architecture', completed: true },
                { id: 2, title: 'Build calendar interface', completed: true },
                { id: 3, title: 'Implement payment gateway', completed: false },
                { id: 4, title: 'Create admin panel', completed: false }
            ],
            status: 'archived',
            progress: 50,
            createdAt: new Date('2023-09-01').toISOString(),
            updatedAt: new Date('2023-12-15').toISOString(),
        },
        {
            ownerId: 7,
            title: 'Real-time Chat Application',
            description: 'Modern real-time messaging platform with support for one-on-one and group conversations. Features include file sharing, voice messages, read receipts, typing indicators, and end-to-end encryption.',
            members: [7, 1, 5],
            tasks: [
                { id: 1, title: 'Set up WebSocket infrastructure', completed: true },
                { id: 2, title: 'Build chat interface', completed: true },
                { id: 3, title: 'Implement file sharing', completed: true },
                { id: 4, title: 'Add voice message feature', completed: false },
                { id: 5, title: 'Implement end-to-end encryption', completed: false }
            ],
            status: 'active',
            progress: 55,
            createdAt: new Date('2024-01-20').toISOString(),
            updatedAt: new Date('2024-03-10').toISOString(),
        }
    ];

    await db.insert(projects).values(sampleProjects);
    
    console.log('✅ Projects seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});