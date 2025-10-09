import { db } from '@/db';
import { projects } from '@/db/schema';

async function main() {
    const sampleProjects = [
        {
            title: 'TaskMaster Pro',
            description: 'A modern task management platform for teams',
            ownerId: 3,
            members: JSON.stringify([3, 1, 2]),
            tasks: JSON.stringify([
                { id: 1, title: 'Design dashboard UI', status: 'completed' },
                { id: 2, title: 'Implement authentication', status: 'in_progress' },
                { id: 3, title: 'Add team collaboration features', status: 'todo' }
            ]),
            status: 'active',
            progress: 65,
            createdAt: new Date('2024-01-10').toISOString(),
            updatedAt: new Date('2024-03-15').toISOString(),
        },
        {
            title: 'FitTrack',
            description: 'Track your workouts and nutrition with AI-powered insights',
            ownerId: 7,
            members: JSON.stringify([7, 5, 2]),
            tasks: JSON.stringify([
                { id: 1, title: 'Mobile UI design', status: 'completed' },
                { id: 2, title: 'Build workout tracking', status: 'in_progress' }
            ]),
            status: 'active',
            progress: 45,
            createdAt: new Date('2024-01-20').toISOString(),
            updatedAt: new Date('2024-03-18').toISOString(),
        },
        {
            title: 'ContentHub',
            description: 'Streamline content creation and publishing workflows',
            ownerId: 8,
            members: JSON.stringify([8, 4, 1]),
            tasks: JSON.stringify([
                { id: 1, title: 'Content editor implementation', status: 'in_progress' },
                { id: 2, title: 'SEO optimization tools', status: 'todo' }
            ]),
            status: 'active',
            progress: 30,
            createdAt: new Date('2024-02-01').toISOString(),
            updatedAt: new Date('2024-03-20').toISOString(),
        },
        {
            title: 'DataViz Pro',
            description: 'Turn complex data into beautiful, interactive visualizations',
            ownerId: 5,
            members: JSON.stringify([5, 3]),
            tasks: JSON.stringify([
                { id: 1, title: 'Chart library integration', status: 'completed' },
                { id: 2, title: 'Real-time data updates', status: 'completed' },
                { id: 3, title: 'Export features', status: 'in_progress' }
            ]),
            status: 'active',
            progress: 80,
            createdAt: new Date('2024-01-05').toISOString(),
            updatedAt: new Date('2024-03-22').toISOString(),
        },
        {
            title: 'EduConnect',
            description: 'Connecting students with mentors and learning resources',
            ownerId: 6,
            members: JSON.stringify([6, 2, 4, 8]),
            tasks: JSON.stringify([
                { id: 1, title: 'User profiles', status: 'completed' },
                { id: 2, title: 'Matching algorithm', status: 'in_progress' },
                { id: 3, title: 'Video call integration', status: 'planning' }
            ]),
            status: 'planning',
            progress: 20,
            createdAt: new Date('2024-02-15').toISOString(),
            updatedAt: new Date('2024-03-10').toISOString(),
        }
    ];

    await db.insert(projects).values(sampleProjects);
    
    console.log('✅ Projects seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});