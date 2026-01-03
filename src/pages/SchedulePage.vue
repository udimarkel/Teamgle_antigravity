<template>
  <q-page class="schedule-page column">
    <!-- Header Section -->
    <div class="schedule-header row items-center justify-between q-pa-md bg-white">
      <div class="row items-center q-gutter-x-sm">
        <h1 class="text-h5 text-weight-bold no-margin">{{ currentMonthYear }}</h1>
        <div class="row items-center cursor-pointer">
           <q-btn flat round dense icon="chevron_left" color="grey-8" @click="handlePrev" />
           <q-btn flat round dense icon="chevron_right" color="grey-8" @click="handleNext" />
        </div>
        <q-btn unelevated color="blue-1" text-color="primary" label="Today" class="q-ml-sm text-weight-bold" @click="goToToday" />
      </div>

      <div class="row items-center q-gutter-x-sm">
        <q-btn 
            :flat="currentView !== 'day'" 
            :unelevated="currentView === 'day'" 
            :color="currentView === 'day' ? 'primary' : 'grey-7'" 
            :class="{ 'text-white': currentView === 'day' }"
            dense no-caps label="Day" 
            @click="setView('day')" 
        />
        <q-btn 
            :flat="currentView !== 'week'" 
            :unelevated="currentView === 'week'"
            :color="currentView === 'week' ? 'primary' : 'grey-7'"
            :class="{ 'text-white': currentView === 'week' }"
            dense no-caps label="Week" 
            @click="setView('week')"
        />
        <q-btn 
            :flat="currentView !== 'month'" 
            :unelevated="currentView === 'month'"
            :color="currentView === 'month' ? 'primary' : 'grey-7'"
            :class="{ 'text-white': currentView === 'month' }"
            dense no-caps label="Month" 
            @click="setView('month')"
        />
      </div>
    </div>

    <!-- Calendar Grid Container (Day/Week) -->
    <div v-if="currentView !== 'month'" class="calendar-container col column bg-white">
      <!-- Scrollable Grid Body -->
      <div class="grid-body col relative-position scroll">
        
        <!-- Days Header (Sticky) -->
        <div class="days-header row border-bottom sticky-header bg-white">
            <div class="time-column-header border-right"></div> <!-- Spacer for time axis -->
            <div 
            v-for="day in weekDays" 
            :key="day.dateStr" 
            class="col day-header-cell column items-center justify-center border-right"
            >
            <div class="day-circle" :class="{ 'current-day': isToday(day.dateObj) }">
                {{ day.dayNumber }}
            </div>
            <div class="day-name q-mt-xs">{{ day.dayName }}</div>
            </div>
        </div>

        <div class="grid-content relative-position">
            
            <!-- Background Grid Lines -->
            <div class="grid-lines">
               <div v-for="hour in timeSlots" :key="hour" class="time-row row" :style="{ height: slotHeight + 'px' }">
                  <div class="time-label border-right row items-start justify-end q-pr-sm">
                      <span class="text-caption text-grey-6">{{ formatHour(hour) }}</span>
                  </div>
                  <div v-for="d in weekDays.length" :key="d" class="col border-right border-bottom-light"></div>
               </div>
            </div>

            <!-- Events Overlay -->
            <div class="events-overlay absolute-top-left fit">
                <div 
                  v-for="event in layoutEvents" 
                  :key="event.id"
                  class="event-card absolute cursor-pointer"
                  :class="event.type"
                  :style="getEventStyle(event)"
                  @dblclick="navigateToEvent(event.id)"
                >
                    <div class="event-title">{{ event.title }}</div>
                    <div class="event-time">{{ event.timeRange }}</div>
                    <q-icon v-if="event.icon" :name="event.icon" size="xs" class="absolute-top-right q-ma-xs" />
                </div>
            </div>

            <!-- Current Time Indicator -->
            <div 
                v-if="isCurrentWeek" 
                class="current-time-indicator absolute-width" 
                :style="{ top: currentTimeTop + 'px' }"
            >
               <div class="time-dot"></div>
               <div class="time-line"></div>
            </div>

        </div>
      </div>
    </div>

    <!-- Month Grid Container -->
    <div v-else class="month-container col bg-white scroll">
        <div class="month-header row">
            <div v-for="d in ['MON','TUE','WED','THU','FRI','SAT','SUN']" :key="d" class="col text-center q-py-sm text-grey-7 text-weight-bold border-bottom border-right">
                {{ d }}
            </div>
        </div>
        <div class="month-body">
            <div class="month-grid">
                <div 
                    v-for="day in monthDays" 
                    :key="day.dateStr"
                    class="month-cell column border-right border-bottom q-pa-xs"
                    :class="{ 'bg-grey-1': !day.isCurrentMonth, 'bg-blue-1': day.isToday }"
                >
                    <div class="row justify-end q-mb-xs">
                        <span class="text-caption text-weight-bold" :class="day.isToday ? 'text-primary' : 'text-grey-7'">{{ day.dayNumber }}</span>
                    </div>
                    
                    <div class="col column q-gutter-y-xs overflow-hidden">
                        <div 
                            v-for="event in getDayEvents(day.dateObj)" 
                            :key="event.id"
                            class="month-event-chip q-px-xs rounded-borders text-caption ellipsis cursor-pointer"
                            :class="event.type"
                            @dblclick="navigateToEvent(event.id)"
                        >
                            {{ event.title }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

import { getEvents, TeamgleEvent } from '../services/mock/eventController'

const router = useRouter()

const navigateToEvent = (id: string) => {
    router.push(`/events/${id}/dashboard`)
}

const slotHeight = 80 // px per hour
const startHour = 0 // 12 AM
const endHour = 24 // 12 AM next day (full 24h)

interface ScheduleEvent {
    id: string
    title: string
    timeRange: string
    dayIndex: number // 0 = Mon, 6 = Sun
    startHour: number // e.g., 8.0 for 8 AM
    duration: number // hours
    type: 'cream' | 'green' | 'orange' | 'blue'
    icon?: string
    // Layout props
    _colIndex?: number
    _totalCols?: number
    _fullDate?: Date
}

const currentView = ref<'day' | 'week' | 'month'>('week')

const currentDate = ref(new Date()) 
const events = ref<ScheduleEvent[]>([])

// --- Parsing Helpers ---

const parseTime = (timeStr: string): number => {
    // Expected "09:00 AM" or "10:30 PM"
    const [time, modifier] = timeStr.trim().split(' ')
    let [hours, minutes] = time.split(':').map(Number)
    
    if (modifier === 'PM' && hours < 12) hours += 12
    if (modifier === 'AM' && hours === 12) hours = 0
    
    return hours + (minutes / 60)
}

// --- Helpers ---

const getEventColor = (e: TeamgleEvent): 'cream' | 'green' | 'orange' | 'blue' => {
    if (e.title.includes('Live')) return 'cream'
    if (e.status === 'Ready' || e.category === 'completed') return 'green'
    if (e.status === 'Issues' || e.title.includes('Workshop')) return 'orange'
    return 'blue'
}

const adaptEvents = (rawEvents: TeamgleEvent[]): ScheduleEvent[] => {
    const validEvents: ScheduleEvent[] = []
    
    rawEvents.forEach(e => {
        const eventDate = new Date(e.date)
        if (isNaN(eventDate.getTime())) return

        let dayIndex = eventDate.getDay() - 1 
        if (dayIndex === -1) dayIndex = 6 
        
        const parts = e.timeRange.split('-')
        if (parts.length < 2) return 
        
        const start = parseTime(parts[0])
        const end = parseTime(parts[1])
        const duration = end - start
        
        validEvents.push({
            id: e.id,
            title: e.title,
            timeRange: e.timeRange,
            dayIndex: dayIndex, 
            startHour: start,
            duration: duration,
            type: getEventColor(e),
            icon: e.category === 'completed' ? 'check_circle' : 'folder_open',
            _fullDate: eventDate 
        } as any)
    })
    
    return validEvents
}

// --- Fetch & Lifecycle ---

const timeSlots = computed(() => {
    const slots = []
    for (let i = startHour; i <= endHour; i++) {
        slots.push(i)
    }
    return slots
})

// --- Date Logic ---

const getWeekStart = (date: Date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) 
    return new Date(d.setDate(diff))
}

