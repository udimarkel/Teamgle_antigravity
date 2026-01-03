<template>
  <q-page class="event-schedule-page q-pa-lg">
    <div class="column full-height q-gutter-y-md">
      
      <!-- Header -->
      <div class="row justify-between items-center">
        <div>
           <div class="text-h5 text-weight-bold">Event Timeline</div>
           <div class="text-subtitle2 text-grey-7">Detailed run-of-show and resource allocation.</div>
        </div>
        <div class="row q-gutter-x-sm">
             <q-btn outline color="grey-7" label="Export PDF" icon="picture_as_pdf" no-caps />
             <q-btn unelevated color="primary" label="Add Task" icon="add" no-caps />
        </div>
      </div>

      <!-- Gantt View Container -->
      <q-card flat class="gantt-card col column">
          
          <!-- Gantt Header (Time Scale) -->
          <div class="gantt-header row items-center no-wrap">
               <div class="resource-column-header q-px-md text-weight-bold text-grey-8">Resource</div>
               <div class="timeline-header col row no-wrap relative-position">
                   <div v-for="hour in hours" :key="hour" class="time-slot text-caption text-grey-7">
                       {{ hour }}
                   </div>
               </div>
          </div>

          <!-- Gantt Body (Resources & Tasks) -->
          <div class="gantt-body col scroll">
              <div v-for="group in groupedTasks" :key="group.resource" class="resource-row row no-wrap">
                  
                  <!-- Resource Name -->
                  <div class="resource-column q-px-md row items-center text-weight-medium bg-grey-2">
                      {{ group.resource }}
                  </div>

                  <!-- Timeline Lane -->
                  <div class="timeline-lane col relative-position">
                      <!-- Grid Lines -->
                      <div v-for="hour in hours" :key="'line-' + hour" class="grid-line"></div>
                      
                      <!-- Task Bars -->
                      <div 
                        v-for="task in group.tasks" 
                        :key="task.id"
                        class="task-bar q-px-sm row items-center text-white text-caption rounded-borders cursor-pointer"
                        :class="'bg-' + task.color"
                        :style="getTaskStyle(task)"
                      >
                          <div class="ellipsis">{{ task.taskName }}</div>
                          <q-tooltip>{{ task.taskName }} ({{ task.startTime }} - {{ task.endTime }})</q-tooltip>
                      </div>

                  </div>
              </div>
          </div>

      </q-card>

    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getEventTimeline, type EventTimelineItem } from '../../services/mock/eventController'

const route = useRoute()
const eventId = route.params.id as string
const tasks = ref<EventTimelineItem[]>([])
const loading = ref(true)

// Config
const startHour = 14; // 14:00 (2 PM)
const endHour = 24;   // 24:00 (Midnight)
const hourWidth = 100; // px per hour

// Generate hours for header
const hours = computed(() => {
    const arr = []
    for(let i = startHour; i <= endHour; i++) {
        arr.push(`${i}:00`)
    }
    return arr
})

// Group tasks by resource
const groupedTasks = computed(() => {
    const groups: { resource: string; tasks: EventTimelineItem[] }[] = []
    const map = new Map<string, EventTimelineItem[]>()
    
    tasks.value.forEach(task => {
        if (!map.has(task.resource)) {
            map.set(task.resource, [])
        }
        map.get(task.resource)?.push(task)
    })

    map.forEach((tasks, resource) => {
        groups.push({ resource, tasks })
    })

    return groups
})

// Calculate position and width
const getTaskStyle = (task: EventTimelineItem) => {
    const getMinutes = (timeStr: string) => {
        const [h, m] = timeStr.split(':').map(Number)
        return h * 60 + m
    }

    const startMinutes = getMinutes(task.startTime)
    const endMinutes = getMinutes(task.endTime)
    const baseStart = startHour * 60

    const left = ((startMinutes - baseStart) / 60) * hourWidth
    const width = ((endMinutes - startMinutes) / 60) * hourWidth

    // Just simpler offset/width logic
    return {
        left: `${left}px`,
        width: `${width}px`
    }
}

onMounted(async () => {
    loading.value = true
    const data = await getEventTimeline(eventId)
    if (data) tasks.value = data
    loading.value = false
})

</script>

<style scoped lang="scss">
.event-schedule-page {
    background-color: #fafafa;
    height: calc(100vh - 50px); // subtract top layout if needed
}

.gantt-card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background: white;
    overflow: hidden;
}

.gantt-header {
    height: 50px;
    border-bottom: 1px solid #e0e0e0;
    background: #f5f5f5;
}

.resource-column-header {
    width: 200px;
    border-right: 1px solid #e0e0e0;
    display: flex;
    align-items: center;
    flex-shrink: 0;
}

.resource-column {
    width: 200px;
    border-right: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
    flex-shrink: 0;
}

.resource-row {
    height: 80px; // Fixed height for rows
}

.timeline-header {
    overflow: hidden; // Header scrolling synced with body is harder without structure, simplifying for now
}

// In a real app we'd sync scroll. For now, we assume simple Overflow-X auto on a container if needed.
// But here the timeline fits or we just let "timeline-lane" expand.

.time-slot {
    width: 100px;
    border-right: 1px solid #e0e0e0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.timeline-lane {
    border-bottom: 1px solid #e0e0e0;
    background: white;
    min-width: 1100px; // Ensure explicit width for the hours 14-24 (11 hours * 100px)
}

.grid-line {
    position: absolute;
    top: 0;
    bottom: 0;
    border-right: 1px dashed #eee;
    width: 100px;
    /* This needs loop offset, simpler to just use background-image repeater */
    display: none; // Using simple approach first
}

// Re-implement grid lines via repeating gradient on lane is better
.timeline-lane {
     background-image: linear-gradient(to right, transparent 99px, #f0f0f0 100px);
     background-size: 100px 100%;
}

.task-bar {
    position: absolute;
    top: 20px;
    height: 40px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    transition: transform 0.2s;
    
    &:hover {
        transform: translateY(-2px);
        z-index: 10;
    }
}
</style>
