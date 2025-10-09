import { db } from '@/db';
import { endorsements } from '@/db/schema';

async function main() {
    const sampleEndorsements = [
        {
            userId: 1,
            endorsedBy: 5,
            skill: 'React',
            createdAt: new Date('2024-11-15').toISOString(),
        },
        {
            userId: 1,
            endorsedBy: 9,
            skill: 'Node.js',
            createdAt: new Date('2024-11-18').toISOString(),
        },
        {
            userId: 2,
            endorsedBy: 10,
            skill: 'UI/UX Design',
            createdAt: new Date('2024-11-20').toISOString(),
        },
        {
            userId: 2,
            endorsedBy: 3,
            skill: 'Figma',
            createdAt: new Date('2024-11-25').toISOString(),
        },
        {
            userId: 3,
            endorsedBy: 1,
            skill: 'Product Management',
            createdAt: new Date('2024-11-28').toISOString(),
        },
        {
            userId: 4,
            endorsedBy: 9,
            skill: 'TypeScript',
            createdAt: new Date('2024-12-02').toISOString(),
        },
        {
            userId: 5,
            endorsedBy: 7,
            skill: 'Node.js',
            createdAt: new Date('2024-12-05').toISOString(),
        },
        {
            userId: 5,
            endorsedBy: 1,
            skill: 'Python',
            createdAt: new Date('2024-12-08').toISOString(),
        },
        {
            userId: 7,
            endorsedBy: 5,
            skill: 'DevOps',
            createdAt: new Date('2024-12-10').toISOString(),
        },
        {
            userId: 8,
            endorsedBy: 9,
            skill: 'Data Science',
            createdAt: new Date('2024-12-12').toISOString(),
        },
        {
            userId: 9,
            endorsedBy: 1,
            skill: 'GraphQL',
            createdAt: new Date('2024-12-15').toISOString(),
        },
        {
            userId: 9,
            endorsedBy: 5,
            skill: 'TypeScript',
            createdAt: new Date('2024-12-18').toISOString(),
        },
        {
            userId: 10,
            endorsedBy: 2,
            skill: 'Design',
            createdAt: new Date('2024-12-20').toISOString(),
        },
        {
            userId: 10,
            endorsedBy: 4,
            skill: 'Figma',
            createdAt: new Date('2024-12-25').toISOString(),
        },
        {
            userId: 6,
            endorsedBy: 3,
            skill: 'Marketing',
            createdAt: new Date('2024-12-28').toISOString(),
        },
    ];

    await db.insert(endorsements).values(sampleEndorsements);
    
    console.log('✅ Endorsements seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});