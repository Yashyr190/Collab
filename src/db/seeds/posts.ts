import { db } from '@/db';
import { posts } from '@/db/schema';

async function main() {
    const samplePosts = [
        {
            userId: 1,
            title: 'Looking for React developer for SaaS project',
            description: 'We are building a project management SaaS platform and need an experienced React developer. The project involves complex state management and real-time collaboration features. Expected duration: 3-4 months.',
            tags: ['development', 'startup', 'web'],
            type: 'collab',
            status: 'open',
            createdAt: new Date('2024-11-15').toISOString(),
        },
        {
            userId: 3,
            title: 'Mobile app hackathon team forming',
            description: 'Join our team for the upcoming 48-hour hackathon focused on social impact apps. We are looking for developers, designers, and product thinkers. Experience with React Native or Flutter is a plus.',
            tags: ['hackathon', 'mobile'],
            type: 'project',
            status: 'open',
            createdAt: new Date('2024-11-20').toISOString(),
        },
        {
            userId: 5,
            title: 'Best practices for API design?',
            description: 'I am designing a RESTful API for a microservices architecture and would love to hear your thoughts on versioning, authentication, and documentation strategies. What tools and patterns do you recommend?',
            tags: ['development', 'web'],
            type: 'discussion',
            status: 'open',
            createdAt: new Date('2024-11-25').toISOString(),
        },
        {
            userId: 4,
            title: 'Need UX designer for ed-tech startup',
            description: 'Our education technology startup is looking for a talented UX designer to help create intuitive learning experiences. We have secured seed funding and are ready to move fast. Remote work possible.',
            tags: ['design', 'startup'],
            type: 'collab',
            status: 'in_progress',
            createdAt: new Date('2024-11-10').toISOString(),
        },
        {
            userId: 5,
            title: 'Data visualization project collaboration',
            description: 'Working on an open-source data visualization library that makes complex datasets accessible. Looking for contributors who are passionate about D3.js, Canvas API, or WebGL. All skill levels welcome.',
            tags: ['data', 'development'],
            type: 'project',
            status: 'open',
            createdAt: new Date('2024-12-01').toISOString(),
        },
        {
            userId: 4,
            title: 'Marketing strategy for tech products',
            description: 'Let us discuss effective marketing strategies for B2B SaaS products. Topics include content marketing, SEO, paid ads, and community building. Share your experiences and learn from others.',
            tags: ['marketing', 'startup'],
            type: 'discussion',
            status: 'open',
            createdAt: new Date('2024-12-05').toISOString(),
        },
        {
            userId: 7,
            title: 'AI chatbot project - seeking contributors',
            description: 'Building an AI-powered customer support chatbot using GPT-4 and LangChain. The project is open source and we need help with prompt engineering, integration testing, and documentation.',
            tags: ['AI', 'development'],
            type: 'project',
            status: 'open',
            createdAt: new Date('2024-11-28').toISOString(),
        },
        {
            userId: 2,
            title: 'E-commerce platform redesign help needed',
            description: 'Looking for a UI/UX designer to help redesign our e-commerce platform. Focus on improving conversion rates and user experience. Must have experience with design systems and accessibility standards.',
            tags: ['design', 'web'],
            type: 'collab',
            status: 'open',
            createdAt: new Date('2024-12-08').toISOString(),
        },
        {
            userId: 9,
            title: 'DevOps best practices discussion',
            description: 'What are your go-to tools and practices for CI/CD pipelines? I am particularly interested in Docker, Kubernetes, and infrastructure as code. Let us share knowledge and improve our DevOps workflows.',
            tags: ['development', 'web'],
            type: 'discussion',
            status: 'open',
            createdAt: new Date('2024-12-03').toISOString(),
        },
        {
            userId: 8,
            title: 'Content creators wanted for tech blog',
            description: 'We are launching a tech blog focused on web development tutorials and industry insights. Looking for writers who can create in-depth technical content. Compensation available for quality contributions.',
            tags: ['content', 'marketing'],
            type: 'collab',
            status: 'open',
            createdAt: new Date('2024-11-22').toISOString(),
        },
        {
            userId: 7,
            title: 'Fitness tracking app development',
            description: 'Developing a mobile fitness app with AI-powered workout recommendations. Currently in active development phase. Need help with backend API development and database optimization for real-time data sync.',
            tags: ['mobile', 'development'],
            type: 'project',
            status: 'in_progress',
            createdAt: new Date('2024-11-05').toISOString(),
        },
        {
            userId: 6,
            title: 'Startup idea validation - let us discuss',
            description: 'I have an idea for a peer-to-peer skill-sharing platform and would love feedback from the community. What validation methods have worked for you? How do you assess market fit before building?',
            tags: ['startup'],
            type: 'discussion',
            status: 'open',
            createdAt: new Date('2024-12-10').toISOString(),
        },
        {
            userId: 1,
            title: 'Looking for Python mentor',
            description: 'I am transitioning from JavaScript to Python for backend development and data science. Found an amazing mentor who has helped me level up my skills significantly. Thanks to everyone who reached out!',
            tags: ['development'],
            type: 'collab',
            status: 'closed',
            createdAt: new Date('2024-10-15').toISOString(),
        },
        {
            userId: 3,
            title: 'Open source contribution opportunity',
            description: 'Our web framework project is looking for contributors. Great for beginners wanting to get into open source. We have issues labeled as good first issue and provide mentorship for new contributors.',
            tags: ['development', 'web'],
            type: 'project',
            status: 'open',
            createdAt: new Date('2024-12-07').toISOString(),
        },
        {
            userId: 8,
            title: 'Social media strategy workshop',
            description: 'Hosting a virtual workshop on building social media presence for tech products. We will cover content planning, engagement strategies, and analytics. Everyone is welcome to join and share their experiences.',
            tags: ['marketing', 'content'],
            type: 'discussion',
            status: 'open',
            createdAt: new Date('2024-12-12').toISOString(),
        },
    ];

    await db.insert(posts).values(samplePosts);
    
    console.log('✅ Posts seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});