<template>
  <q-page class="events-page">
    <!-- Header -->
    <div class="page-header">
      <div class="page-title">Events</div>
      <div class="header-controls">
        <q-input outlined dense v-model="search" placeholder="Search events..." bg-color="white" class="search-input">
          <template v-slot:prepend>
            <q-icon name="sym_r_search" />
          </template>
        </q-input>
        <q-btn unelevated color="primary" icon="add" label="Create Event" no-caps class="create-btn" />
      </div>
    </div>

    <!-- Filters Row -->
    <div class="filters-row">
      <q-btn outline color="grey-7" label="Date" icon="sym_r_calendar_today" no-caps class="filter-btn" />
      <q-btn outline color="grey-7" label="Status" icon="sym_r_filter_list" no-caps class="filter-btn" />
      <q-btn outline color="grey-7" label="Category" icon="sym_r_label" no-caps class="filter-btn" />
      <q-space />

    </div>

    <!-- Stats Row -->
    <!-- I'll use a v-for here too to simplify -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-4" v-for="statKey in statKeys" :key="statKey">
          <q-card flat class="stat-card full-height" :class="stats[statKey]?.color ? 'bg-' + stats[statKey]?.color : 'bg-white border-grey'">
            <q-card-section class="q-pa-sm">
               <div class="row justify-between items-start">
                 <div>
                    <div class="text-subtitle1 text-weight-bold q-mb-xs">{{ stats[statKey]?.label }}</div>
                    <div class="row items-center q-mb-xs" :class="statKey === 'readiness' ? 'text-blue-9' : 'text-grey-8'">
                       <q-icon :name="stats[statKey]?.icon" size="xs" class="q-mr-xs"/> {{ stats[statKey]?.value }}
                    </div>
                    <div class="row items-center q-mb-xs text-red-9">
                       <q-icon name="warning" size="xs" class="q-mr-xs"/> {{ stats[statKey]?.subtext }}
                    </div>
                 </div>
                 <q-icon v-if="stats[statKey]?.icon" :name="stats[statKey]?.icon" size="sm" :color="statKey === 'readiness' ? 'blue-3' : 'grey-8'" />
               </div>
            </q-card-section>
          </q-card>
      </div>
    </div>

    <!-- Kanban Board -->
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-3" v-for="col in kanbanColumns" :key="col.id">
        <div class="kanban-header" :class="col.headerClass">
          <div class="text-subtitle1 text-weight-bold">{{ col.title }}</div>
        </div>
        
        <div class="kanban-scroll-area">
          <q-card 
            v-for="event in getEventsByCategory(col.id)" 
            :key="event.id" 
            flat 
            class="event-card cursor-pointer"
            @click="navigateToEvent(event.id)"
          >
              <q-card-section>
                  <!-- Top: Badges + Menu -->
                  <div class="row justify-between items-center q-mb-sm">
                      <div class="row q-gutter-xs">
                          <q-badge color="grey-2" text-color="grey-9" class="q-pa-xs">{{ event.workersCount }} Workers</q-badge>
                          <q-badge :class="event.statusColor" class="q-pa-xs">{{ event.status }}</q-badge>
                      </div>
                      <q-btn flat round dense icon="more_horiz" size="sm" color="grey-7" @click.stop />
                  </div>

                  <!-- Content -->
                  <div class="event-title">{{ event.title }}</div>
                  <div class="event-meta">
                      <q-icon name="schedule" size="xs" class="q-mr-xs"/> {{ event.timeRange }}
                  </div>
                  <div class="event-meta q-mb-md">
                      <q-icon name="event" size="xs" class="q-mr-xs"/> {{ event.date }}
                  </div>

                  <!-- Customer -->
                  <div class="row items-center q-mb-md">
                      <span class="text-caption text-grey-8 q-mr-xs">Customer:</span>
                      <q-avatar size="16px" class="q-mx-xs">
                          <img :src="event.customer.avatarUrl">
                      </q-avatar>
                      <span class="customer-name">{{ event.customer.name }}</span>
                  </div>

                  <!-- Footer -->
                  <div class="row items-center justify-between">
                      <div class="row">
                          <q-avatar v-for="(src, i) in event.workersAssigned.slice(0, 4)" :key="i" size="24px" class="overlap-avatar">
                              <img :src="src">
                          </q-avatar>
                          <q-avatar v-if="event.workersAssigned.length > 4" size="24px" color="primary" text-color="white" class="overlap-avatar more-avatar">
                              +{{ event.workersAssigned.length - 4 }}
                          </q-avatar>
                      </div>
                  </div>

                  <q-linear-progress :value="event.progress / 100" :color="col.barColor" class="q-mt-sm rounded-borders" />
              </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getEvents, getEventStats, TeamgleEvent, EventStats } from '../services/mock/eventController'