const getMonthStart = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1)
}

const currentStart = computed(() => {
    if (currentView.value === 'day') return currentDate.value
    if (currentView.value === 'month') return getMonthStart(currentDate.value)
    return getWeekStart(currentDate.value)
})

const weekDays = computed(() => {
    const days = []
    
    if (currentView.value === 'day') {
        const d = new Date(currentDate.value)
        days.push({
            dateObj: d,
            dateStr: d.toISOString().split('T')[0],
            dayNumber: d.getDate(),
            dayName: d.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()
        })
        return days
    }

    // Week View
    const start = getWeekStart(currentDate.value)
    for (let i = 0; i < 7; i++) {
        const d = new Date(start)
        d.setDate(start.getDate() + i)
        days.push({
            dateObj: d,
            dateStr: d.toISOString().split('T')[0],
            dayNumber: d.getDate(),
            dayName: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
        })
    }
    return days
})

const monthDays = computed(() => {
    if (currentView.value !== 'month') return []

    const days = []
    const startOfMonth = getMonthStart(currentDate.value)
    const endOfMonth = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0)
    
    // Start grid from Monday relative to startOfMonth
    const startGrid = getWeekStart(startOfMonth)
    
    // 6 weeks * 7 days = 42 cells to ensure full coverage
    for (let i = 0; i < 42; i++) {
        const d = new Date(startGrid)
        d.setDate(startGrid.getDate() + i)
        
        days.push({
            dateObj: d,
            dateStr: d.toISOString().split('T')[0],
            dayNumber: d.getDate(),
            isCurrentMonth: d.getMonth() === currentDate.value.getMonth(),
            isToday: isToday(d)
        })
    }
    return days
})

