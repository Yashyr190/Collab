import { db } from '@/db';
import { applications } from '@/db/schema';

async function main() {
    const sampleApplications = [
        {
            projectId: 1,
            userId: 3,
            message: "I'm very interested in contributing to TaskMaster Pro. I have 3 years of experience with React and have built similar task management features in previous projects. I'd love to help with the team collaboration features.",
            status: 'accepted',
            createdAt: new Date('2024-01-15').toISOString(),
            updatedAt: new Date('2024-01-16').toISOString(),
        },
        {
            projectId: 2,
            userId: 5,
            message: "I've been working with Vue.js for the past 2 years and I'm passionate about building responsive, user-friendly e-commerce platforms. I noticed your focus on modern UI/UX and would love to contribute my frontend expertise to make this project successful.",
            status: 'pending',
            createdAt: new Date('2024-02-20').toISOString(),
            updatedAt: new Date('2024-02-20').toISOString(),
        },
        {
            projectId: 3,
            userId: 7,
            message: "As a full-stack developer with experience in Node.js and Express, I'm excited about the opportunity to work on your API development project. I have a strong background in RESTful architecture and can help build scalable backend solutions.",
            status: 'accepted',
            createdAt: new Date('2024-01-28').toISOString(),
            updatedAt: new Date('2024-01-30').toISOString(),
        },
        {
            projectId: 4,
            userId: 2,
            message: "I'm a mobile developer specializing in React Native and have shipped several apps to both iOS and Android stores. Your fitness tracker project aligns perfectly with my interests in health tech, and I'd be thrilled to contribute to the development.",
            status: 'rejected',
            createdAt: new Date('2024-02-05').toISOString(),
            updatedAt: new Date('2024-02-08').toISOString(),
        },
        {
            projectId: 5,
            userId: 4,
            message: "I've been following the growth of AI-powered applications and have hands-on experience with machine learning frameworks like TensorFlow. I'm eager to contribute to your AI assistant project and help implement intelligent features that enhance user experience.",
            status: 'pending',
            createdAt: new Date('2024-02-25').toISOString(),
            updatedAt: new Date('2024-02-25').toISOString(),
        },
        {
            projectId: 1,
            userId: 8,
            message: "I have extensive experience in project management tools and agile methodologies. I believe my background in building collaborative features and real-time updates would be valuable for TaskMaster Pro's development.",
            status: 'accepted',
            createdAt: new Date('2024-02-10').toISOString(),
            updatedAt: new Date('2024-02-12').toISOString(),
        },
        {
            projectId: 3,
            userId: 6,
            message: "I'm a backend engineer with 4 years of experience in microservices architecture. I've reviewed your API project requirements and I'm confident I can help design robust endpoints and ensure optimal performance for your platform.",
            status: 'pending',
            createdAt: new Date('2024-02-18').toISOString(),
            updatedAt: new Date('2024-02-18').toISOString(),
        },
        {
            projectId: 2,
            userId: 9,
            message: "I'm interested in joining your e-commerce platform project, but I primarily have experience with Angular rather than Vue.js. While I'm willing to learn, I understand if you're looking for someone with more specific framework experience.",
            status: 'rejected',
            createdAt: new Date('2024-01-22').toISOString(),
            updatedAt: new Date('2024-01-25').toISOString(),
        }
    ];

    await db.insert(applications).values(sampleApplications);
    
    console.log('✅ Applications seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});