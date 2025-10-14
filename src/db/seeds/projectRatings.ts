import { db } from '@/db';
import { projectRatings } from '@/db/schema';

async function main() {
    const sampleRatings = [
        // Project 1 (E-commerce Dashboard): 4 ratings
        {
            projectId: 1,
            userId: 1,
            rating: 5,
            createdAt: new Date('2023-11-15').toISOString(),
        },
        {
            projectId: 1,
            userId: 3,
            rating: 4,
            createdAt: new Date('2023-11-22').toISOString(),
        },
        {
            projectId: 1,
            userId: 5,
            rating: 5,
            createdAt: new Date('2023-12-05').toISOString(),
        },
        {
            projectId: 1,
            userId: 7,
            rating: 4,
            createdAt: new Date('2024-01-10').toISOString(),
        },
        // Project 2 (Social Media Analytics): 3 ratings
        {
            projectId: 2,
            userId: 2,
            rating: 4,
            createdAt: new Date('2023-11-18').toISOString(),
        },
        {
            projectId: 2,
            userId: 4,
            rating: 5,
            createdAt: new Date('2023-12-01').toISOString(),
        },
        {
            projectId: 2,
            userId: 8,
            rating: 5,
            createdAt: new Date('2024-01-05').toISOString(),
        },
        // Project 3 (Mobile Fitness Tracker): 5 ratings
        {
            projectId: 3,
            userId: 1,
            rating: 5,
            createdAt: new Date('2023-11-20').toISOString(),
        },
        {
            projectId: 3,
            userId: 2,
            rating: 5,
            createdAt: new Date('2023-11-28').toISOString(),
        },
        {
            projectId: 3,
            userId: 6,
            rating: 4,
            createdAt: new Date('2023-12-10').toISOString(),
        },
        {
            projectId: 3,
            userId: 9,
            rating: 5,
            createdAt: new Date('2023-12-20').toISOString(),
        },
        {
            projectId: 3,
            userId: 10,
            rating: 4,
            createdAt: new Date('2024-01-08').toISOString(),
        },
        // Project 4 (AI Content Writer): 3 ratings
        {
            projectId: 4,
            userId: 3,
            rating: 5,
            createdAt: new Date('2023-11-25').toISOString(),
        },
        {
            projectId: 4,
            userId: 5,
            rating: 4,
            createdAt: new Date('2023-12-15').toISOString(),
        },
        {
            projectId: 4,
            userId: 7,
            rating: 5,
            createdAt: new Date('2024-01-12').toISOString(),
        },
        // Project 5 (Crypto Portfolio): 2 ratings
        {
            projectId: 5,
            userId: 4,
            rating: 4,
            createdAt: new Date('2023-12-03').toISOString(),
        },
        {
            projectId: 5,
            userId: 8,
            rating: 3,
            createdAt: new Date('2024-01-15').toISOString(),
        },
        // Project 7 (Real-time Chat): 2 ratings
        {
            projectId: 7,
            userId: 6,
            rating: 5,
            createdAt: new Date('2023-12-08').toISOString(),
        },
        {
            projectId: 7,
            userId: 9,
            rating: 4,
            createdAt: new Date('2024-01-18').toISOString(),
        },
    ];

    await db.insert(projectRatings).values(sampleRatings);
    
    console.log('✅ Project ratings seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});