import { db } from '@/db';
import { notifications } from '@/db/schema';

async function main() {
    const sampleNotifications = [
        {
            userId: 1,
            type: 'message',
            message: 'You have a new message from Sarah Miller',
            read: false,
            createdAt: new Date('2024-12-15T09:30:00Z').toISOString(),
        },
        {
            userId: 3,
            type: 'application',
            message: "Your application to 'E-commerce Dashboard' has been accepted",
            read: true,
            createdAt: new Date('2024-12-16T14:20:00Z').toISOString(),
        },
        {
            userId: 5,
            type: 'project_update',
            message: "New task added to 'Social Media Analytics Tool'",
            read: false,
            createdAt: new Date('2024-12-17T10:45:00Z').toISOString(),
        },
        {
            userId: 2,
            type: 'endorsement',
            message: 'Marcus Johnson endorsed you for UI/UX Design',
            read: true,
            createdAt: new Date('2024-12-18T16:10:00Z').toISOString(),
        },
        {
            userId: 7,
            type: 'badge_earned',
            message: "Congratulations! You earned the 'Collaborator' badge",
            read: false,
            createdAt: new Date('2024-12-19T11:30:00Z').toISOString(),
        },
        {
            userId: 4,
            type: 'message',
            message: 'Chris Lee sent you a message',
            read: false,
            createdAt: new Date('2024-12-20T08:15:00Z').toISOString(),
        },
        {
            userId: 8,
            type: 'application',
            message: 'New application received for your project',
            read: true,
            createdAt: new Date('2024-12-21T13:40:00Z').toISOString(),
        },
        {
            userId: 6,
            type: 'message',
            message: 'You have 2 new messages',
            read: false,
            createdAt: new Date('2024-12-22T15:25:00Z').toISOString(),
        },
        {
            userId: 9,
            type: 'project_update',
            message: "'AI Content Writer' progress updated to 100%",
            read: true,
            createdAt: new Date('2024-12-23T10:00:00Z').toISOString(),
        },
        {
            userId: 10,
            type: 'endorsement',
            message: 'Emily Wong endorsed you for Figma',
            read: true,
            createdAt: new Date('2024-12-24T12:30:00Z').toISOString(),
        },
        {
            userId: 2,
            type: 'application',
            message: "Your application to 'Mobile Fitness Tracker' is pending",
            read: false,
            createdAt: new Date('2024-12-25T09:45:00Z').toISOString(),
        },
        {
            userId: 1,
            type: 'badge_earned',
            message: "You earned the 'Top Contributor' badge!",
            read: false,
            createdAt: new Date('2024-12-26T14:15:00Z').toISOString(),
        },
    ];

    await db.insert(notifications).values(sampleNotifications);
    
    console.log('✅ Notifications seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});