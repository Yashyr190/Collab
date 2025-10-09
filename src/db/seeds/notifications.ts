import { db } from '@/db';
import { notifications } from '@/db/schema';

async function main() {
    const sampleNotifications = [
        {
            userId: 1,
            type: 'message',
            message: 'You have a new message from James Wilson',
            link: '/messages/conv-1-3',
            isRead: true,
            createdAt: new Date('2024-01-15T10:30:00').toISOString(),
        },
        {
            userId: 1,
            type: 'invite',
            message: "You've been invited to join TaskMaster Pro project",
            link: '/projects/1',
            isRead: true,
            createdAt: new Date('2024-01-14T14:20:00').toISOString(),
        },
        {
            userId: 2,
            type: 'message',
            message: 'David Kim sent you a message',
            link: '/messages/conv-2-7',
            isRead: false,
            createdAt: new Date('2024-01-16T09:15:00').toISOString(),
        },
        {
            userId: 3,
            type: 'update',
            message: 'TaskMaster Pro progress updated to 65%',
            link: '/projects/1',
            isRead: false,
            createdAt: new Date('2024-01-16T11:45:00').toISOString(),
        },
        {
            userId: 4,
            type: 'message',
            message: 'New message from Lisa Anderson',
            link: '/messages/conv-4-8',
            isRead: false,
            createdAt: new Date('2024-01-16T13:30:00').toISOString(),
        },
        {
            userId: 5,
            type: 'message',
            message: 'Robert Johnson replied to your message',
            link: '/messages/conv-5-9',
            isRead: true,
            createdAt: new Date('2024-01-15T16:20:00').toISOString(),
        },
        {
            userId: 5,
            type: 'badge',
            message: "Congratulations! You've earned the 'Data Guru' badge",
            link: '/profile',
            isRead: false,
            createdAt: new Date('2024-01-16T08:00:00').toISOString(),
        },
        {
            userId: 7,
            type: 'update',
            message: 'FitTrack project has a new team member',
            link: '/projects/2',
            isRead: true,
            createdAt: new Date('2024-01-14T12:00:00').toISOString(),
        },
        {
            userId: 8,
            type: 'invite',
            message: "You've been invited to join ContentHub project",
            link: '/projects/3',
            isRead: false,
            createdAt: new Date('2024-01-16T10:30:00').toISOString(),
        },
        {
            userId: 2,
            type: 'badge',
            message: "You've unlocked the 'Design Master' badge!",
            link: '/profile',
            isRead: true,
            createdAt: new Date('2024-01-13T15:45:00').toISOString(),
        },
        {
            userId: 3,
            type: 'message',
            message: 'Alex Chen sent you a message',
            link: '/messages/conv-1-3',
            isRead: true,
            createdAt: new Date('2024-01-12T09:30:00').toISOString(),
        },
        {
            userId: 6,
            type: 'update',
            message: 'EduConnect project status changed to planning',
            link: '/projects/5',
            isRead: false,
            createdAt: new Date('2024-01-16T14:15:00').toISOString(),
        },
        {
            userId: 1,
            type: 'badge',
            message: 'New achievement unlocked: Early Adopter',
            link: '/profile',
            isRead: true,
            createdAt: new Date('2024-01-10T08:00:00').toISOString(),
        },
        {
            userId: 9,
            type: 'message',
            message: 'Michael Lee needs help with deployment',
            link: '/messages/conv-5-9',
            isRead: false,
            createdAt: new Date('2024-01-16T15:00:00').toISOString(),
        },
        {
            userId: 4,
            type: 'update',
            message: 'Your post received 10 new views',
            link: '/posts/6',
            isRead: false,
            createdAt: new Date('2024-01-16T12:30:00').toISOString(),
        }
    ];

    await db.insert(notifications).values(sampleNotifications);
    
    console.log('✅ Notifications seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});