const router = useRouter()

const navigateToEvent = (id: string) => {
    router.push(`/events/${id}/dashboard`)
}

// --- State ---
const search = ref<string>('')
const stats = ref<Partial<EventStats>>({})
const events = ref<TeamgleEvent[]>([])

// --- Config ---
const statKeys: (keyof EventStats)[] = ['readiness', 'staffing', 'load']

interface KanbanColumn {
    id: 'today' | 'upcoming' | 'completed' | 'draft';
    title: string;
    headerClass: string;
    barColor: string;
}

const kanbanColumns: KanbanColumn[] = [
    { id: 'today', title: "Today's Events", headerClass: 'bg-royalblue text-black', barColor: 'primary' },
    { id: 'upcoming', title: "Upcoming Events", headerClass: 'bg-warning text-dark', barColor: 'primary' },
    { id: 'completed', title: "Completed Events", headerClass: 'bg-logo-green text-black', barColor: 'primary' },
    { id: 'draft', title: "Draft Events", headerClass: 'bg-grey-3 text-dark', barColor: 'grey' }
]

// --- Helpers ---
const filteredEvents = computed(() => {
    if (!search.value) return events.value
    const term = search.value.toLowerCase()
    return events.value.filter(e => 
        e.title.toLowerCase().includes(term) ||
        e.status.toLowerCase().includes(term) ||
        e.customer.name.toLowerCase().includes(term)
    )
})

// Logic to determine category based on Date sorting, ensuring "Automatic" movement
const getCategoryByDate = (e: TeamgleEvent): string => {
    // 1. Priority: Drafts
    if (e.status === 'Draft') return 'draft'

    // 2. Parse Date
    const eDate = new Date(e.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Midnight today

    // Check validity
    if (isNaN(eDate.getTime())) return 'draft' // Fallback

    // 3. Compare
    // Reset eDate to midnight for comparison (parsing "Month DD, YYYY" usually implies midnight, but let's be safe)
    eDate.setHours(0, 0, 0, 0)

    if (eDate.getTime() === today.getTime()) return 'today'
    if (eDate.getTime() < today.getTime()) return 'completed'
    
    return 'upcoming'
}

const getEventsByCategory = (category: string): TeamgleEvent[] => {
    return filteredEvents.value.filter(e => getCategoryByDate(e) === category)
}

// --- Lifecycle ---
onMounted(async () => {
    try {
        stats.value = await getEventStats()
        // We fetch events which now have dynamic dates relative to real-time.
        // Our getCategoryByDate function places them in the right column automatically.
        events.value = await getEvents()
    } catch (e) {
        console.error(e)
    }
})
</script>

<style scoped lang="scss">
.events-page {
    padding: 16px;
    background-color: #fafafa;
}

@media (min-width: 600px) {
    .events-page {
        padding: 24px;
    }
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .page-title {
        font-size: 2rem;
        font-weight: bold;
    }

    .header-controls {
        display: flex;
        gap: 8px;
    }
}

.search-input {
    width: 300px;
    max-width: 100%;
}

.create-btn {
    font-weight: bold;
}

.filters-row {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 24px;
    flex-wrap: wrap; 
}

.filter-btn {
    background: white;
}





.stat-card {
    border-radius: 12px;
    &.border-grey {
        border: 1px solid #e0e0e0;
    }
}

.kanban-header {
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
}

.bg-royalblue { background-color: #4361ee; }

.kanban-scroll-area {
    height: calc(100vh - 350px);
    overflow-y: auto;
    padding-right: 4px;

    &::-webkit-scrollbar { width: 6px; }
    &::-webkit-scrollbar-track { background: transparent; }
    &::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 4px; }
    &::-webkit-scrollbar-thumb:hover { background: #bdbdbd; }
}

.event-card {
    border: 1px solid #e0e0e0;
    margin-bottom: 16px;
    border-radius: 8px;
}

.event-title {
    font-size: 1rem;
    font-weight: bold;
    line-height: 1.2;
    margin-bottom: 4px;
}

.event-meta {
    font-size: 0.75rem;
    color: #616161;
    margin-bottom: 2px;
}

.customer-name {
    font-size: 0.75rem;
    color: #1565c0; // blue-9
    font-weight: bold;
    cursor: pointer;
}

.overlap-avatar {
    margin-right: -8px;
    border: 2px solid white;
}


.bg-logo-green {
    background-color: #6FB730; /* Assumed 0 padding for invalid hex provided */
}

.more-avatar {
    font-size: 10px;
}
</style>
