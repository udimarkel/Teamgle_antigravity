<template>
  <q-page class="event-tasks-page q-pa-lg">
    <div class="column full-height q-gutter-y-md">
      
      <!-- Header -->
      <div class="row justify-between items-center">
        <div>
           <div class="text-h5 text-weight-bold">Event Tasks</div>
           <div class="text-subtitle2 text-grey-7">Track to-do items and assignees.</div>
        </div>
        <div class="row q-gutter-x-sm">
             <q-btn outline color="grey-7" label="Filter" icon="filter_list" no-caps />
             <q-btn unelevated color="primary" label="New Task" icon="add" no-caps @click="addTask" />
        </div>
      </div>

      <div class="row q-col-gutter-lg">
          
          <!-- Pending Tasks -->
          <div class="col-12 col-md-6">
              <div class="text-h6 q-mb-md flex items-center">
                  Pending <q-badge color="orange-1" text-color="orange-9" class="q-ml-sm">{{ pendingTasks.length }}</q-badge>
              </div>
              <q-card flat class="tasks-card">
                  <q-list separator>
                      <q-item v-for="task in pendingTasks" :key="task.id" clickable v-ripple>
                          <q-item-section side top>
                              <q-checkbox v-model="task.isCompleted" />
                          </q-item-section>
                          
                          <q-item-section>
                              <q-item-label class="text-weight-medium">{{ task.title }}</q-item-label>
                              <q-item-label caption class="q-mt-xs flex items-center">
                                  <q-icon name="event" size="xs" class="q-mr-xs" /> {{ task.date }}
                                  <span class="q-mx-sm">&bull;</span>
                                  <q-icon name="place" size="xs" class="q-mr-xs" /> {{ task.location }}
                              </q-item-label>
                          </q-item-section>

                          <q-item-section side top>
                              <div class="row items-center q-gutter-x-sm">
                                  <q-badge v-if="task.priority" :color="getPriorityColor(task.priority)" label="task.priority" rounded class="q-px-sm" />
                                  <q-avatar size="28px" v-if="task.assigneeAvatar">
                                      <img :src="task.assigneeAvatar" />
                                  </q-avatar>
                                  <q-avatar size="28px" color="grey-3" text-color="grey-7" icon="person" v-else />
                              </div>
                          </q-item-section>
                      </q-item>
                       <q-item v-if="pendingTasks.length === 0">
                          <q-item-section class="text-center text-grey q-py-lg">No pending tasks</q-item-section>
                      </q-item>
                  </q-list>
              </q-card>
          </div>

          <!-- Completed Tasks -->
          <div class="col-12 col-md-6">
              <div class="text-h6 q-mb-md flex items-center">
                  Completed <q-badge color="green-1" text-color="green-9" class="q-ml-sm">{{ completedTasks.length }}</q-badge>
              </div>
              <q-card flat class="tasks-card bg-grey-1">
                  <q-list separator>
                      <q-item v-for="task in completedTasks" :key="task.id" clickable v-ripple class="opacity-60">
                          <q-item-section side top>
                              <q-checkbox v-model="task.isCompleted" color="green" />
                          </q-item-section>
                          
                          <q-item-section>
                              <q-item-label class="text-strike text-grey-8">{{ task.title }}</q-item-label>
                              <q-item-label caption class="q-mt-xs">
                                  Completed
                              </q-item-label>
                          </q-item-section>
                          
                           <q-item-section side top>
                              <q-avatar size="28px" v-if="task.assigneeAvatar">
                                  <img :src="task.assigneeAvatar" />
                              </q-avatar>
                          </q-item-section>
                      </q-item>
                      <q-item v-if="completedTasks.length === 0">
                          <q-item-section class="text-center text-grey q-py-lg">No completed tasks</q-item-section>
                      </q-item>
                  </q-list>
              </q-card>
          </div>

      </div>

    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getTasks, type TodoTask } from '../../services/mock/todoController'
import { useQuasar } from 'quasar'

const route = useRoute()
const $q = useQuasar()
const eventId = route.params.id as string

const tasks = ref<TodoTask[]>([])

const pendingTasks = computed(() => tasks.value.filter(t => !t.isCompleted))
const completedTasks = computed(() => tasks.value.filter(t => t.isCompleted))

const getPriorityColor = (p?: string) => {
    switch(p) {
        case 'High': return 'red-5'
        case 'Medium': return 'orange-5'
        case 'Low': return 'blue-5'
        default: return 'grey'
    }
}

const addTask = () => {
    $q.notify({ message: 'Create Task Mock', color: 'primary' })
}

onMounted(async () => {
    tasks.value = await getTasks(eventId)
})
</script>

<style scoped lang="scss">
.event-tasks-page {
    background-color: #fafafa;
    min-height: 100%;
}

.tasks-card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
}

.opacity-60 {
    opacity: 0.6;
}
</style>
