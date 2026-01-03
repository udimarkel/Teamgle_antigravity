export interface Employee {
    id: string
    name: string
    role: string
    avatar: string
    phone: string
    email: string
    skills: string[]
    rating: number // 0-5
    status: 'active' | 'inactive' | 'pending'
    description?: string // For pending cards
    pendingRole?: string // The role they applied for
}

const employees: Employee[] = [
    {
        id: '1',
        name: 'Jaime Jimenez',
        role: 'Housekeeper',
        avatar: 'https://cdn.quasar.dev/img/avatar1.jpg',
        phone: '(619) 656-7396',
        email: 'bmartinez@yahoo.com',
        skills: ['Driver', 'Security Guard'],
        rating: 4,
        status: 'active'
    },
    {
        id: '2',
        name: 'Anthony Davis',
        role: 'Clinical Psychologist',
        avatar: 'https://cdn.quasar.dev/img/avatar2.jpg',
        phone: '(312) 522-6378',
        email: 'john_scott@hotmail.com',
        skills: ['Close as Won'], // Odd skill from image, keeping for fidelity
        rating: 5,
        status: 'active'
    },
    {
        id: '3',
        name: 'Brian Scott',
        role: 'Financial Planner',
        avatar: 'https://cdn.quasar.dev/img/avatar3.jpg',
        phone: '(973) 836-0348',
        email: 'elizabethclark96@yahoo.com',
        skills: ['Bartender'],
        rating: 3,
        status: 'active'
    },
    {
        id: '4',
        name: 'Jennifer Edwards',
        role: 'Chemist',
        avatar: 'https://cdn.quasar.dev/img/avatar4.jpg',
        phone: '(719) 817-6063',
        email: 'swalker@hotmail.com',
        skills: ['Security Guard'],
        rating: 4.5,
        status: 'active'
    },
    {
        id: '5',
        name: 'Matthew Martinez',
        role: 'Public Health Inspector',
        avatar: 'https://cdn.quasar.dev/img/avatar5.jpg',
        phone: '(760) 756-7568',
        email: 'onlyjoshuadavis@yahoo.com',
        skills: ['Driver', 'Security Guard'],
        rating: 4,
        status: 'active'
    }
]

const pendingEmployees: Employee[] = [
    {
        id: 'p1',
        name: 'Cody Fisher',
        role: 'Waiter',
        avatar: 'https://cdn.quasar.dev/img/avatar6.jpg',
        phone: '',
        email: '',
        skills: [],
        rating: 0,
        status: 'pending',
        pendingRole: 'Waiter',
        description: 'Fugiat laborum non ani'
    },
    {
        id: 'p2',
        name: 'Tlalli Miski',
        role: 'General',
        avatar: 'https://cdn.quasar.dev/img/avatar5.jpg', // Reusing for consistency
        phone: '',
        email: '',
        skills: [],
        rating: 0,
        status: 'pending',
        pendingRole: 'General',
        description: 'Fugiat laborum non ani'
    },
    {
        id: 'p3',
        name: 'John Cooper',
        role: 'Driver',
        avatar: 'https://cdn.quasar.dev/img/avatar1.jpg',
        phone: '',
        email: '',
        skills: [],
        rating: 0,
        status: 'pending',
        pendingRole: 'Driver',
        description: 'Fugiat laborum non ani'
    }
]

export const getEmployees = async (): Promise<Employee[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(employees), 300)
    })
}

export const getPendingEmployees = async (): Promise<Employee[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(pendingEmployees), 300)
    })
}
