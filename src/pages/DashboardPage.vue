<template>
  <q-page class="dashboard-page">
    <div class="row q-col-gutter-md">
      <!-- LEFTSIDE COLUMN (Stats + Todo) -->
      <div class="col-12 col-md-8">
        <div class="row q-col-gutter-md">
          
          <!-- Widget 1: Financial KPI -->
          <div class="col-12 col-sm-6">
            <q-card class="dashboard-card full-height">
              <q-card-section>
                <div class="card-title">{{ langStore.t('Financial Performance (YTD)') }}</div>
              </q-card-section>
              <q-card-section class="row justify-between items-center">
                <div class="text-center">
                   <q-avatar color="amber-1" text-color="amber-9" icon="credit_card" font-size="28px" size="50px" class="q-mb-sm"/>
                   <div class="stat-value text-amber-9">${{ formatK(financialData.expenses) }}K</div>
                   <div class="stat-label">{{ langStore.t('Expenses') }}</div>
                </div>
                <div class="text-center">
                   <q-avatar color="green-1" text-color="green-6" icon="attach_money" font-size="28px" size="50px" class="q-mb-sm"/>
                   <div class="stat-value text-green-6">${{ formatK(financialData.income) }}K</div>
                   <div class="stat-label">{{ langStore.t('Income') }}</div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Widget 3: Action Buttons (Moved) -->
          <div class="col-12 col-sm-6">
             <div class="row q-col-gutter-sm">
                <div class="col-6" v-for="action in actionButtons" :key="action.label">
                   <q-btn unelevated 
                          class="action-shortcut-btn column no-wrap" 
                          :class="action.colorClass"
                          >
                     <q-icon :name="action.icon" size="md" class="q-mb-sm" />
                     <div class="btn-label" v-html="action.label"></div>
                   </q-btn>
                </div>
             </div>
          </div>
        </div>

        <!-- Widget 2: The To-Do List -->
        <div class="row q-mt-md">
          <div class="col-12">
            <q-card class="dashboard-card">
              <q-card-section class="todo-header row items-center justify-between">
                <div class="text-h6">{{ langStore.t('To Do List') }}</div>
                <q-btn round color="white" text-color="primary" icon="add" size="sm" @click="addNewTask" />
              </q-card-section>

              <q-list separator>
                <q-item v-for="task in todoTasks" :key="task.id" clickable v-ripple tag="label" @dblclick="navigateToEventTasks(task)">
                  <q-item-section side top>
                    <q-checkbox v-model="task.isCompleted" />
                  </q-item-section>

                  <!-- VIEW MODE -->
                  <q-item-section v-if="!task.isEditing">
                    <q-item-label :class="{'text-strike text-grey-5': task.isCompleted}">{{ task.title }}</q-item-label>
                    <q-item-label caption v-if="task.eventName" class="text-primary text-weight-bold q-mb-xs" style="font-size: 0.75rem;">
                         {{ task.eventName }}
                    </q-item-label>
                    <q-item-label caption>
                      <q-icon name="location_on" size="xs" /> {{ task.location }} &bull; {{ task.date }}
                    </q-item-label>
                  </q-item-section>

                  <!-- EDIT MODE -->
                  <q-item-section v-else>
                     <q-input v-model="task.title" dense autofocus placeholder="Task Title" class="q-mb-xs" />
                     <div class="row q-col-gutter-xs">
                        <div class="col-6">
                            <q-input v-model="task.date" dense placeholder="Date" style="font-size: 0.8rem">
                                <template v-slot:append>
                                    <q-icon name="event" class="cursor-pointer" size="xs">
                                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                        <q-date v-model="task.date" mask="DD/MM/YYYY">
                                        <div class="row items-center justify-end">
                                            <q-btn v-close-popup label="Save" color="primary" flat />
                                        </div>
                                        </q-date>
                                    </q-popup-proxy>
                                    </q-icon>
                                </template>
                            </q-input>
                        </div>
                        <div class="col-6">
                             <q-input v-model="task.location" dense placeholder="Location" style="font-size: 0.8rem" />
                        </div>
                     </div>
                  </q-item-section>

                  <q-item-section side>
                    <div class="row items-center">
                       <!-- Delete Button (Always Visible or only in Edit?) User asked for Save on the right where Delete/More is -->
                       
                       <template v-if="task.isEditing">
                           <!-- Save Button -->
                           <q-btn flat dense round color="primary" icon="check" @click.stop="saveTask(task)" class="q-mr-sm" />
                       </template>
                       
                       <q-btn 
                        v-if="task.isCompleted"
                        flat dense round 
                        color="negative" 
                        icon="delete" 
                        @click.stop="removeTask(task.id)"
                        class="q-mr-sm"
                      />
                      
                      <!-- Edit Button (trigger) -->
                      <q-btn v-if="!task.isEditing" flat dense round icon="sym_r_more_vert" color="grey-7" size="sm" @click.stop="enableEdit(task)" />
                    </div>
                  </q-item-section>
                </q-item>
                
                <q-item v-if="todoTasks.length === 0">
                    <q-item-section class="text-center text-grey">{{ langStore.t('All caught up!') }}</q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>
        </div>
      </div>

      <!-- RIGHTSIDE COLUMN (Activities) -->
      <div class="col-12 col-md-4">
        
        <!-- Widget 4: Upcoming Activities -->
        <q-card class="dashboard-card">
          <q-card-section class="row justify-between items-center">
            <div class="card-title">{{ langStore.t('Upcoming Activities') }}</div>
            <router-link to="/events" class="view-more-link">{{ langStore.t('View more') }}</router-link>
          </q-card-section>
          
          <q-list padding class="scrollable-list">
            <q-item 
                v-for="event in sortedEvents" 
                :key="event.id" 
                class="activity-item cursor-pointer"
                @dblclick="navigateToEvent(event.id)"
            >
               <q-item-section>
                 <q-item-label>
                    <q-badge :class="getTimeBadge(event.date).color" rounded class="q-mb-xs">{{ getTimeBadge(event.date).label }}</q-badge>
                 </q-item-label>
                 <q-item-label class="text-weight-bold">{{ event.title }}</q-item-label>
                 <q-item-label caption class="q-mt-xs">
                   <q-icon name="event" /> {{ event.date }} &bull; <q-icon name="schedule" /> {{ event.timeRange }}
                 </q-item-label>
                 <div class="row q-mt-sm">
                   <q-avatar v-for="(avatar, i) in event.workersAssigned" :key="i" size="24px" class="worker-avatar">
                     <img :src="avatar">
                   </q-avatar>
                 </div>
               </q-item-section>

               <q-item-section side top>
                  <q-circular-progress
                    show-value
                    font-size="10px"
                    :value="event.progress"
                    size="40px"
                    :thickness="0.25"
                    color="primary"
                    track-color="grey-3"
                    class="q-ma-md"
                  >
                    {{ event.progress }}%
                  </q-circular-progress>
               </q-item-section>
            </q-item>
          </q-list>
        </q-card>

      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getFinancialData, FinancialData } from '../services/mock/financialController'
