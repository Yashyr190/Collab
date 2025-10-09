import { db } from '@/db';
import { applications } from '@/db/schema';

async function main() {
    const sampleApplications = [
        {
            userId: 2,
            projectId: 1,
            message: 'I have 5 years of experience in building dashboards with React and would love to contribute to this project. My expertise includes data visualization and responsive design.',
            status: 'accepted',
            createdAt: new Date('2024-11-15T10:30:00Z').toISOString(),
            updatedAt: new Date('2024-11-16T14:20:00Z').toISOString(),
        },
        {
            userId: 6,
            projectId: 2,
            message: 'I\'m interested in working on the analytics features. I have experience with data visualization libraries like Chart.js and D3.js.',
            status: 'pending',
            createdAt: new Date('2024-12-01T09:15:00Z').toISOString(),
            updatedAt: new Date('2024-12-01T09:15:00Z').toISOString(),
        },
        {
            userId: 8,
            projectId: 3,
            message: 'I\'m a data scientist and would love to help with the fitness tracking algorithms. I have experience with machine learning models for health data analysis.',
            status: 'accepted',
            createdAt: new Date('2024-11-20T16:45:00Z').toISOString(),
            updatedAt: new Date('2024-11-22T11:30:00Z').toISOString(),
        },
        {
            userId: 4,
            projectId: 5,
            message: 'I have experience with blockchain technology and TypeScript. Would be great to join and contribute to the crypto portfolio features!',
            status: 'pending',
            createdAt: new Date('2024-11-28T13:20:00Z').toISOString(),
            updatedAt: new Date('2024-11-28T13:20:00Z').toISOString(),
        },
        {
            userId: 9,
            projectId: 1,
            message: 'I\'m a backend developer looking to expand my skills into e-commerce. I have strong experience with Node.js and database optimization.',
            status: 'rejected',
            createdAt: new Date('2024-11-18T08:00:00Z').toISOString(),
            updatedAt: new Date('2024-11-19T10:45:00Z').toISOString(),
        },
        {
            userId: 3,
            projectId: 4,
            message: 'As a product manager, I can help with feature planning and user research. I have experience conducting user interviews and creating product roadmaps.',
            status: 'accepted',
            createdAt: new Date('2024-11-25T14:30:00Z').toISOString(),
            updatedAt: new Date('2024-11-27T09:15:00Z').toISOString(),
        },
        {
            userId: 7,
            projectId: 8,
            message: 'I have DevOps experience and can help with deployment and scaling. Proficient in Docker, Kubernetes, and CI/CD pipelines.',
            status: 'pending',
            createdAt: new Date('2024-12-03T11:00:00Z').toISOString(),
            updatedAt: new Date('2024-12-03T11:00:00Z').toISOString(),
        },
        {
            userId: 10,
            projectId: 6,
            message: 'I\'d like to contribute design components to the library. I have experience creating accessible and reusable UI components.',
            status: 'rejected',
            createdAt: new Date('2024-11-22T15:45:00Z').toISOString(),
            updatedAt: new Date('2024-11-23T16:30:00Z').toISOString(),
        },
    ];

    await db.insert(applications).values(sampleApplications);
    
    console.log('✅ Applications seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});