const currentMonthYear = computed(() => {
    return currentDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const formatHour = (h: number) => {
    const ampm = h >= 12 ? 'PM' : 'AM'
    const hour12 = h % 12 || 12
    return `${hour12.toString().padStart(2, '0')}:00 ${ampm}`
}

const isToday = (date: Date) => {
    const today = new Date()
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear()
}

const isCurrentWeek = computed(() => {
    const today = new Date()
    // Logic depends on view
    if (currentView.value === 'day') return isToday(currentDate.value)
    if (currentView.value === 'month') return today.getMonth() === currentDate.value.getMonth() && today.getFullYear() === currentDate.value.getFullYear()
    
    const start = getWeekStart(currentDate.value)
    const end = new Date(start)
    end.setDate(end.getDate() + 7)
    return today >= start && today < end
})

// --- Filtering & Layout (Week/Day) ---

const visibleEvents = computed(() => {
    let start: Date, end: Date
    
    if (currentView.value === 'day') {
        start = new Date(currentDate.value)
        start.setHours(0,0,0,0)
        end = new Date(start)
        end.setDate(end.getDate() + 1)
    } else if (currentView.value === 'month') {
        // Load events for the whole displayed grid (including padding days)
        const mDays = monthDays.value
        if (mDays.length === 0) return []
        start = mDays[0].dateObj
        end = new Date(mDays[mDays.length - 1].dateObj)
        end.setDate(end.getDate() + 1)
    } else {
        // Week
        start = getWeekStart(currentDate.value)
        end = new Date(start)
        end.setDate(end.getDate() + 7)
    }
    
    return events.value.filter((e: any) => {
        const d = e._fullDate 
        if (!d) return false
        return d >= start && d < end
    })
})

const layoutEvents = computed(() => {
    if (currentView.value === 'month') return [] // Handled separately in template via getDayEvents

    // 1. Get visible events first
    const visible = visibleEvents.value.sort((a, b) => a.startHour - b.startHour)
    
    // Group by day key (0-6)
    // For Day view, dayIndex is relative to the week, so it works. 
    // Wait, dayIndex in our event structure is 0=Mon, 6=Sun. 
    // If we are in Day View, we show only one column. 
    // The "Grid" still has 1 column. 
    // We need to make sure the event's dayIndex matches the displayed day?
    // Actually, in Day View, we can force the event.dayIndex to be 0 for positioning logic if we render a 1-col grid.
    
    const isDayView = currentView.value === 'day'
    
    const daysMap = new Map<number, ScheduleEvent[]>()
    visible.forEach(e => {
        // In Day view, we want to treat the single day as index 0 for layout algorithms if needed,
        // OR we just assume the grid logic handles it.
        // Let's rely on the dayIndex from the event logic relative to week (0-6).
        
        let key = e.dayIndex
        if (isDayView) key = 0 // Force to 0 so they map to the single column
        
        if (!daysMap.has(key)) daysMap.set(key, [])
        daysMap.get(key)?.push(e)
    })
    
    const processedEvents: ScheduleEvent[] = []

    // 2. Process overlaps per day
    daysMap.forEach((dayEvents) => {
        // Use Cluster Detection for better grouping
        let cluster: ScheduleEvent[] = []
        let clusterEnd = -1
        
        dayEvents.sort((a,b) => a.startHour - b.startHour)
        
        dayEvents.forEach(ev => {
            const minStart = ev.startHour
            if (cluster.length === 0) {
                cluster.push(ev)
                clusterEnd = ev.startHour + ev.duration
            } else if (minStart < clusterEnd) {
                // Overlaps with the current cluster
                cluster.push(ev)
                clusterEnd = Math.max(clusterEnd, ev.startHour + ev.duration)
            } else {
                // Determine layout for closed cluster
                processCluster(cluster)
                cluster = [ev]
                clusterEnd = ev.startHour + ev.duration
            }
        })
        processCluster(cluster) // Final one
        
        processedEvents.push(...dayEvents)
    })
    
    return processedEvents
})

function processCluster(cluster: ScheduleEvent[]) {
    if (cluster.length === 0) return
    
    // Assign columns using Greedy Packing
    const columns: ScheduleEvent[][] = []
    
    cluster.forEach(ev => {
        let placed = false
        for (let i = 0; i < columns.length; i++) {
             const col = columns[i]
             const lastEvent = col[col.length - 1]
             if (lastEvent.startHour + lastEvent.duration <= ev.startHour) {
                 col.push(ev)
                 ev._colIndex = i
                 placed = true
                 break
             }
        }
        if (!placed) {
            columns.push([ev])
            ev._colIndex = columns.length - 1
        }
    })
    
    const width = columns.length
    cluster.forEach(ev => {
        ev._totalCols = width
    })
}

// --- Month View Helpers ---

const getDayEvents = (date: Date) => {
    // Return events for this specific day
    // Simple filter on visibleEvents list which usually contains expected range
    return visibleEvents.value.filter(e => {
        const d = e._fullDate
        return d && d.getDate() === date.getDate() && d.getMonth() === date.getMonth()
    })
}

const getEventStyle = (event: ScheduleEvent) => {
    // Only used for Week/Day views
    const top = (event.startHour - startHour) * slotHeight
    const height = event.duration * slotHeight
    
    const colIndex = event._colIndex || 0
    const totalCols = event._totalCols || 1

    const isDayView = currentView.value === 'day'
    
    // If Day View, we have 1 column (width 100%)
    // If Week View, 7 columns (width 14.28%)
    
    const dayIndex = isDayView ? 0 : event.dayIndex;
    const columnsCount = isDayView ? 1 : 7;
    
    const colWidthPct = 100 / columnsCount; // 100 or 14.28

    return {
        top: `${top}px`,
        height: `${height - 2}px`, 
        // Left = Sidebar + (DayIndex * baseColWidth) + subColOffset
        
        // Note: For Day View, event.dayIndex might be 0..6, but we mapped key to 0 in layoutEvents. 
        // BUT the event object itself still has original dayIndex.
        // We need to use '0' effectively if it's day view.
        
        left: `calc(60px + ((100% - 60px) / ${columnsCount} * ${dayIndex}) + (((100% - 60px) / ${columnsCount}) / ${totalCols} * ${colIndex}))`,
        
        // Width
        width: `calc((((100% - 60px) / ${columnsCount}) / ${totalCols}) - 4px)` 
    }
}

// --- Time Indicator ---
const currentTimeTop = ref(0)
const updateTimePosition = () => {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const timeInHours = hours + minutes / 60
    
    if (timeInHours < startHour) {
        currentTimeTop.value = 0
        return
    }
    
    currentTimeTop.value = (timeInHours - startHour) * slotHeight
}

let timer: any
onMounted(async () => {
    updateTimePosition()
    timer = setInterval(updateTimePosition, 60000)
    
    const raw = await getEvents()
    events.value = adaptEvents(raw)
    
    const scrollArea = document.querySelector('.grid-body')
    if (scrollArea) {
        scrollArea.scrollTop = slotHeight * 1 // Scroll 1 hour down
    }
})

onUnmounted(() => {
    clearInterval(timer)
})

// --- Navigation ---
const handleNext = () => {
    const d = new Date(currentDate.value)
    if (currentView.value === 'day') d.setDate(d.getDate() + 1)
    else if (currentView.value === 'week') d.setDate(d.getDate() + 7)
    else if (currentView.value === 'month') d.setMonth(d.getMonth() + 1)
    currentDate.value = d
}

const handlePrev = () => {
    const d = new Date(currentDate.value)
    if (currentView.value === 'day') d.setDate(d.getDate() - 1)
    else if (currentView.value === 'week') d.setDate(d.getDate() - 7)
    else if (currentView.value === 'month') d.setMonth(d.getMonth() - 1)
    currentDate.value = d
}

const goToToday = () => {
    currentDate.value = new Date()
}

const setView = (v: 'day' | 'week' | 'month') => {
    currentView.value = v
}

</script>

<style scoped lang="scss">
.schedule-page {
    height: calc(100vh - 61px); // Subtract top header
    overflow: hidden;
}

.border-bottom {
    border-bottom: 1px solid #e0e0e0;
}
.border-right {
    border-right: 1px solid #e0e0e0;
}
.border-bottom-light {
    border-bottom: 1px solid #f5f5f5;
}

.sticky-header {
    position: sticky;
    top: 0;
    z-index: 30;
    background-color: white;
}

.time-column-header {
    width: 60px;
    flex-shrink: 0;
}

.day-header-cell {
    height: 80px;
    font-weight: 600;
}

.day-circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    color: #757575;
    
    &.current-day {
        background-color: #3b82f6; // Blue-500
        color: white;
        box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
    }
}

.day-name {
    color: #757575;
    font-size: 0.8rem;
    font-weight: 500;
}

.grid-body {
    flex: 1;
    overflow-y: auto;
}

.time-label {
    width: 60px;
    flex-shrink: 0;
    transform: translateY(-8px); // Align text with line
}

.event-card {
    padding: 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    border-left: 4px solid rgba(0,0,0,0.1);
    margin-left: 2px;
    transition: all 0.2s;
    cursor: pointer;
    
    &:hover {
        filter: brightness(0.95);
        z-index: 10;
    }
    
    .event-title {
        font-weight: bold;
        margin-bottom: 4px;
        line-height: 1.2;
    }
    
    .event-time {
        font-size: 0.7rem;
        opacity: 0.8;
    }
    
    // Colors
    &.cream {
        background-color: #fffbeb; // Orange-50 looks cream-ish
        color: #d97706;
        border-left-color: #d97706;
    }
    &.green {
        background-color: #86efac; // Green-300 matches screenshot roughly
        background-color: #74b880; // Darker green from screenshot
        color: white;
        border-left-color: rgba(0,0,0,0.2);
    }
    &.orange {
        background-color: #fdba74; // Orange-300
        background-color: #f6bb42; // Yellowish orange
        color: white;
        border-left-color: rgba(0,0,0,0.2);
    }
    &.blue {
        background-color: #60a5fa; // Blue-400
        background-color: #4a7cf6; // Royal blue
        color: white;
        border-left-color: rgba(0,0,0,0.2);
    }
}

.current-time-indicator {
    position: absolute;
    left: 0;
    right: 0;
    z-index: 20;
    pointer-events: none;
    
    .time-line {
        border-top: 2px dotted #3b82f6;
        width: 100%;
        position: absolute;
        top: 0;
    }
    
    .time-dot {
        width: 10px;
        height: 10px;
        background-color: #3b82f6;
        border-radius: 50%;
        position: absolute;
        // In Week view (7 cols), left axis is 60px.
        // In Day view (1 col), left axis is 60px.
        left: 55px; 
        top: -5px;
    }
}

// --- Month Grid Styles ---

.month-container {
    display: flex;
    flex-direction: column;
}

.month-header {
    flex-shrink: 0;
}

.month-body {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.month-grid {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(6, 1fr); // Force 6 equal rows
    border-left: 1px solid #e0e0e0;
    overflow: hidden; // Prevent scrolling inside grid if not needed
}

.month-cell {
    border-right: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
    background-color: white;
    min-height: 0; // Allow shrinking to fit
    display: flex;
    flex-direction: column;
}

.month-event-chip {
    font-size: 0.75rem;
    height: 22px;
    line-height: 22px;
    white-space: nowrap;
    
    &.cream {
        background-color: #fffbeb;
        color: #d97706;
        border: 1px solid #fcd34d;
    }
    &.green {
        background-color: #dcfce7;
        color: #166534;
        border: 1px solid #86efac;
    }
    &.orange {
        background-color: #ffedd5;
        color: #9a3412;
        border: 1px solid #fdba74;
    }
    &.blue {
        background-color: #dbeafe;
        color: #1e40af;
        border: 1px solid #93c5fd;
    }
}
</style>
