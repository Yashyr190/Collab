import { db } from '@/db';
import { endorsements } from '@/db/schema';

async function main() {
    const sampleEndorsements = [
        {
            userId: 1,
            endorsedBy: 3,
            skill: 'React',
            createdAt: new Date('2024-01-15T10:30:00').toISOString(),
        },
        {
            userId: 1,
            endorsedBy: 2,
            skill: 'TypeScript',
            createdAt: new Date('2024-01-16T14:20:00').toISOString(),
        },
        {
            userId: 2,
            endorsedBy: 7,
            skill: 'UI Design',
            createdAt: new Date('2024-01-17T09:15:00').toISOString(),
        },
        {
            userId: 2,
            endorsedBy: 3,
            skill: 'Figma',
            createdAt: new Date('2024-01-18T11:45:00').toISOString(),
        },
        {
            userId: 3,
            endorsedBy: 1,
            skill: 'React',
            createdAt: new Date('2024-01-19T16:30:00').toISOString(),
        },
        {
            userId: 3,
            endorsedBy: 9,
            skill: 'Python',
            createdAt: new Date('2024-01-20T13:10:00').toISOString(),
        },
        {
            userId: 5,
            endorsedBy: 3,
            skill: 'Machine Learning',
            createdAt: new Date('2024-01-21T10:00:00').toISOString(),
        },
        {
            userId: 5,
            endorsedBy: 9,
            skill: 'SQL',
            createdAt: new Date('2024-01-22T15:25:00').toISOString(),
        },
        {
            userId: 7,
            endorsedBy: 2,
            skill: 'React Native',
            createdAt: new Date('2024-01-23T12:40:00').toISOString(),
        },
        {
            userId: 8,
            endorsedBy: 4,
            skill: 'Content Marketing',
            createdAt: new Date('2024-01-24T09:50:00').toISOString(),
        },
        {
            userId: 9,
            endorsedBy: 5,
            skill: 'Docker',
            createdAt: new Date('2024-01-25T14:15:00').toISOString(),
        },
        {
            userId: 9,
            endorsedBy: 3,
            skill: 'AWS',
            createdAt: new Date('2024-01-26T11:05:00').toISOString(),
        },
    ];

    await db.insert(endorsements).values(sampleEndorsements);
    
    console.log('✅ Endorsements seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});