// --- Types ---
export interface EventCustomer {
    name: string;
    avatarUrl: string;
}

export type EventCategory = 'today' | 'upcoming' | 'completed' | 'draft';
export type EventStatus = 'Ready' | 'In Progress' | 'Issues' | 'Draft';

export interface TeamgleEvent {
    id: string;
    title: string;
    location: string;
    date: string;
    timeRange: string;
    category: EventCategory;
    workersCount: number;
    workersAssigned: string[];
    status: EventStatus;
    statusColor: string; // Quasar color class string
    progress: number; // 0-100
    customer: EventCustomer;
    rawDate?: Date; // Optional helper for sorting if needed, but we'll use string for display
}

export interface StatItem {
    label: string;
    value: string;
    subtext: string;
    icon: string;
    color: string;
}

export interface EventStats {
    readiness: StatItem;
    staffing: StatItem;
    load: StatItem;
}

export interface EventTimelineItem {
    id: string;
    resource: string; // e.g., "Main Stage", "Security"
    taskName: string;
    startTime: string; // "18:00"
    endTime: string; // "19:30"
    color: string;
}

// --- Helpers ---
const avatars: string[] = [
    'https://cdn.quasar.dev/img/avatar1.jpg',
    'https://cdn.quasar.dev/img/avatar2.jpg',
    'https://cdn.quasar.dev/img/avatar3.jpg',
    'https://cdn.quasar.dev/img/avatar4.jpg',
    'https://cdn.quasar.dev/img/avatar5.jpg',
    'https://cdn.quasar.dev/img/boy-avatar.png'
]

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const formatDate = (date: Date): string => {
    const d = date.getDate();
    const m = months[date.getMonth()];
    const y = date.getFullYear();
    // Pad date if needed? Design shows "July 15, 2024"
    return `${m} ${d.toString().padStart(2, '0')}, ${y}`;
}

const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

