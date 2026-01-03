<template>
  <q-page class="event-dashboard-page q-pa-lg">
    <div class="column q-gutter-y-md">
      
      <!-- Row 1: Event Summary Card -->
      <q-card flat class="summary-card" v-if="event">
        <q-card-section>
          <div class="row justify-between items-start">
            <div>
              <div class="text-h5 text-weight-bold q-mb-md flex items-center">
                {{ event.title }}
                <q-badge :class="event.statusColor" class="q-ml-sm text-subtitle2 q-px-sm q-py-xs">{{ event.status }}</q-badge>
              </div>
              
              <div class="row  q-col-gutter-x-xl q-col-gutter-y-sm text-grey-8">
                <div class="col-auto flex items-center">
                  <q-icon name="calendar_today" size="xs" class="q-mr-sm" /> {{ event.date }}
                </div>
                <div class="col-auto flex items-center">
                   <q-icon name="schedule" size="xs" class="q-mr-sm" /> {{ event.timeRange }}
                </div>
                <!-- Break to new line on small screens if needed, or keeping formatting -->
                <div class="col-auto flex items-center">
                   <q-icon name="location_on" size="xs" class="q-mr-sm" /> {{ event.location }}
                </div>
              </div>
              
              <div class="row q-col-gutter-x-xl q-col-gutter-y-sm text-grey-8 q-mt-sm">
                 <div class="col-auto flex items-center">
                   <q-icon name="person" size="xs" class="q-mr-sm" /> Customer: {{ event.customer.name }}
                </div>
                <div class="col-auto flex items-center">
                   <q-icon name="assignment_ind" size="xs" class="q-mr-sm" /> Contact: John Doe
                </div>
                <div class="col-auto flex items-center">
                   <q-icon name="phone" size="xs" class="q-mr-sm" /> Number: +972521234567
                </div>
              </div>

            </div>
            
            <!-- Optional Actions or specific status indicators could go here -->
          </div>
        </q-card-section>
      </q-card>
      <div v-else-if="loading" class="row justify-center q-pa-lg">
          <q-spinner color="primary" size="3em" />
      </div>
      <div v-else class="text-center text-grey q-pa-lg">
          Event not found.
      </div>

      <!-- Row 2: KPI Cards -->
      <div class="row q-col-gutter-md">
         <!-- Event Readiness -->
         <div class="col-12 col-md-3">
             <q-card flat class="kpi-card bg-orange-1 text-dark">
                <q-card-section>
                    <div class="row justify-between items-start">
                        <div class="text-subtitle2 text-grey-8">Event Readiness</div>
                        <q-icon name="check_circle_outline" size="sm" color="grey-7" />
                    </div>
                    <div class="kpi-value q-my-sm">85%</div>
                    <div class="text-caption text-grey-7">On Track</div>
                </q-card-section>
             </q-card>
         </div>

         <!-- Briefing Completion -->
         <div class="col-12 col-md-3">
             <q-card flat class="kpi-card bg-orange-1 text-dark">
                <q-card-section>
                    <div class="row justify-between items-start">
                        <div class="text-subtitle2 text-grey-8">Briefing Completion</div>
                        <q-icon name="menu_book" size="sm" color="grey-7" />
                    </div>
                    <div class="kpi-value q-my-sm">95%</div>
                    <div class="text-caption text-grey-7">2 Unread Workers</div>
                </q-card-section>
             </q-card>
         </div>

         <!-- Event Revenue -->
         <div class="col-12 col-md-2">
             <q-card flat class="kpi-card bg-blue-1 text-dark">
                <q-card-section>
                    <div class="row justify-between items-start">
                        <div class="text-subtitle2 text-blue-9">Event Revenue</div>
                        <q-icon name="attach_money" size="sm" color="blue-5" />
                    </div>
                    <div class="kpi-value text-blue-9 q-my-sm">$50,000</div>
                    <div class="text-caption text-blue-7">+10% target</div>
                </q-card-section>
             </q-card>
         </div>

         <!-- Labor Cost -->
         <div class="col-12 col-md-2">
             <q-card flat class="kpi-card bg-red-1 text-dark">
                <q-card-section>
                    <div class="row justify-between items-start">
                        <div class="text-subtitle2 text-red-9">Labor Cost</div>
                        <q-icon name="account_balance_wallet" size="sm" color="red-5" />
                    </div>
                    <div class="kpi-value text-red-9 q-my-sm">$15,000</div>
                    <div class="text-caption text-red-7">+5% over budget</div>
                </q-card-section>
             </q-card>
         </div>
         
         <!-- Net Profit -->
         <div class="col-12 col-md-2">
             <q-card flat class="kpi-card bg-green-1 text-dark">
                <q-card-section>
                    <div class="row justify-between items-start">
                        <div class="text-subtitle2 text-green-9">Net Profit</div>
                        <q-icon name="trending_up" size="sm" color="green-5" />
                    </div>
                    <div class="kpi-value text-green-9 q-my-sm">$35,000</div>
                    <div class="text-caption text-green-7">+8% from estimate</div>
                </q-card-section>
             </q-card>
         </div>
      </div>

      <!-- Row 3: Main Content Columns -->
      <div class="row q-col-gutter-md">
          
          <!-- Column 1: Attention Items -->
          <div class="col-12 col-md-5">
              <div class="text-h6 text-weight-bold q-mb-md">What Needs Your Attention</div>
              <div class="column q-gutter-y-sm">
                  
                  <q-card flat class="attention-card bg-red-1">
                      <q-card-section class="row items-center justify-between q-py-sm">
                          <div class="row items-center">
                              <q-icon name="error_outline" color="negative" class="q-mr-md" size="sm" />
                              <div class="text-grey-9">Worker Jane Doe missing from check-in.</div>
                          </div>
                          <q-btn flat dense color="negative" label="Fix" no-caps class="text-weight-bold" />
                      </q-card-section>
                  </q-card>

                  <q-card flat class="attention-card bg-orange-1">
                      <q-card-section class="row items-center justify-between q-py-sm">
                          <div class="row items-center">
                              <q-icon name="warning_amber" color="warning" class="q-mr-md" size="sm" />
                              <div class="text-grey-9">Missing documents for VIP guests.</div>
                          </div>
                          <q-btn flat dense color="warning" text-color="orange-9" label="Upload" no-caps class="text-weight-bold" />
                      </q-card-section>
                  </q-card>

                  <q-card flat class="attention-card bg-yellow-1">
                      <q-card-section class="row items-center justify-between q-py-sm">
                          <div class="row items-center">
                              <q-icon name="info_outline" color="orange-8" class="q-mr-md" size="sm" />
                              <div class="text-grey-9">2 shifts are currently under-staffed.</div>
                          </div>
                          <q-btn flat dense color="orange-8" label="Adjust Staff" no-caps class="text-weight-bold" />
                      </q-card-section>
                  </q-card>

                  <q-card flat class="attention-card bg-red-1">
                      <q-card-section class="row items-center justify-between q-py-sm">
                          <div class="row items-center">
                              <q-icon name="block" color="negative" class="q-mr-md" size="sm" />
                              <div class="text-grey-9">Schedule conflict for John Smith.</div>
                          </div>
                          <q-btn flat dense color="negative" label="Resolve" no-caps class="text-weight-bold" />
                      </q-card-section>
                  </q-card>

                  <q-card flat class="attention-card bg-blue-1">
                      <q-card-section class="row items-center justify-between q-py-sm">
                          <div class="row items-center">
                              <q-icon name="mail_outline" color="primary" class="q-mr-md" size="sm" />
                              <div class="text-grey-9">Briefing update pending for 5 workers.</div>
                          </div>
                          <q-btn flat dense color="primary" label="Notify" no-caps class="text-weight-bold" />
                      </q-card-section>
                  </q-card>

              </div>
          </div>

          <!-- Column 2: Staffing Stats -->
          <div class="col-12 col-md-3">
             <div class="column q-gutter-y-md full-height">
                 
                 <!-- Approved Workers -->
                 <q-card flat class="staffing-card bg-orange-1 col">
                     <q-card-section class="full-height column justify-center">
                         <div class="row justify-between items-start">
                             <div class="text-subtitle2 text-grey-8">Approved Workers</div>
                             <q-icon name="people_outline" size="sm" color="grey-7" />
                         </div>
                         <div class="kpi-value q-my-sm">26/28</div>
                         <div class="text-caption text-grey-7">2 Pending Approval</div>
                     </q-card-section>
                 </q-card>

                 <!-- Signed-Up Workers -->
                 <q-card flat class="staffing-card bg-orange-1 col">
                     <q-card-section class="full-height column justify-center">
                         <div class="row justify-between items-start">
                             <div class="text-subtitle2 text-grey-8">Signed-Up Workers</div>
                             <q-icon name="people" size="sm" color="grey-7" />
                         </div>
                         <div class="kpi-value q-my-sm">28/30</div>
                         <div class="text-caption text-grey-7">2 Missing</div>
                     </q-card-section>
                 </q-card>

             </div>
          </div>

          <!-- Column 3: Role Composition Chart -->
          <div class="col-12 col-md-4">
              <q-card flat class="chart-card full-height">
                  <q-card-section>
                      <div class="text-h6 text-weight-bold">Role Composition</div>
                      
                      <div class="row items-center justify-around q-mt-lg">
                          <!-- CSS Donut Chart -->
                          <div class="donut-chart-container relative-position">
                              <div class="donut-hole"></div>
                              <div class="donut-segment" :style="donutStyle"></div>
                          </div>
                          
                          <!-- Legend -->
                          <div class="legend column q-gutter-y-xs">
                              <div v-for="role in roles" :key="role.label" class="row items-center">
                                  <div class="legend-dot" :style="{ backgroundColor: role.color }"></div>
                                  <div class="text-caption text-grey-8 q-ml-sm">{{ role.label }} ({{ role.count }})</div>
                              </div>
                          </div>
                      </div>
                  </q-card-section>
              </q-card>
          </div>

      </div>

    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getEventById, type TeamgleEvent } from '../../services/mock/eventController'

