/**
 * Centralized Mock Data
 * Based on PROJECT_INSTRUCTIONS.md Section 43
 */

export const mockData = {
    categories: [
        { id: 'c1', name: 'Construction & Labour', image: '../assets/cat_construction.jpg' },
        { id: 'c2', name: 'Household Services', image: '../assets/cat_household.jpg' },
        { id: 'c3', name: 'Agriculture', image: '../assets/cat_agriculture.jpg' },
        { id: 'c4', name: 'Stitching & Clothing', image: '../assets/cat_stitching.jpg' },
        { id: 'c5', name: 'Repairs & Maintenance', image: '../assets/cat_repairs.jpg' },
        { id: 'c6', name: 'Other Services', image: '../assets/cat_other.jpg' }
    ],
    
    providers: [
        {
            id: 'p1',
            name: 'Rahul Sharma',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&h=240&fit=crop&crop=face&auto=format&q=80',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&h=240&fit=crop&crop=face&auto=format&q=80',
            categoryId: 'c5',
            categoryName: 'Repairs & Maintenance',
            skill: 'Electrician & Repair',
            about: 'I am a certified electrician with over 8 years of experience in residential and commercial electrical systems. Safety and quality are my top priorities.',
            location: 'Andheri West, Mumbai',
            distance: '2.5 km', // Mock distance for UI
            serviceRadius: '10 km',
            experience: '8 Years',
            status: 'Ready',
            rating: 4.9,
            reviewsCount: 124,
            pricing: '₹300/hr (indicative)',
            services: ['Electrical Wiring', 'Appliance Repair', 'Switchboard Installation', 'Inverter Setup'],
            reviews: [
                { id: 'r1', author: 'Amit D.', rating: 5, text: 'Very professional and fixed the issue quickly.', date: '2 weeks ago' },
                { id: 'r2', author: 'Sneha K.', rating: 4, text: 'Good work, arrived a bit late but fixed everything perfectly.', date: '1 month ago' }
            ]
        },
        {
            id: 'p2',
            name: 'Priya Patel',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&h=240&fit=crop&crop=face&auto=format&q=80',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&h=240&fit=crop&crop=face&auto=format&q=80',
            categoryId: 'c4',
            categoryName: 'Stitching & Clothing',
            skill: 'Professional Tailoring',
            about: 'Specialized in women\'s ethnic wear, custom blouse stitching, and alterations. I ensure perfect fitting and timely delivery.',
            location: 'Borivali East, Mumbai',
            distance: '4.1 km',
            serviceRadius: '5 km',
            experience: '12 Years',
            status: 'Ready',
            rating: 4.8,
            reviewsCount: 89,
            pricing: 'Starting at ₹500/piece',
            services: ['Custom Blouse Stitching', 'Salwar Suit Tailoring', 'Dress Alterations', 'Embroidery Work'],
            reviews: [
                { id: 'r3', author: 'Kavita M.', rating: 5, text: 'Amazing fit! Highly recommend Priya for custom stitching.', date: '1 week ago' }
            ]
        },
        {
            id: 'p3',
            name: 'Vikram Singh',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&h=240&fit=crop&crop=face&auto=format&q=80',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&h=240&fit=crop&crop=face&auto=format&q=80',
            categoryId: 'c1',
            categoryName: 'Construction & Labour',
            skill: 'Masonry & General Labour',
            about: 'Experienced mason and general contractor for small to medium house renovation projects. Fast and reliable team available.',
            location: 'Malad West, Mumbai',
            distance: '6.0 km',
            serviceRadius: '15 km',
            experience: '15 Years',
            status: 'Off Duty',
            rating: 4.5,
            reviewsCount: 42,
            pricing: '₹800/day',
            services: ['Brickwork', 'Plastering', 'Tile Laying', 'Demolition Help'],
            reviews: [
                { id: 'r4', author: 'Rohan B.', rating: 4, text: 'Hardworking team. Did the bathroom tiles very neatly.', date: '3 months ago' }
            ]
        },
        {
            id: 'p4',
            name: 'Sunita Devi',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&h=240&fit=crop&crop=face&auto=format&q=80',
            image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&h=240&fit=crop&crop=face&auto=format&q=80',
            categoryId: 'c2',
            categoryName: 'Household Services',
            skill: 'House Cleaning & Cooking',
            about: 'Reliable and trustworthy domestic help. I can cook North Indian and Gujarati meals, and keep your house spotless.',
            location: 'Goregaon East, Mumbai',
            distance: '1.2 km',
            serviceRadius: '3 km',
            experience: '5 Years',
            status: 'Ready',
            rating: 4.7,
            reviewsCount: 215,
            pricing: '₹200/hr or Monthly Negotiable',
            services: ['Deep Cleaning', 'Daily Cooking', 'Utensils Washing', 'Laundry Setup'],
            reviews: [
                { id: 'r5', author: 'Neha G.', rating: 5, text: 'Sunita makes the best rotis and is always punctual.', date: '2 days ago' },
                { id: 'r6', author: 'Aarti V.', rating: 5, text: 'Very neat and clean work.', date: '1 week ago' }
            ]
        }
    ]
};

mockData.featuredProviders = [
    mockData.providers[0],
    mockData.providers[1]
];