// --- Data Generation ---
// We generate this freshly on each call to ensure "Today" is always accurate relative to user runtime
export const getEvents = (): Promise<TeamgleEvent[]> => {
    return new Promise((resolve) => {
        const today = new Date();
        const yesterday = addDays(today, -1);
        const tomorrow = addDays(today, 1);
        const nextWeek = addDays(today, 7);
        const lastMonth = addDays(today, -30);
        const nextMonth = addDays(today, 30);

        setTimeout(() => {
            resolve([
                // TODAY (Category: today)
                {
                    id: '1',
                    title: 'Summer Music Festival - Downtown Arena',
                    location: 'Downtown Arena',
                    date: formatDate(today),
                    timeRange: '09:00 AM - 05:00 PM',
                    category: 'today',
                    workersCount: 45,
                    workersAssigned: [avatars[0], avatars[1], avatars[2], avatars[3]],
                    status: 'Ready',
                    statusColor: 'bg-green-1 text-green-8',
                    progress: 100,
                    customer: { name: 'Aisha Rahman', avatarUrl: avatars[5] }
                },
                {
                    id: '1b',
                    title: 'Morning Briefing',
                    location: 'HQ Meeting Room',
                    date: formatDate(today),
                    timeRange: '08:00 AM - 08:30 AM',
                    category: 'today',
                    workersCount: 12,
                    workersAssigned: [avatars[1]],
                    status: 'Ready',
                    statusColor: 'bg-green-1 text-green-8',
                    progress: 100,
                    customer: { name: 'Team Lead', avatarUrl: avatars[0] }
                },
                {
                    id: '1c',
                    title: 'Equipment Setup',
                    location: 'Downtown Arena',
                    date: formatDate(today),
                    timeRange: '07:00 AM - 09:00 AM',
                    category: 'today',
                    workersCount: 8,
                    workersAssigned: [avatars[2], avatars[3]],
                    status: 'In Progress',
                    statusColor: 'bg-blue-1 text-blue-8',
                    progress: 75,
                    customer: { name: 'Logistics', avatarUrl: avatars[1] }
                },
                {
                    id: '1d',
                    title: 'VIP Entrance Security',
                    location: 'Gate 4',
                    date: formatDate(today),
                    timeRange: '10:00 AM - 06:00 PM',
                    category: 'today',
                    workersCount: 5,
                    workersAssigned: [avatars[4]],
                    status: 'Issues',
                    statusColor: 'bg-red-1 text-red-8',
                    progress: 10,
                    customer: { name: 'Security Chief', avatarUrl: avatars[2] }
                },
                {
                    id: '1e',
                    title: 'Cleanup Crew',
                    location: 'Main Stage',
                    date: formatDate(today),
                    timeRange: '05:00 PM - 08:00 PM',
                    category: 'today',
                    workersCount: 20,
                    workersAssigned: [avatars[0], avatars[5]],
                    status: 'Draft',
                    statusColor: 'bg-grey-3 text-grey-8',
                    progress: 0,
                    customer: { name: 'Operations', avatarUrl: avatars[3] }
                },

                // UPCOMING (Category: upcoming, Future dates)
                {
                    id: '2',
                    title: 'Tech Innovators Conference',
                    location: 'Expo Center',
                    date: formatDate(tomorrow),
                    timeRange: '08:30 AM - 06:00 PM',
                    category: 'upcoming',
                    workersCount: 23,
                    workersAssigned: [avatars[1], avatars[2], avatars[4]],
                    status: 'In Progress',
                    statusColor: 'bg-blue-1 text-blue-8',
                    progress: 90,
                    customer: { name: 'David Lee', avatarUrl: avatars[0] }
                },
                {
                    id: '3',
                    title: 'Annual Charity Gala',
                    location: 'Grand Ballroom',
                    date: formatDate(nextWeek),
                    timeRange: '07:00 PM - 11:00 PM',
                    category: 'upcoming',
                    workersCount: 18,
                    workersAssigned: [avatars[3], avatars[4]],
                    status: 'In Progress',
                    statusColor: 'bg-blue-1 text-blue-8',
                    progress: 40,
                    customer: { name: 'Emily White', avatarUrl: avatars[2] }
                },
                {
                    id: '3b',
                    title: 'Corporate Retreat',
                    location: 'Mountain Lodge',
                    date: formatDate(nextMonth),
                    timeRange: 'All Day',
                    category: 'upcoming',
                    workersCount: 50,
                    workersAssigned: [],
                    status: 'Draft',
                    statusColor: 'bg-grey-3 text-grey-8',
                    progress: 0,
                    customer: { name: 'HR Dept', avatarUrl: avatars[4] }
                },
                {
                    id: '3c',
                    title: 'Product Demo Day',
                    location: 'Showroom B',
                    date: formatDate(addDays(today, 3)),
                    timeRange: '10:00 AM - 04:00 PM',
                    category: 'upcoming',
                    workersCount: 4,
                    workersAssigned: [avatars[1]],
                    status: 'Ready',
                    statusColor: 'bg-green-1 text-green-8',
                    progress: 100,
                    customer: { name: 'Sales Team', avatarUrl: avatars[5] }
                },

                // COMPLETED (Category: completed, Past dates)
                {
                    id: '4',
                    title: 'Winter Sports Expo',
                    location: 'Convention Hall',
                    date: formatDate(yesterday), // Completed yesterday
                    timeRange: '10:00 AM - 07:00 PM',
                    category: 'completed',
                    workersCount: 30,
                    workersAssigned: [avatars[0], avatars[2], avatars[3]],
                    status: 'Ready',
                    statusColor: 'bg-green-1 text-green-8',
                    progress: 100,
                    customer: { name: 'Chris Evans', avatarUrl: avatars[1] }
                },
                {
                    id: '4b',
                    title: 'Regional Qualifier',
                    location: 'Sports Complex',
                    date: formatDate(lastMonth),
                    timeRange: '08:00 AM - 06:00 PM',
                    category: 'completed',
                    workersCount: 100,
                    workersAssigned: [avatars[1], avatars[2], avatars[3], avatars[4], avatars[5]],
                    status: 'Ready',
                    statusColor: 'bg-green-1 text-green-8',
                    progress: 100,
                    customer: { name: 'League', avatarUrl: avatars[0] }
                },
                {
                    id: '5',
                    title: 'City Marathon',
                    location: 'Race Start Line',
                    date: formatDate(addDays(today, -10)),
                    timeRange: '06:00 AM - 02:00 PM',
                    category: 'completed',
                    workersCount: 70,
                    workersAssigned: [avatars[4], avatars[5], avatars[1]],
                    status: 'Issues',
                    statusColor: 'bg-red-1 text-red-8',
                    progress: 100, // Completed events usually 100%
                    customer: { name: 'Sophia Garcia', avatarUrl: avatars[3] }
                },

                // DRAFT (Category: draft, Future dates)
                {
                    id: '6',
                    title: 'Product Launch Preview',
                    location: 'HQ Main Hall',
                    date: formatDate(addDays(today, 14)),
                    timeRange: '10:00 AM - 12:00 PM',
                    category: 'draft',
                    workersCount: 0,
                    workersAssigned: [],
                    status: 'Draft',
                    statusColor: 'bg-grey-3 text-grey-8',
                    progress: 0,
                    customer: { name: 'John Doe', avatarUrl: avatars[5] }
                },
                {
                    id: '6b',
                    title: 'Year End Party',
                    location: 'TBD',
                    date: formatDate(addDays(today, 60)),
                    timeRange: '08:00 PM - 01:00 AM',
                    category: 'draft',
                    workersCount: 0,
                    workersAssigned: [],
                    status: 'Draft',
                    statusColor: 'bg-grey-3 text-grey-8',
                    progress: 0,
                    customer: { name: 'Social Committee', avatarUrl: avatars[2] }
                }
            ])
        }, 500)
    })
}

