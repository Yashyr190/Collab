import { db } from '@/db';
import { users } from '@/db/schema';
import bcrypt from 'bcrypt';

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const sampleUsers = [
        {
            name: 'Alex Chen',
            email: 'alex.chen@example.com',
            password: hashedPassword,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
            bio: 'CS student passionate about web development',
            skills: JSON.stringify(['React', 'Node.js', 'TypeScript']),
            xp: 2450,
            badges: JSON.stringify(['Early Adopter', 'Team Player']),
            role: 'user',
            createdAt: new Date('2024-10-15').toISOString(),
        },
        {
            name: 'Sarah Martinez',
            email: 'sarah.martinez@example.com',
            password: hashedPassword,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
            bio: 'Creating delightful user experiences',
            skills: JSON.stringify(['Figma', 'UI Design', 'User Research']),
            xp: 3800,
            badges: JSON.stringify(['Design Master', 'Mentor']),
            role: 'user',
            createdAt: new Date('2024-09-20').toISOString(),
        },
        {
            name: 'James Wilson',
            email: 'james.wilson@example.com',
            password: hashedPassword,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
            bio: 'Building scalable web applications',
            skills: JSON.stringify(['Python', 'Django', 'React']),
            xp: 4500,
            badges: JSON.stringify(['Code Wizard', 'Project Leader']),
            role: 'user',
            createdAt: new Date('2024-09-05').toISOString(),
        },
        {
            name: 'Emily Brown',
            email: 'emily.brown@example.com',
            password: hashedPassword,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
            bio: 'Helping startups grow their audience',
            skills: JSON.stringify(['Content Marketing', 'SEO', 'Social Media']),
            xp: 1200,
            badges: JSON.stringify(['Community Builder']),
            role: 'user',
            createdAt: new Date('2024-11-10').toISOString(),
        },
        {
            name: 'Michael Lee',
            email: 'michael.lee@example.com',
            password: hashedPassword,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
            bio: 'Turning data into insights',
            skills: JSON.stringify(['Python', 'Machine Learning', 'SQL']),
            xp: 3200,
            badges: JSON.stringify(['Data Guru']),
            role: 'user',
            createdAt: new Date('2024-10-01').toISOString(),
        },
        {
            name: 'Jessica Taylor',
            email: 'jessica.taylor@example.com',
            password: hashedPassword,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica',
            bio: 'Shipping products users love',
            skills: JSON.stringify(['Product Strategy', 'Agile', 'Stakeholder Management']),
            xp: 2900,
            badges: JSON.stringify(['Innovator']),
            role: 'user',
            createdAt: new Date('2024-10-20').toISOString(),
        },
        {
            name: 'David Kim',
            email: 'david.kim@example.com',
            password: hashedPassword,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
            bio: 'Crafting mobile experiences',
            skills: JSON.stringify(['React Native', 'Swift', 'Firebase']),
            xp: 3500,
            badges: JSON.stringify(['Mobile Expert', 'Contributor']),
            role: 'user',
            createdAt: new Date('2024-09-25').toISOString(),
        },
        {
            name: 'Lisa Anderson',
            email: 'lisa.anderson@example.com',
            password: hashedPassword,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
            bio: 'Creating engaging content for tech startups',
            skills: JSON.stringify(['Video Editing', 'Copywriting', 'Storytelling']),
            xp: 1800,
            badges: JSON.stringify(['Creator Badge']),
            role: 'user',
            createdAt: new Date('2024-11-01').toISOString(),
        },
        {
            name: 'Robert Johnson',
            email: 'robert.johnson@example.com',
            password: hashedPassword,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
            bio: 'Building reliable infrastructure',
            skills: JSON.stringify(['Docker', 'Kubernetes', 'AWS']),
            xp: 4200,
            badges: JSON.stringify(['Infrastructure Pro', 'Team Player']),
            role: 'user',
            createdAt: new Date('2024-09-12').toISOString(),
        },
        {
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
            bio: 'Platform administrator',
            skills: JSON.stringify(['Platform Management', 'Moderation', 'Community']),
            xp: 5000,
            badges: JSON.stringify(['Admin', 'Founder']),
            role: 'admin',
            createdAt: new Date('2024-08-01').toISOString(),
        },
    ];

    await db.insert(users).values(sampleUsers);
    
    console.log('✅ Users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});