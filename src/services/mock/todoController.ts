export interface TodoTask {
    id: string;
    title: string;
    date: string; // Display date
    location: string;
    isCompleted: boolean;
}

// Initial mock data
let mockTasks: TodoTask[] = [
    {
        id: '1',
        title: 'Check hour discrepancies',
        date: '21/01/2024',
        location: 'Live Concert O2',
        isCompleted: false
    },
    {
        id: '2',
        title: 'Send arrival reminders',
        date: '05/02/2024',
        location: 'Basketball Game',
        isCompleted: false
    },
    {
        id: '3',
        title: 'Flag issues or shortages',
        date: '15/03/2024',
        location: 'Team Meeting',
        isCompleted: false
    }
];

export const getTasks = (): Promise<TodoTask[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...mockTasks])
        }, 400)
    })
}

export const addTask = (task: Omit<TodoTask, 'id'>): Promise<TodoTask> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newTask: TodoTask = { ...task, id: Date.now().toString() }
            mockTasks.push(newTask)
            resolve(newTask)
        }, 400)
    })
}

export const updateTask = (id: string, updates: Partial<TodoTask>): Promise<TodoTask> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = mockTasks.findIndex(t => t.id === id)
            if (index !== -1) {
                mockTasks[index] = { ...mockTasks[index], ...updates }
                resolve(mockTasks[index])
            } else {
                reject(new Error('Task not found'))
            }
        }, 300)
    })
}

export const deleteTask = (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            mockTasks = mockTasks.filter(t => t.id !== id)
            resolve(true)
        }, 300)
    })
}