export const getEventStats = (): Promise<EventStats> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                readiness: {
                    label: 'Event Readiness',
                    value: '3 events fully ready',
                    subtext: '1 event with issues',
                    icon: 'sym_r_task_alt',
                    color: 'blue-1'
                },
                staffing: {
                    label: 'Staffing Status',
                    value: '55 workers assigned today',
                    subtext: '12 workers missing documents',
                    icon: 'sym_r_group',
                    color: 'orange-1'
                },
                load: {
                    label: 'Weekly Event Load',
                    value: '7 events this week',
                    subtext: '3 high-demand days',
                    icon: 'sym_r_trending_up',
                    color: 'grey-1'
                }
            })
        }, 500)
    })
}

export const getEventById = async (id: string): Promise<TeamgleEvent | undefined> => {
    const events = await getEvents();
    return events.find(e => e.id === id);
}

export const getEventTimeline = (eventId: string): Promise<EventTimelineItem[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 't1', resource: 'Main Stage', taskName: 'Sound Check', startTime: '16:00', endTime: '17:30', color: 'blue-5' },
                { id: 't2', resource: 'Main Stage', taskName: 'Opening Act', startTime: '18:00', endTime: '18:45', color: 'purple-5' },
                { id: 't3', resource: 'Main Stage', taskName: 'Headline Performance', startTime: '19:00', endTime: '21:00', color: 'deep-purple-5' },
                { id: 't4', resource: 'Entrance', taskName: 'Security Briefing', startTime: '16:30', endTime: '17:00', color: 'grey-7' },
                { id: 't5', resource: 'Entrance', taskName: 'Doors Open', startTime: '17:30', endTime: '22:00', color: 'green-5' },
                { id: 't6', resource: 'Backstage', taskName: 'Catering Setup', startTime: '15:00', endTime: '16:30', color: 'orange-5' },
                { id: 't7', resource: 'Backstage', taskName: 'VIP Meet & Greet', startTime: '21:15', endTime: '22:00', color: 'pink-5' },
            ]);
        }, 300)
    })
}
// --- Live Dashboard Data Types ---
export interface LiveEventData {
    activeIssues: Array<{
        id: number;
        title: string;
        reporterName: string;
        reporterAvatar: string;
        timeAgo: string;
        severity: 'high' | 'medium' | 'low';
    }>;
    staffLate: Array<{
        id: number;
        name: string;
        role: string;
        avatar: string;
        lateBy: string;
    }>;
    staffActive: Array<{
        id: number;
        name: string;
        role: string;
        avatar: string;
        location: string;
        shiftEnd: string;
    }>;
    staffDone: Array<{
        id: number;
        name: string;
        role: string;
        avatar: string;
        checkOut: string;
    }>;
}

