import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/login',
        component: () => import('../pages/LoginPage.vue')
    },
    {
        path: '/',
        component: () => import('../layouts/MainLayout.vue'),
        children: [
            {
                path: '',
                name: 'home',
                component: () => import('../pages/DashboardPage.vue')
            },
            {
                path: 'schedule',
                name: 'schedule',
                component: () => import('../pages/SchedulePage.vue')
            },
            {
                path: 'events',
                name: 'events',
                component: () => import('../pages/EventsPage.vue')
            },
            {
                path: 'employee',
                name: 'employee',
                component: () => import('../pages/EmployeePage.vue')
            },

            // New Create Event Page (MUST be before :id)
            {
                path: 'events/create',
                name: 'create-event',
                component: () => import('../pages/CreateEventPage.vue')
            },

            // Event Details Layout
            {
                path: 'events/:id',
                component: () => import('../layouts/EventLayout.vue'),
                children: [
                    { path: '', redirect: { name: 'event-dashboard' } },
                    { path: 'dashboard', name: 'event-dashboard', component: () => import('../pages/event/EventDashboardPage.vue') },
                    { path: 'employee', name: 'event-team', component: () => import('../pages/event/EventTeamPage.vue') },
                    { path: 'schedule', name: 'event-schedule', component: () => import('../pages/event/EventSchedulePage.vue') },
                    { path: 'tasks', name: 'event-tasks', component: () => import('../pages/event/EventTasksPage.vue') },
                    { path: 'briefing', name: 'event-briefing', component: () => import('../pages/event/EventBriefingPage.vue') },
                    { path: 'finance', name: 'event-finance', component: () => import('../pages/event/EventFinancePage.vue') },
                    { path: 'settings', name: 'event-settings', component: () => import('../pages/event/EventSettingsPage.vue') }
                ]
            },

            // Live Mode (Inside MainLayout, but distinct from EventLayout)
            {
                path: 'events/:id/live',
                name: 'event-live',
                component: () => import('../pages/event/LiveEventPage.vue')
            },

            // Post-Event Summary Report
            {
                path: 'events/:id/summary',
                name: 'event-summary',
                component: () => import('../pages/event/EventSummaryPage.vue')
            }
        ],
    },

    // 404 Catch-all
    {
        path: '/:catchAll(.*)*',
        component: () => import('../pages/ErrorNotFound.vue'),
    },
]

export default routes