const route = useRoute()
const eventId = route.params.id as string

const event = ref<TeamgleEvent | null>(null)
const loading = ref(true)

interface RoleData {
    label: string;
    count: number;
    color: string;
}

const roles = ref<RoleData[]>([
    { label: 'Driving', count: 10, color: '#4f46e5' }, // Indigo-600
    { label: 'Driver', count: 11, color: '#a855f7' }, // Purple-500
    { label: 'Assistant', count: 1, color: '#eab308' }, // Yellow-500
    { label: 'Server', count: 2, color: '#f59e0b' }, // Amber-500
    { label: 'Waiter', count: 5, color: '#ef4444' }, // Red-500
    { label: 'Security Guard', count: 2, color: '#3b82f6' }, // Blue-500
])

const totalRoles = computed(() => roles.value.reduce((acc, r) => acc + r.count, 0))

// Create conic-gradient string for the donut
const donutStyle = computed(() => {
    let currentDeg = 0
    const segments = roles.value.map(role => {
        const deg = (role.count / totalRoles.value) * 360
        const segmentStr = `${role.color} ${currentDeg}deg ${currentDeg + deg}deg`
        currentDeg += deg
        return segmentStr
    })
    
    return {
        background: `conic-gradient(${segments.join(', ')})`
    }
})

