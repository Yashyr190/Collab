import { db } from '@/db';
import { messages } from '@/db/schema';

async function main() {
    const sampleMessages = [
        // User 1 ↔ User 3 conversation (4 messages)
        {
            senderId: 1,
            receiverId: 3,
            content: "Hey! I saw your post about the SaaS project. I'd love to collaborate!",
            read: true,
            createdAt: new Date('2024-01-05T10:30:00Z').toISOString(),
        },
        {
            senderId: 3,
            receiverId: 1,
            content: "Sure! Do you have experience with React and Node.js?",
            read: true,
            createdAt: new Date('2024-01-05T14:15:00Z').toISOString(),
        },
        {
            senderId: 1,
            receiverId: 3,
            content: "Yes, I've been working with both for about 3 years. I've built several full-stack applications.",
            read: true,
            createdAt: new Date('2024-01-06T09:20:00Z').toISOString(),
        },
        {
            senderId: 3,
            receiverId: 1,
            content: "Perfect! Let's set up a call to discuss the project details. Are you free this Thursday?",
            read: false,
            createdAt: new Date('2024-01-06T16:45:00Z').toISOString(),
        },

        // User 2 ↔ User 5 conversation (3 messages)
        {
            senderId: 2,
            receiverId: 5,
            content: "Are you available for the design system project?",
            read: true,
            createdAt: new Date('2024-01-08T11:00:00Z').toISOString(),
        },
        {
            senderId: 5,
            receiverId: 2,
            content: "I'd be interested! What's the tech stack?",
            read: true,
            createdAt: new Date('2024-01-08T15:30:00Z').toISOString(),
        },
        {
            senderId: 2,
            receiverId: 5,
            content: "We're using Figma and React. When can you start?",
            read: false,
            createdAt: new Date('2024-01-09T10:15:00Z').toISOString(),
        },

        // User 4 ↔ User 7 conversation (3 messages)
        {
            senderId: 4,
            receiverId: 7,
            content: "I noticed you're looking for backend developers. I specialize in API development.",
            read: true,
            createdAt: new Date('2024-01-10T13:20:00Z').toISOString(),
        },
        {
            senderId: 7,
            receiverId: 4,
            content: "Great! Can you share more details about your experience with microservices?",
            read: true,
            createdAt: new Date('2024-01-10T17:00:00Z').toISOString(),
        },
        {
            senderId: 4,
            receiverId: 7,
            content: "I've worked extensively with Docker, Kubernetes, and built RESTful APIs using Node.js and Python.",
            read: false,
            createdAt: new Date('2024-01-11T09:30:00Z').toISOString(),
        },

        // User 6 ↔ User 8 conversation (3 messages)
        {
            senderId: 6,
            receiverId: 8,
            content: "I have some questions about the API architecture for the e-commerce platform.",
            read: true,
            createdAt: new Date('2024-01-12T10:45:00Z').toISOString(),
        },
        {
            senderId: 8,
            receiverId: 6,
            content: "Happy to help! What do you need to know?",
            read: true,
            createdAt: new Date('2024-01-12T14:20:00Z').toISOString(),
        },
        {
            senderId: 6,
            receiverId: 8,
            content: "How are you handling authentication and payment processing? Are you using any specific libraries?",
            read: false,
            createdAt: new Date('2024-01-13T11:00:00Z').toISOString(),
        },

        // User 9 ↔ User 10 conversation (2 messages)
        {
            senderId: 9,
            receiverId: 10,
            content: "Your portfolio looks amazing! Would you be interested in joining our mobile app project?",
            read: true,
            createdAt: new Date('2024-01-15T09:15:00Z').toISOString(),
        },
        {
            senderId: 10,
            receiverId: 9,
            content: "Thanks! I'd love to learn more. What's the timeline and tech stack?",
            read: false,
            createdAt: new Date('2024-01-15T16:30:00Z').toISOString(),
        },

        // User 1 ↔ User 2 conversation (2 messages)
        {
            senderId: 1,
            receiverId: 2,
            content: "I saw your post about needing help with database optimization. I have experience with that.",
            read: true,
            createdAt: new Date('2024-01-18T12:00:00Z').toISOString(),
        },
        {
            senderId: 2,
            receiverId: 1,
            content: "That would be great! We're dealing with slow queries on our PostgreSQL database. Can you take a look?",
            read: false,
            createdAt: new Date('2024-01-18T15:45:00Z').toISOString(),
        },

        // User 3 ↔ User 5 conversation (2 messages)
        {
            senderId: 3,
            receiverId: 5,
            content: "Do you have any experience with TypeScript and Next.js? We're building a new dashboard.",
            read: true,
            createdAt: new Date('2024-01-20T10:30:00Z').toISOString(),
        },
        {
            senderId: 5,
            receiverId: 3,
            content: "Yes, I've been using Next.js 14 with TypeScript for my last two projects. I'd be happy to contribute!",
            read: false,
            createdAt: new Date('2024-01-20T14:00:00Z').toISOString(),
        },

        // User 7 ↔ User 9 conversation (1 message)
        {
            senderId: 7,
            receiverId: 9,
            content: "Hey! I'm putting together a team for a blockchain project. Your smart contract experience would be valuable. Interested?",
            read: false,
            createdAt: new Date('2024-01-22T11:20:00Z').toISOString(),
        },
    ];

    await db.insert(messages).values(sampleMessages);
    
    console.log('✅ Messages seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});