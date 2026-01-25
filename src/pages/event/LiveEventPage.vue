<template>
  <q-page class="bg-grey-50 min-h-screen q-pb-xl">
    
    <div v-if="event">
        <!-- 1. Sticky Header & Context Bar -->
        <div class="bg-white q-px-lg q-py-md sticky-top border-bottom z-top row items-center justify-between shadow-sm">
            <!-- Left: Event Context -->
            <div class="row items-center q-gutter-x-md">
                <q-btn flat round icon="arrow_back" color="grey-7" @click="$router.push('/')" />
                <div>
                    <div class="row items-center q-gutter-x-sm">
                        <div class="text-h6 text-weight-bold text-grey-9 lh-1">{{ event.title }}</div>
                        <div class="bg-red-1 text-red-7 text-caption text-weight-bold q-px-sm rounded-borders flex flex-center" style="height: 20px;">
                            <div class="pulsing-dot q-mr-xs"></div> LIVE
                        </div>
                    </div>
                    <div class="row items-center text-grey-6 text-caption q-mt-xs">
                        <q-icon name="location_on" size="14px" class="q-mr-xs" /> {{ event.location }}
                        <span class="q-mx-sm text-grey-4">|</span>
                        <q-icon name="schedule" size="14px" class="q-mr-xs" /> {{ event.timeRange }}
                    </div>
                </div>
            </div>

            <!-- Center: Weather Widget -->
            <div class="row items-center q-gutter-x-md hidden-xs">
                 <div class="bg-blue-50 text-blue-9 q-px-md q-py-sm rounded-borders row items-center">
                    <q-icon name="wb_sunny" class="q-mr-sm" size="xs" />
                    <div class="text-caption text-weight-medium">Clear Sky, 24°C</div>
                 </div>
            </div>

            <!-- Right: Actions -->
            <div class="row items-center q-gutter-x-sm">
                <q-btn flat no-caps color="grey-7" icon="campaign" label="Broadcast" class="bg-grey-1" />
                <q-btn unelevated no-caps color="red-6" icon="stop" label="End Event" @click="$router.push('/events/' + event.id + '/summary')" />
            </div>
        </div>

        <div class="q-pa-lg mx-auto" style="max-width: 1600px;">
            
            <!-- 2. Smart KPI Strip -->
            <div class="row q-col-gutter-lg q-mb-lg">
                <!-- KPI 1: Workforce Coverage -->
                <div class="col-12 col-md-4">
                    <q-card flat class="rounded-xl q-pa-lg bg-white shadow-soft full-height row items-center justify-between">
                        <div>
                            <div class="row items-center q-mb-xs">
                                <q-icon name="group" color="blue-6" size="sm" class="q-mr-sm bg-blue-1 rounded-circle q-pa-xs" />
                                <div class="text-subtitle2 text-grey-6 text-weight-bold">Workforce Coverage</div>
                            </div>
                            <div class="text-h3 text-grey-9 text-weight-bolder q-mt-sm">92%</div>
                            <div class="text-caption text-green-6 text-weight-bold q-mt-xs row items-center">
                                <q-icon name="check_circle" size="12px" class="q-mr-xs" /> 48/52 Staffed
                            </div>
                        </div>
                        <q-circular-progress
                            show-value
                            font-size="12px"
                            :value="92"
                            size="70px"
                            :thickness="0.15"
                            color="blue-6"
                            track-color="blue-1"
                            class="text-blue-9 text-weight-bold"
                        >
                            92%
                        </q-circular-progress>
                    </q-card>
                </div>

                <!-- KPI 2: Active Issues -->
                <div class="col-12 col-md-4">
                     <q-card flat class="rounded-xl q-pa-lg bg-white shadow-soft full-height row items-center justify-between">
                        <div>
                             <div class="row items-center q-mb-xs">
                                <q-icon name="warning" color="orange-6" size="sm" class="q-mr-sm bg-orange-1 rounded-circle q-pa-xs" />
                                <div class="text-subtitle2 text-grey-6 text-weight-bold">Active Issues</div>
                            </div>
                            <div class="text-h3 text-grey-9 text-weight-bolder q-mt-sm">{{ activeIssues.length }}</div>
                            <div class="text-caption text-orange-7 text-weight-bold q-mt-xs row items-center">
                                Requires Attention
                            </div>
                        </div>
                        <!-- Simple visual graph representation -->
                        <div class="row items-end q-gutter-x-xs" style="height: 40px">
                             <div class="bg-orange-2 rounded-borders" style="width: 8px; height: 40%"></div>
                             <div class="bg-orange-3 rounded-borders" style="width: 8px; height: 70%"></div>
                             <div class="bg-orange-5 rounded-borders" style="width: 8px; height: 100%"></div>
                             <div class="bg-orange-2 rounded-borders" style="width: 8px; height: 50%"></div>
                        </div>
                    </q-card>
                </div>

                <!-- KPI 3: Next Shift -->
                <div class="col-12 col-md-4">
                    <q-card flat class="rounded-xl q-pa-lg bg-white shadow-soft full-height row items-center justify-between">
                        <div>
                            <div class="row items-center q-mb-xs">
                                <q-icon name="event" color="green-6" size="sm" class="q-mr-sm bg-green-1 rounded-circle q-pa-xs" />
                                <div class="text-subtitle2 text-grey-6 text-weight-bold">Incoming Shift</div>
                            </div>
                            <div class="text-h3 text-grey-9 text-weight-bolder q-mt-sm">+12</div>
                            <div class="text-caption text-green-7 text-weight-bold q-mt-xs row items-center">
                                Arriving by 18:00
                            </div>
                        </div>
                         <div class="text-center bg-green-50 rounded-lg q-pa-sm">
                            <div class="text-h6 text-green-9 text-weight-bold">18:00</div>
                            <div class="text-xs text-green-7 text-uppercase text-weight-bold">Start</div>
                        </div>
                    </q-card>
                </div>
            </div>

            <div class="row q-col-gutter-lg">
                <!-- Left Column: Staff Boards -->
                <div class="col-12 col-lg-8">
                     <!-- Staff Status Board -->
                     <div class="row q-col-gutter-md">
                         <!-- Running Late (Orange) -->
                         <div class="col-12 col-md-4">
                             <div class="text-subtitle1 text-weight-bold text-grey-9 q-mb-md">Running Late <span class="bg-orange-1 text-orange-8 q-px-sm rounded-borders text-caption q-ml-sm">{{ staffLate.length }}</span></div>
                             <div class="column q-gutter-y-sm">
                                 <q-card v-for="worker in staffLate" :key="worker.id" flat class="rounded-xl bg-white shadow-sm q-pa-sm hover-elevate cursor-pointer">
                                     <q-item class="q-pa-none">
                                         <q-item-section avatar>
                                             <q-avatar size="40px">
                                                 <img :src="worker.avatar" />
                                             </q-avatar>
                                         </q-item-section>
                                         <q-item-section>
                                             <q-item-label class="text-weight-bold text-grey-9">{{ worker.name }}</q-item-label>
                                             <q-item-label caption class="text-grey-6">{{ worker.role }}</q-item-label>
                                         </q-item-section>
                                         <q-item-section side>
                                             <q-badge rounded color="orange-5" class="q-py-xs q-px-sm shadow-1">
                                                {{ worker.lateBy }}
                                             </q-badge>
                                         </q-item-section>
                                     </q-item>
                                 </q-card>
                             </div>
                         </div>

                         <!-- Active / On-Site (Blue/Green) -->
                         <div class="col-12 col-md-4">
                             <div class="text-subtitle1 text-weight-bold text-grey-9 q-mb-md">On-Site <span class="bg-green-1 text-green-8 q-px-sm rounded-borders text-caption q-ml-sm">{{ staffActive.length }}</span></div>
                              <div class="column q-gutter-y-sm">
                                 <q-card v-for="worker in staffActive" :key="worker.id" flat class="rounded-xl bg-white shadow-sm q-pa-sm hover-elevate cursor-pointer">
                                     <q-item class="q-pa-none">
                                         <q-item-section avatar>
                                             <q-avatar size="40px">
                                                 <img :src="worker.avatar" />
                                             </q-avatar>
                                         </q-item-section>
                                         <q-item-section>
                                             <q-item-label class="text-weight-bold text-grey-9">{{ worker.name }}</q-item-label>
                                             <q-item-label caption class="text-green-6 text-weight-medium">
                                                 <q-icon name="my_location" size="10px" /> {{ worker.location }}
                                             </q-item-label>
                                         </q-item-section>
                                     </q-item>
                                 </q-card>
                             </div>
                         </div>

                         <!-- Checked Out (Grey) -->
                         <div class="col-12 col-md-4">
                             <div class="text-subtitle1 text-weight-bold text-grey-9 q-mb-md">Checked Out <span class="bg-grey-2 text-grey-7 q-px-sm rounded-borders text-caption q-ml-sm">{{ staffDone.length }}</span></div>
                              <div class="column q-gutter-y-sm">
                                 <q-card v-for="worker in staffDone" :key="worker.id" flat class="rounded-xl bg-white border-dashed-grey q-pa-sm opacity-60">
                                     <q-item class="q-pa-none">
                                         <q-item-section avatar>
                                             <q-avatar size="40px" class="grayscale">
                                                 <img :src="worker.avatar" />
                                             </q-avatar>
                                         </q-item-section>
                                         <q-item-section>
                                             <q-item-label class="text-weight-bold text-grey-7">{{ worker.name }}</q-item-label>
                                             <q-item-label caption>{{ worker.role }}</q-item-label>
                                         </q-item-section>
                                     </q-item>
                                 </q-card>
                             </div>
                         </div>
                     </div>

                     <!-- Timeline / Gantt -->
                     <q-card flat class="rounded-xl bg-white shadow-soft q-mt-lg">
                        <q-card-section class="q-pb-none row justify-between items-center q-mb-md">
                            <div>
                                <div class="text-h6 text-weight-bold text-grey-9">Shift Coverage Gantt</div>
                                <div class="text-caption text-grey-6">Live view of current and upcoming shifts</div>
                            </div>
                            <div class="row q-gutter-x-sm">
                                <div class="row items-center"><div class="q-mr-xs rounded-circle bg-orange-4" style="width: 8px; height: 8px;"></div><span class="text-caption text-grey-7">Security</span></div>
                                <div class="row items-center"><div class="q-mr-xs rounded-circle bg-blue-5" style="width: 8px; height: 8px;"></div><span class="text-caption text-grey-7">Bar</span></div>
                                <div class="row items-center"><div class="q-mr-xs rounded-circle bg-green-5" style="width: 8px; height: 8px;"></div><span class="text-caption text-grey-7">Entrance</span></div>
                            </div>
                        </q-card-section>
                        
                        <q-card-section class="q-pt-none overflow-hidden">
                            <!-- Time Axis -->
                            <div class="row q-mb-sm text-caption text-grey-5 uppercase font-medium relative-position" style="height: 20px;">
                                <div v-for="hour in [15, 16, 17, 18, 19, 20, 21, 22]" :key="hour" 
                                     class="absolute text-center" 
                                     :style="{ left: ((hour - 15) / 8 * 100) + '%', width: (100/8) + '%' }"
                                >
                                    {{ hour }}:00
                                </div>
                            </div>
                            
                            <!-- Grid Lines Background -->
                            <div class="absolute-full" style="top: 60px; pointer-events: none; z-index: 0;">
                                <div v-for="i in 8" :key="i" class="absolute border-right-dashed" 
                                     :style="{ left: ((i) / 8 * 100) + '%', height: '100%', borderColor: '#f1f5f9' }"
                                ></div>
                            </div>

                            <!-- Gantt Rows -->
                            <div class="relative-position" style="z-index: 1;">
                                <!-- Row 1: Security -->
                                <div class="row items-center q-mb-lg relative-position" style="height: 40px;">
                                    <div class="col-2 text-subtitle2 text-weight-bold text-grey-8">Security</div>
                                    <div class="col-10 relative-position full-height">
                                        <!-- Shift Bar -->
                                        <div class="absolute bg-orange-100 full-height row items-center q-px-md rounded-borders shadow-sm"
                                             style="left: 0%; width: 85%; top: 0;"
                                        >
                                           <div class="div bg-orange-4 absolute-full opacity-20 rounded-borders"></div> <!-- Background tint -->
                                           <div class="z-top row items-center justify-between full-width">
                                                <span class="text-weight-bold text-orange-9">12 / 15 On Post</span>
                                                <div class="row items-center overlapping-avatars">
                                                    <q-avatar size="24px" class="shadow-1"><img src="https://cdn.quasar.dev/img/avatar1.jpg"/></q-avatar>
                                                    <q-avatar size="24px" class="shadow-1"><img src="https://cdn.quasar.dev/img/avatar3.jpg"/></q-avatar>
                                                    <div class="bg-orange-2 text-orange-9 text-caption flex flex-center rounded-circle shadow-1" style="width: 24px; height: 24px;">+10</div>
                                                </div>
                                           </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Row 2: Bar Staff -->
                                <div class="row items-center q-mb-lg relative-position" style="height: 40px;">
                                    <div class="col-2 text-subtitle2 text-weight-bold text-grey-8">Bar Staff</div>
                                    <div class="col-10 relative-position full-height">
                                        <!-- Shift Bar -->
                                        <div class="absolute bg-blue-100 full-height row items-center q-px-md rounded-borders shadow-sm"
                                             style="left: 20%; width: 60%; top: 0;"
                                        >
                                           <div class="div bg-blue-5 absolute-full opacity-20 rounded-borders"></div>
                                           <div class="z-top row items-center justify-between full-width">
                                                <span class="text-weight-bold text-blue-9">8 / 8 Full</span>
                                                <div class="row items-center overlapping-avatars">
                                                    <q-avatar size="24px" class="shadow-1"><img src="https://cdn.quasar.dev/img/avatar2.jpg"/></q-avatar>
                                                    <q-avatar size="24px" class="shadow-1"><img src="https://cdn.quasar.dev/img/avatar4.jpg"/></q-avatar>
                                                    <q-avatar size="24px" class="shadow-1"><img src="https://cdn.quasar.dev/img/avatar5.jpg"/></q-avatar>
                                                </div>
                                           </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Row 3: Entrance -->
                                <div class="row items-center q-mb-md relative-position" style="height: 40px;">
                                    <div class="col-2 text-subtitle2 text-weight-bold text-grey-8">Entrance</div>
                                    <div class="col-10 relative-position full-height">
                                        <!-- Shift Bar -->
                                        <div class="absolute bg-green-100 full-height row items-center q-px-md rounded-borders shadow-sm"
                                             style="left: 10%; width: 40%; top: 0;"
                                        >
                                           <div class="div bg-green-5 absolute-full opacity-20 rounded-borders"></div>
                                           <div class="z-top row items-center justify-between full-width">
                                                <span class="text-weight-bold text-green-9">4 / 4 Full</span>
                                                <div class="row items-center overlapping-avatars">
                                                    <q-avatar size="24px" class="shadow-1"><img src="https://cdn.quasar.dev/img/boy-avatar.png"/></q-avatar>
                                                </div>
                                           </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>
                </div>

                <!-- Right Column: Issues -->
                <div class="col-12 col-lg-4">
                    <q-card flat class="rounded-xl bg-white shadow-soft full-height">
                        <q-card-section class="q-pb-sm border-bottom-dashed">
                             <div class="row items-center justify-between">
                                <div class="text-h6 text-weight-bold text-grey-9">Issues & Requests</div>
                                <q-badge rounded color="grey-2" text-color="grey-8" :label="activeIssues.length" />
                            </div>
                        </q-card-section>

                        <q-card-section class="q-pa-sm">
                            <div class="column q-gutter-y-sm">
                                <q-card v-for="(issue, index) in activeIssues" :key="issue.id" flat class="rounded-xl q-pa-sm cursor-pointer hover-scale"
                                    :class="[
                                        issue.title.includes('Request') ? 'bg-blue-50 border-blue' : 'bg-orange-50 border-orange'
                                    ]"
                                    style="border-width: 1px; border-style: solid;"
                                >
                                    <div class="row justify-between items-start">
                                        <q-badge 
                                            rounded 
                                            :color="issue.title.includes('Request') ? 'blue-2' : 'orange-2'"
                                            :text-color="issue.title.includes('Request') ? 'blue-9' : 'orange-9'"
                                            class="q-py-xs q-px-sm text-weight-bold"
                                        >
                                            {{ issue.timeAgo }}
                                        </q-badge>
                                        <q-btn flat round dense color="grey-6" icon="more_vert" size="sm" />
                                    </div>

                                    <div class="text-subtitle1 text-weight-bold text-grey-10 q-mt-sm lh-1">{{ issue.title }}</div>
                                    <div class="text-caption text-grey-8 q-mt-xs" style="opacity: 0.8;">Need action at location.</div>

                                    <div class="row items-center justify-between q-mt-md">
                                        <div class="row items-center">
                                            <q-avatar size="28px" class="q-mr-sm">
                                                <img :src="issue.reporterAvatar" />
                                            </q-avatar>
                                            <div class="text-caption text-weight-medium text-grey-9">{{ issue.reporterName }}</div>
                                        </div>
                                        <q-btn round flat dense :color="issue.title.includes('Request') ? 'blue-8' : 'orange-8'" icon="chat_bubble_outline" size="sm" />
                                    </div>
                                </q-card>
                            </div>
                        </q-card-section>
                    </q-card>
                </div>
            </div>

        </div>

    </div>
    
    <!-- Loading State -->
    <div v-else class="flex flex-center window-height">
        <q-spinner-dots size="3em" color="primary" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { getEventById, getLiveDashboardData, TeamgleEvent } from '../../services/mock/eventController'