export const getLiveDashboardData = (eventId: string): Promise<LiveEventData> => {
    return new Promise((resolve) => {
        // Mock data varying slightly by ID hash or simple custom logic
        setTimeout(() => {
            // Default Data
            const data: LiveEventData = {
                activeIssues: [
                    { id: 1, title: 'No Water at Bar 2', reporterName: 'Sarah J.', reporterAvatar: avatars[1], timeAgo: '15m ago', severity: 'high' },
                    { id: 2, title: 'Generator noise complaint', reporterName: 'Mike T.', reporterAvatar: avatars[3], timeAgo: '5m ago', severity: 'medium' },
                    { id: 4, title: 'Request: Extra walkie-talkie batteries', reporterName: 'John D.', reporterAvatar: avatars[0], timeAgo: '2m ago', severity: 'low' }
                ],
                staffLate: [
                    { id: 101, name: 'David Cohen', role: 'Security', avatar: avatars[0], lateBy: '15m' },
                    { id: 102, name: 'Lisa Ray', role: 'Server', avatar: avatars[4], lateBy: '8m' }
                ],
                staffActive: [
                    { id: 201, name: 'John Doe', role: 'Head Security', avatar: avatars[2], location: 'Main Gate', shiftEnd: '23:00' },
                    { id: 202, name: 'Emma W.', role: 'Bar Manager', avatar: avatars[5], location: 'VIP Lounge', shiftEnd: '00:00' },
                    { id: 203, name: 'Chris P.', role: 'Sound Tech', avatar: avatars[5], location: 'Stage Left', shiftEnd: '22:00' }
                ],
                staffDone: [
                    { id: 301, name: 'George B.', role: 'Setup Crew', avatar: avatars[0], checkOut: '17:45' }
                ]
            }

            // Customization for "Morning Briefing" (1b)
            if (eventId === '1b') {
                data.activeIssues = [] // Specific event has no issues
                data.staffLate = []
                data.staffActive = [
                    { id: 205, name: 'Alice M.', role: 'Speaker', avatar: avatars[1], location: 'Podium', shiftEnd: '09:00' }
                ]
            }

            // Customization for "VIP Entrance Security" (1d) - Has critical issues
            if (eventId === '1d') {
                data.activeIssues.push({ id: 3, title: 'Ticket Scanner Failure', reporterName: 'Ken', reporterAvatar: avatars[2], timeAgo: '1m ago', severity: 'high' })
            }

            resolve(data)
        }, 300)
    })
}

// --- Post-Event Summary Data ---
export interface EventSummaryData {
    finance: {
        revenue: number;
        revenueTarget: number;
        laborCost: number;
        laborCostEstimated: number; // For "Planned vs Actual"
        netProfit: number;
        margin: number;
    };
    kpis: {
        attendanceAccuracy: number; // %
        standbyUtilization: number; // %
        checkInEfficiency: string; // e.g. "45s"
    };
    rolesData: {
        labels: string[];
        data: number[];
        colors: string[];
    };
    incidents: Array<{
        type: string;
        reporter: string;
        timeToResolve: string;
        outcome: string;
        isLongResolve: boolean; // > 30 mins
    }>;
    qualitative: {
        sentimentScore: number; // 1-5
        managerDebrief: string;
        aiRecommendations: Array<{
            title: string;
            desc: string;
            icon: string;
        }>;
    };
}

export const getEventSummary = (eventId: string): Promise<EventSummaryData> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                finance: {
                    revenue: 45000,
                    revenueTarget: 42000,
                    laborCost: 12500,
                    laborCostEstimated: 11000, // Actual > Estimated -> Orange
                    netProfit: 32500,
                    margin: 72
                },
                kpis: {
                    attendanceAccuracy: 94,
                    standbyUtilization: 100, // 2/2 called
                    checkInEfficiency: '42s'
                },
                rolesData: {
                    labels: ['Security', 'Bar Staff', 'General', 'Tech'],
                    data: [15, 8, 12, 4],
                    colors: ['#F97316', '#3B82F6', '#22C55E', '#A855F7'] // Orange, Blue, Green, Purple
                },
                incidents: [
                    { type: 'Safety', reporter: 'David C.', timeToResolve: '15m', outcome: 'Resolved on site', isLongResolve: false },
                    { type: 'Logistics', reporter: 'Sarah J.', timeToResolve: '45m', outcome: 'Requires supplier refund', isLongResolve: true }, // Highlight
                    { type: 'Technical', reporter: 'Chris P.', timeToResolve: '10m', outcome: 'Equipment replaced', isLongResolve: false }
                ],
                qualitative: {
                    sentimentScore: 4.2,
                    managerDebrief: "Overall a successful event. The bar team was under pressure during the headline act (19:00-20:00). Security check-in flow was smooth thanks to the new scanners.",
                    aiRecommendations: [
                        { title: 'Increase Bar Staff', desc: 'Add 2 bartenders during peak hours (19:00-21:00) to reduce wait times.', icon: 'local_bar' },
                        { title: 'Supplier Review', desc: 'Logistics issue caused 45m delay. Considerations for alternate generator supplier.', icon: 'handyman' }
                    ]
                }
            })
        }, 600)
    })
}