import { getEvents, TeamgleEvent } from '../services/mock/eventController'
import { getTasks, deleteTask, TodoTask, addTask, updateTask } from '../services/mock/todoController'
import { useQuasar } from 'quasar'

import { useRouter } from 'vue-router'
import { useLanguageStore } from '../stores/language'

const $q = useQuasar()
const router = useRouter()
const langStore = useLanguageStore()

// Extend the TodoTask type for local UI state
interface TodoTaskWithUI extends TodoTask {
    isEditing?: boolean;
}

const navigateToEvent = (id: string) => {
    router.push(`/events/${id}/dashboard`)
}

const navigateToEventTasks = (task: TodoTaskWithUI) => {
    if (task.eventId) {
        router.push(`/events/${task.eventId}/tasks`)
    }
}

// --- State ---
const financialData = ref<FinancialData>({ expenses: 0, income: 0 })
const rawEvents = ref<TeamgleEvent[]>([])
const todoTasks = ref<TodoTaskWithUI[]>([])

const actionButtons = computed(() => [
    { label: langStore.t('Create<br>Event'), icon: 'event', colorClass: 'bg-blue-1 text-primary' },
    { label: langStore.t('Create<br>Customer'), icon: 'person_add', colorClass: 'bg-green-1 text-green-9' },
    { label: langStore.t('Send<br>Update'), icon: 'chat_bubble_outline', colorClass: 'bg-green-1 text-green-9' },
    { label: langStore.t('Add<br>Worker'), icon: 'group_add', colorClass: 'bg-orange-1 text-orange-9' },
])

// --- Helpers ---
const formatK = (val: number): string => (val / 1000).toFixed(0)