onMounted(async () => {
    const fetchedEvent = await getEventById(eventId)
    if (fetchedEvent) {
        event.value = fetchedEvent
    }
    loading.value = false
})

</script>

<style scoped lang="scss">
.event-dashboard-page {
    background-color: #fafafa;
    min-height: 100%;
}

.summary-card {
    border: 1px solid #e0e0e0;
    border-radius: 12px;
}

.kpi-card {
    border-radius: 12px;
    height: 100%;
    // Override bg colors slightly if needed to match image exactly, 
    // but quasar bg-orange-1 etc are close.
    // The image uses very light pastel backgrounds.
}

.kpi-value {
    font-size: 1.75rem;
    font-weight: bold;
}

.attention-card {
    border-radius: 8px;
    border-left: 4px solid transparent; // Optional accent
}

.staffing-card {
    border-radius: 12px;
}

.chart-card {
    border-radius: 12px;
    border: 1px solid #e0e0e0;
}

// Donut Chart CSS
.donut-chart-container {
    width: 160px;
    height: 160px;
    border-radius: 50%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.donut-segment {
    width: 100%;
    height: 100%;
    border-radius: 50%;
}

.donut-hole {
    position: absolute;
    width: 60%;
    height: 60%;
    background-color: white;
    border-radius: 50%;
    z-index: 10;
}

.legend-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
}
</style>
