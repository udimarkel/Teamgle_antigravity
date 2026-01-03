export type ShiftStatus = 'Confirmed' | 'Pending' | 'Completed' | 'Canceled';

export interface Shift {
    id: string;
    workerName: string;
    role: string;
    location: string;
    startTime: string; // ISO or display string
    endTime: string;
    date: string; // YYYY-MM-DD
    status: ShiftStatus;
    avatar: string;
}

const mockShifts: Shift[] = [
    {
        id: '1',
        workerName: 'Sarah Jenkins',
        role: 'Security Lead',
        location: 'O2 Arena - Main Entrance',
        startTime: '14:00',
        endTime: '22:00',
        date: '2024-01-21',
        status: 'Confirmed',
        avatar: 'https://cdn.quasar.dev/img/avatar2.jpg'
    },
    {
        id: '2',
        workerName: 'Mike Ross',
        role: 'Ticket Scanner',
        location: 'O2 Arena - Gate B',
        startTime: '14:30',
        endTime: '21:30',
        date: '2024-01-21',
        status: 'Pending',
        avatar: 'https://cdn.quasar.dev/img/avatar3.jpg'
    },
    {
        id: '3',
        workerName: 'Jessica Pearson',
        role: 'Supervisor',
        location: 'VIP Lounge',
        startTime: '13:00',
        endTime: '23:00',
        date: '2024-01-21',
        status: 'Confirmed',
        avatar: 'https://cdn.quasar.dev/img/avatar4.jpg'
    },
    {
        id: '4',
        workerName: 'Louis Litt',
        role: 'Usher',
        location: 'Section 102',
        startTime: '15:00',
        endTime: '21:00',
        date: '2024-01-22',
        status: 'Canceled',
        avatar: 'https://cdn.quasar.dev/img/avatar5.jpg'
    },
    {
        id: '5',
        workerName: 'Donna Paulsen',
        role: 'Coordinator',
        location: 'Backstage',
        startTime: '10:00',
        endTime: '18:00',
        date: '2024-01-23',
        status: 'Completed',
        avatar: 'https://cdn.quasar.dev/img/avatar6.jpg'
    }
];

export const getShifts = (): Promise<Shift[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockShifts)
        }, 700)
    })
}
