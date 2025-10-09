import { db } from '@/db';
import { messages } from '@/db/schema';

async function main() {
    const sampleMessages = [
        {
            senderId: 1,
            receiverId: 3,
            conversationId: 'conv-1-3',
            text: "Hey! I saw your post about the TaskMaster project. I'd love to contribute!",
            isRead: true,
            timestamp: new Date('2024-01-15T09:30:00').toISOString(),
        },
        {
            senderId: 3,
            receiverId: 1,
            conversationId: 'conv-1-3',
            text: "That's great! We're looking for a React developer. Are you available for a quick call?",
            isRead: true,
            timestamp: new Date('2024-01-15T10:15:00').toISOString(),
        },
        {
            senderId: 1,
            receiverId: 3,
            conversationId: 'conv-1-3',
            text: 'Yes, I\'m free tomorrow afternoon. What time works for you?',
            isRead: false,
            timestamp: new Date('2024-01-15T11:00:00').toISOString(),
        },
        {
            senderId: 2,
            receiverId: 7,
            conversationId: 'conv-2-7',
            text: 'I can help with the FitTrack UI design. Do you have any design guidelines?',
            isRead: true,
            timestamp: new Date('2024-01-16T08:45:00').toISOString(),
        },
        {
            senderId: 7,
            receiverId: 2,
            conversationId: 'conv-2-7',
            text: "Not yet, but I'd love your input on creating them. Can you share some examples?",
            isRead: true,
            timestamp: new Date('2024-01-16T09:20:00').toISOString(),
        },
        {
            senderId: 2,
            receiverId: 7,
            conversationId: 'conv-2-7',
            text: "Sure! I'll send over a mood board and some inspiration by EOD.",
            isRead: false,
            timestamp: new Date('2024-01-16T10:00:00').toISOString(),
        },
        {
            senderId: 4,
            receiverId: 8,
            conversationId: 'conv-4-8',
            text: 'Your content creation skills would be perfect for our startup!',
            isRead: true,
            timestamp: new Date('2024-01-17T14:30:00').toISOString(),
        },
        {
            senderId: 8,
            receiverId: 4,
            conversationId: 'conv-4-8',
            text: 'Thank you! What kind of content are you looking for?',
            isRead: true,
            timestamp: new Date('2024-01-17T15:00:00').toISOString(),
        },
        {
            senderId: 4,
            receiverId: 8,
            conversationId: 'conv-4-8',
            text: 'Blog posts, social media content, and maybe some video scripts.',
            isRead: false,
            timestamp: new Date('2024-01-17T15:45:00').toISOString(),
        },
        {
            senderId: 5,
            receiverId: 9,
            conversationId: 'conv-5-9',
            text: 'Need help setting up the DataViz Pro deployment pipeline.',
            isRead: true,
            timestamp: new Date('2024-01-18T11:00:00').toISOString(),
        },
        {
            senderId: 9,
            receiverId: 5,
            conversationId: 'conv-5-9',
            text: 'I can help with that. Are you using AWS or another cloud provider?',
            isRead: true,
            timestamp: new Date('2024-01-18T11:30:00').toISOString(),
        },
        {
            senderId: 5,
            receiverId: 9,
            conversationId: 'conv-5-9',
            text: "We're planning to use AWS. Docker containers with ECS.",
            isRead: false,
            timestamp: new Date('2024-01-18T12:15:00').toISOString(),
        },
    ];

    await db.insert(messages).values(sampleMessages);
    
    console.log('✅ Messages seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});