const getTimeBadge = (dateStr: string): { label: string, color: string } => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Parse input date string
    const target = new Date(dateStr)
    target.setHours(0, 0, 0, 0)
    
    // Difference in milliseconds
    const diffTime = target.getTime() - today.getTime()
    // Diff in days (rounded up to handle partial days if any time info leaked, though we reset hours)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
        return { label: 'Today', color: 'bg-green-1 text-green-8' }
    } else if (diffDays === 1) {
        return { label: 'Tomorrow', color: 'bg-orange-1 text-orange-9' }
    } else if (diffDays > 1 && diffDays <= 7) {
        return { label: 'This Week', color: 'bg-blue-1 text-blue-8' }
    } else {
        return { label: langStore.t('Upcoming'), color: 'bg-grey-3 text-grey-8' }
    }
}



// --- Computed ---
const sortedEvents = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return rawEvents.value
        .filter(e => {
            const eDate = new Date(e.date)
            // Invalid dates go to end or filtered? Let's keep valid only.
            if (isNaN(eDate.getTime())) return false
            // Keep today and future
            return eDate >= today
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
})

// --- Lifecycle ---
onMounted(async () => {
  try {
    const [finData, events, tasks] = await Promise.all([
      getFinancialData(),
      getEvents(),
      getTasks()
    ])
    
    financialData.value = finData
    rawEvents.value = events
    todoTasks.value = tasks
  } catch (error) {
    console.error('Failed to load dashboard data', error)
    $q.notify({ type: 'negative', message: 'Failed to load dashboard data' })
  }
})

// --- Interaction ---
const removeTask = async (id: string) => {
  try {
    await deleteTask(id)
    todoTasks.value = todoTasks.value.filter(t => t.id !== id)
    $q.notify({ type: 'positive', message: 'Task removed' })
  } catch (e) {
    console.error(e)
  }
}

const addNewTask = async () => {
    // Create a temporary local task first, or save immediately? 
    // User wants to enter content. So let's create a blank one in DB or just local? 
    // "New task should start in Edit Mode". 
    // Let's create it in DB to get an ID (since our mock generates ID), then allow edit.
    
    // Better UX: Create empty task, set isEditing=true.
    const newTask = await addTask({
        title: '',
        date: new Date().toLocaleDateString('en-GB'),
        location: '',
        isCompleted: false
    })
    
    // Extend with local state
    const editableTask: TodoTaskWithUI = { ...newTask, isEditing: true }
    todoTasks.value.push(editableTask)
}

const enableEdit = (task: TodoTaskWithUI) => {
    task.isEditing = true
}

const saveTask = async (task: TodoTaskWithUI) => {
    try {
        if (!task.title.trim()) {
            $q.notify({ type: 'warning', message: 'Title cannot be empty' })
            return
        }
        await updateTask(task.id, {
            title: task.title,
            date: task.date,
            location: task.location
        })
        task.isEditing = false
        $q.notify({ type: 'positive', message: 'Task saved' })
    } catch (e) {
        console.error(e)
        $q.notify({ type: 'negative', message: 'Failed to save task' })
    }
}
</script>

<style scoped lang="scss">
.dashboard-page {
  background: linear-gradient(135deg, #eff6ff 0%, #f3e5f5 100%);
  min-height: 100vh;
  /* Responsive padding handled via utility classes or query if needed, but let's just reduce default */
  padding: 16px; 
}

@media (min-width: 600px) {
    .dashboard-page {
        padding: 24px;
    }
}

.dashboard-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.scrollable-list {
  max-height: 600px; /* Approximate screen height limit for this widget */
  overflow-y: auto;
}

.card-title {
    font-size: 1rem;
    font-weight: bold;
    color: #333;
}

.stat-value {
    font-size: 1.5rem;
    font-weight: bold;
}

.stat-label {
    font-size: 0.75rem;
    color: #616161;
}

.todo-header {
  background: #4facfe;
  color: white;
  padding: 12px 16px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}

[dir="rtl"] .todo-header {
    text-align: right;
    direction: rtl;
}

.action-shortcut-btn {
    width: 100%;
    padding: 16px 0;
    height: 100px;
    border-radius: 16px;
    
    .btn-label {
        font-weight: bold;
        line-height: 1.1;
        text-align: center;
        margin-left: 10px;
    }
}

.view-more-link {
    color: var(--q-primary);
    font-size: 0.75rem;
    font-weight: bold;
    text-decoration: none;
}

.activity-item {
    background-color: #f5f5f5;
    border-radius: 16px;
    margin-bottom: 8px;
    margin-left: 8px;
    margin-right: 8px;
}

.worker-avatar {
    margin-right: 4px;
}
</style>