const route = useRoute()
const event = ref<TeamgleEvent | null>(null)

// --- Live Mode Data ---
interface LiveWorker {
    id: number;
    name: string;
    role: string;
    avatar: string;
    lateBy?: string;
    location?: string;
    shiftEnd?: string;
    checkOut?: string;
}

const activeIssues = ref<any[]>([])
const staffLate = ref<LiveWorker[]>([])
const staffActive = ref<LiveWorker[]>([])
const staffDone = ref<LiveWorker[]>([])

const resolveIssue = (id: number) => {
    activeIssues.value = activeIssues.value.filter(i => i.id !== id)
}

onMounted(async () => {
    const eventId = route.params.id as string
    if (eventId) {
        event.value = await getEventById(eventId)
        
        // Fetch real-time live data
        const liveData = await getLiveDashboardData(eventId)
        activeIssues.value = liveData.activeIssues
        staffLate.value = liveData.staffLate
        staffActive.value = liveData.staffActive
        staffDone.value = liveData.staffDone
    }
})
</script>

<style scoped lang="scss">
.bg-grey-50 { background-color: #F8FAFC; }
.bg-blue-50 { background-color: #EFF6FF; }
.bg-green-50 { background-color: #F0FDF4; }

.text-grey-9 { color: #1e293b; }
.text-grey-6 { color: #64748b; }

.shadow-soft {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

.shadow-sm {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.rounded-xl {
    border-radius: 16px;
}

.rounded-circle {
    border-radius: 50%;
}

.border-dashed-grey {
    border: 1px dashed #cbd5e1;
}

.hover-elevate {
    transition: all 0.2s ease;
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
    }
}

.hover-scale {
    transition: transform 0.2s;
    &:hover {
        transform: scale(1.02);
    }
}

.pulsing-dot {
    width: 8px;
    height: 8px;
    background-color: #ef4444;
    border-radius: 50%;
    animation: pulse-red 2s infinite;
}

@keyframes pulse-red {
    0% {
        box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
    }
    70% {
        box-shadow: 0 0 0 6px rgba(239, 68, 68, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
    }
}

.opacity-60 { opacity: 0.6; }
.grayscale { filter: grayscale(100%); }

.border-blue { border-color: #93c5fd !important; }
.border-orange { border-color: #fdba74 !important; }
.border-dashed-grey { border: 1px dashed #cbd5e1; }
.border-bottom-dashed { border-bottom: 1px dashed #e2e8f0; }

.border-right-dashed {
    border-right: 1px dashed #e2e8f0;
}

.opacity-20 {
    opacity: 0.2;
}

.overlapping-avatars {
    display: flex;
    flex-direction: row-reverse; /* Stack from right to left visually */
}

.overlapping-avatars > * {
    margin-left: -8px; /* Negative margin for overlap */
    border: 2px solid white; /* White border to separate avatars */
    transition: transform 0.2s;
}

.overlapping-avatars > *:hover {
    transform: translateY(-2px);
    z-index: 10;
}
</style>
