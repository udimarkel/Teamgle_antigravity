<template>
  <q-page class="bg-grey-50 q-pb-xl">
    
    <div v-if="summary && event">
        <!-- 1. Header & Actions -->
        <div class="bg-white q-px-lg q-py-md sticky-top border-bottom z-top row items-center justify-between shadow-sm">
            <div class="row items-center q-gutter-x-md">
                <q-btn flat round icon="arrow_back" color="grey-7" @click="$router.push('/events')" />
                <div>
                    <div class="row items-center q-gutter-x-sm">
                        <div class="text-h6 text-weight-bold text-grey-9 lh-1">{{ event.title }}</div>
                        <q-badge rounded color="green-1" text-color="green-8" label="Closed & Finalized" class="q-px-sm text-weight-bold" />
                    </div>
                     <div class="text-caption text-grey-6 q-mt-xs">Post-Event Summary Report</div>
                </div>
            </div>

            <div class="row items-center q-gutter-x-sm">
                <q-btn outline no-caps color="grey-8" icon="file_download" label="Download PDF" />
                <q-btn outline no-caps color="grey-8" icon="email" label="Email Report" />
                <q-btn unelevated no-caps color="primary" label="View Full Timesheet" icon-right="chevron_right" />
            </div>
        </div>

        <div class="q-pa-lg mx-auto" style="max-width: 1400px;">
            
            <div class="row q-col-gutter-lg">
                <!-- 2. Financial Performance (The Finance Card) -->
                <div class="col-12 col-md-6">
                    <q-card flat class="rounded-xl bg-white shadow-soft full-height column">
                        <q-card-section class="q-pb-sm">
                             <div class="row items-center q-gutter-x-sm">
                                <q-icon name="payments" color="blue-6" size="sm" class="bg-blue-1 rounded-circle q-pa-xs" />
                                <div class="text-h6 text-weight-bold text-grey-9">Financial Performance</div>
                             </div>
                        </q-card-section>
                        
                        <q-card-section class="row q-col-gutter-md">
                             <!-- Revenue -->
                             <div class="col-4">
                                 <div class="text-caption text-grey-6 text-weight-bold text-uppercase">Revenue</div>
                                 <div class="text-h4 text-blue-9 text-weight-bolder q-my-xs">${{ formatMoney(summary.finance.revenue) }}</div>
                                 <div class="text-caption text-green-6 text-weight-bold">
                                     <q-icon name="arrow_upward" /> {{ calcPercentage(summary.finance.revenue, summary.finance.revenueTarget) }}% of Target
                                 </div>
                             </div>
                             
                             <!-- Labor Cost -->
                             <div class="col-4">
                                 <div class="text-caption text-grey-6 text-weight-bold text-uppercase">Labor Cost</div>
                                 <div class="text-h4 text-weight-bolder q-my-xs" :class="summary.finance.laborCost > summary.finance.laborCostEstimated ? 'text-orange-9' : 'text-grey-9'">
                                     ${{ formatMoney(summary.finance.laborCost) }}
                                 </div>
                                 <div class="text-caption text-weight-bold" :class="summary.finance.laborCost > summary.finance.laborCostEstimated ? 'text-orange-8' : 'text-green-6'">
                                     {{ summary.finance.laborCost > summary.finance.laborCostEstimated ? '+' : '-' }}${{ formatMoney(Math.abs(summary.finance.laborCost - summary.finance.laborCostEstimated)) }} vs Plan
                                 </div>
                             </div>

                             <!-- Net Profit -->
                             <div class="col-4">
                                 <div class="text-caption text-grey-6 text-weight-bold text-uppercase">Net Profit</div>
                                 <div class="text-h4 text-green-9 text-weight-bolder q-my-xs">${{ formatMoney(summary.finance.netProfit) }}</div>
                                 <div class="text-caption text-green-7 text-weight-bold bg-green-1 q-px-sm rounded-borders inline-block">
                                     {{ summary.finance.margin }}% Margin
                                 </div>
                             </div>
                        </q-card-section>

                        <q-card-section class="q-pt-none col relative-position">
                             <div class="text-caption text-grey-6 q-mb-sm">Labor Cost vs Plan</div>
                             <!-- Simple Bar Chart -->
                             <div class="row items-end q-gutter-x-md full-height" style="min-height: 120px;">
                                 <!-- Planned -->
                                 <div class="col column justify-end full-height">
                                     <div class="text-center text-caption text-grey-6 q-mb-xs">${{ formatMoney(summary.finance.laborCostEstimated) }}</div>
                                     <div class="bg-blue-2 rounded-borders text-center relative-position" style="height: 80%;">
                                         <div class="absolute-bottom text-caption text-blue-9 q-mb-sm text-weight-bold full-width">Planned</div>
                                     </div>
                                 </div>
                                 <!-- Actual -->
                                 <div class="col column justify-end full-height">
                                     <div class="text-center text-caption text-grey-6 q-mb-xs">${{ formatMoney(summary.finance.laborCost) }}</div>
                                     <div class="rounded-borders text-center relative-position" 
                                        :class="summary.finance.laborCost > summary.finance.laborCostEstimated ? 'bg-orange-4' : 'bg-green-4'"
                                        style="height: 100%;"
                                     >
                                        <div class="absolute-bottom text-caption text-white q-mb-sm text-weight-bold full-width">Actual</div>
                                     </div>
                                 </div>
                             </div>
                        </q-card-section>
                    </q-card>
                </div>

                <!-- 3. Workforce & KPIs -->
                <div class="col-12 col-md-6">
                    <div class="row q-col-gutter-lg full-height">
                         <div class="col-12 col-sm-6">
                             <q-card flat class="rounded-xl bg-white shadow-soft full-height column">
                                 <q-card-section>
                                     <div class="row items-center q-gutter-x-sm q-mb-sm">
                                        <q-icon name="groups" color="purple-6" size="sm" class="bg-purple-1 rounded-circle q-pa-xs" />
                                        <div class="text-h6 text-weight-bold text-grey-9">Workforce</div>
                                     </div>
                                     
                                     <!-- Role Composition Doughnut Mockup -->
                                     <div class="relative-position q-mb-md mx-auto" style="width: 140px; height: 140px;">
                                          <q-circular-progress :value="100" size="140px" :thickness="0.25" color="orange-5" track-color="transparent" class="absolute-full" style="transform: rotate(0deg)"/>
                                          <q-circular-progress :value="75" size="140px" :thickness="0.25" color="blue-5" track-color="transparent" class="absolute-full" style="transform: rotate(90deg)"/>
                                          <q-circular-progress :value="45" size="140px" :thickness="0.25" color="green-5" track-color="transparent" class="absolute-full" style="transform: rotate(180deg)"/>
                                          <div class="absolute-center column items-center">
                                              <div class="text-h5 text-weight-bold text-grey-9">39</div>
                                              <div class="text-caption text-grey-6 text-no-wrap">Staff</div>
                                          </div>
                                     </div>

                                     <div class="row justify-center q-gutter-x-md q-mt-md">
                                         <div class="row items-center"><div class="rounded-circle bg-orange-5 q-mr-xs" style="width: 8px; height: 8px;"></div><span class="text-caption text-grey-7">Security</span></div>
                                         <div class="row items-center"><div class="rounded-circle bg-blue-5 q-mr-xs" style="width: 8px; height: 8px;"></div><span class="text-caption text-grey-7">Bar</span></div>
                                         <div class="row items-center"><div class="rounded-circle bg-green-5 q-mr-xs" style="width: 8px; height: 8px;"></div><span class="text-caption text-grey-7">General</span></div>
                                     </div>
                                 </q-card-section>
                             </q-card>
                         </div>
                         <div class="col-12 col-sm-6">
                             <div class="column q-gutter-y-md full-height">
                                 <!-- KPI 1 -->
                                 <q-card flat class="col bg-white rounded-xl shadow-soft q-pa-md row items-center justify-between">
                                     <div>
                                         <div class="text-caption text-grey-6 text-weight-bold">Attendance Accuracy</div>
                                         <div class="text-h4 text-green-7 text-weight-bold">{{ summary.kpis.attendanceAccuracy }}%</div>
                                     </div>
                                     <q-circular-progress show-value :value="summary.kpis.attendanceAccuracy" size="50px" color="green-5" track-color="green-1" class="text-green-8 text-weight-bold">
                                         <q-icon name="check" />
                                     </q-circular-progress>
                                 </q-card>
                                 
                                 <!-- KPI 2 -->
                                 <q-card flat class="col bg-white rounded-xl shadow-soft q-pa-md row items-center justify-between">
                                     <div>
                                         <div class="text-caption text-grey-6 text-weight-bold">Standby Utilized</div>
                                         <div class="text-h4 text-orange-7 text-weight-bold">{{ summary.kpis.standbyUtilization }}%</div>
                                     </div>
                                     <q-icon name="group_add" size="lg" color="orange-4" class="bg-orange-1 rounded-circle q-pa-sm" />
                                 </q-card>

                                 <!-- KPI 3 -->
                                 <q-card flat class="col bg-white rounded-xl shadow-soft q-pa-md row items-center justify-between">
                                     <div>
                                         <div class="text-caption text-grey-6 text-weight-bold">Avg Check-in Time</div>
                                         <div class="text-h4 text-blue-7 text-weight-bold">{{ summary.kpis.checkInEfficiency }}</div>
                                     </div>
                                     <q-icon name="timer" size="lg" color="blue-4" class="bg-blue-1 rounded-circle q-pa-sm" />
                                 </q-card>
                             </div>
                         </div>
                    </div>
                </div>

                <!-- 5. Qualitative & AI (Now First/Right in RTL) -->
                <div class="col-12 col-md-6">
                     <div class="column q-gutter-y-lg">
                         <!-- Manager Debrief -->
                         <q-card flat class="rounded-xl bg-white shadow-soft q-pa-md">
                             <div class="text-subtitle1 text-weight-bold text-grey-9 q-mb-sm">Manager's Debrief</div>
                             <div class="bg-grey-1 rounded-borders q-pa-md text-grey-8 text-body2" style="font-style: italic;">
                                 "{{ summary.qualitative.managerDebrief }}"
                             </div>
                         </q-card>

                         <!-- AI Recommendations -->
                         <q-card flat class="rounded-xl bg-gradient-purple text-white shadow-soft q-pa-md">
                             <div class="row items-center q-mb-md">
                                 <q-icon name="auto_awesome" class="q-mr-sm" size="sm" />
                                 <div class="text-subtitle1 text-weight-bold">AI Suggestions for Next Event</div>
                             </div>
                             
                             <div class="row q-col-gutter-sm">
                                 <div v-for="(rec, i) in summary.qualitative.aiRecommendations" :key="i" class="col-12 col-md-6">
                                     <div class="bg-white-opacity rounded-borders q-pa-sm row items-start full-height">
                                        <q-icon :name="rec.icon" class="q-mt-xs q-mr-sm" size="xs" />
                                        <div>
                                            <div class="text-weight-bold text-caption">{{ rec.title }}</div>
                                            <div class="text-caption opacity-80 lh-1">{{ rec.desc }}</div>
                                        </div>
                                     </div>
                                 </div>
                             </div>
                         </q-card>

                         <!-- Staff Sentiment -->
                         <q-card flat class="rounded-xl bg-white shadow-soft q-pa-md">
                             <div class="row items-center justify-between q-mb-sm">
                                 <div class="text-subtitle1 text-weight-bold text-grey-9">Staff Sentiment</div>
                                 <div class="row items-center bg-yellow-1 text-yellow-9 q-px-sm rounded-borders">
                                     <span class="text-h6 text-weight-bold q-mr-xs">{{ summary.qualitative.sentimentScore }}</span>
                                     <q-icon name="star" size="sm" />
                                 </div>
                             </div>
                             <div class="text-caption text-grey-6">Based on post-shift feedback surveys.</div>
                         </q-card>
                     </div>
                </div>

                <!-- 4. Incident Log (Now Second/Left in RTL) -->
                <div class="col-12 col-md-6">
                    <q-card flat class="rounded-xl bg-white shadow-soft full-height">
                        <q-card-section>
                            <div class="row items-center q-gutter-x-sm q-mb-md">
                                <q-icon name="warning" color="red-6" size="sm" class="bg-red-1 rounded-circle q-pa-xs" />
                                <div class="text-h6 text-weight-bold text-grey-9">Incident Log</div>
                             </div>
                             
                             <q-markup-table flat class="no-border">
                                 <thead class="bg-grey-1 text-grey-7">
                                     <tr>
                                         <th class="text-left text-uppercase text-caption font-bold">Type</th>
                                         <th class="text-left text-uppercase text-caption font-bold">Reporter</th>
                                         <th class="text-left text-uppercase text-caption font-bold">Resolve Time</th>
                                         <th class="text-left text-uppercase text-caption font-bold">Outcome</th>
                                     </tr>
                                 </thead>
                                 <tbody>
                                     <tr v-for="(incident, i) in summary.incidents" :key="i">
                                         <td class="text-weight-bold text-grey-9">{{ incident.type }}</td>
                                         <td class="text-grey-7">{{ incident.reporter }}</td>
                                         <td>
                                             <q-badge :color="incident.isLongResolve ? 'orange-2' : 'green-1'" :text-color="incident.isLongResolve ? 'orange-9' : 'green-8'" :label="incident.timeToResolve" class="text-weight-bold" />
                                         </td>
                                         <td class="text-grey-8">{{ incident.outcome }}</td>
                                     </tr>
                                 </tbody>
                             </q-markup-table>
                        </q-card-section>
                    </q-card>
                </div>

            </div>
        </div>

    </div>
    
    <div v-else class="flex flex-center window-height">
        <q-spinner-dots size="3em" color="primary" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getEventById, getEventSummary, TeamgleEvent, EventSummaryData } from '../../services/mock/eventController'

const route = useRoute()
const event = ref<TeamgleEvent | undefined>(undefined)
const summary = ref<EventSummaryData | null>(null)

const formatMoney = (val: number) => {
    return val.toLocaleString('en-US')
}

const calcPercentage = (val: number, target: number) => {
    return Math.round((val / target) * 100)
}

onMounted(async () => {
    const eventId = route.params.id as string
    if (eventId) {
        event.value = await getEventById(eventId)
        summary.value = await getEventSummary(eventId)
    }
})
</script>

<style scoped lang="scss">
.bg-grey-50 {
    background-color: #F8FAFC;
}

.shadow-soft {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

.rounded-xl {
    border-radius: 16px;
}

.rounded-circle {
    border-radius: 50%;
}

.rounded-borders {
    border-radius: 8px;
}

.lh-1 {
    line-height: 1.2;
}

.bg-white-opacity {
    background-color: rgba(255, 255, 255, 0.2);
}

.bg-gradient-purple {
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
}

.opacity-80 {
    opacity: 0.8;
}

.mx-auto {
    margin-left: auto;
    margin-right: auto;
}

.sticky-top {
    position: sticky;
    top: 0;
    width: 100%;
    z-index: 1000;
}

.z-top { z-index: 1000; }
.border-bottom { border-bottom: 1px solid #e0e0e0; }

/* Utility colors needed if not in global css */
.bg-blue-1 { background-color: #EFF6FF; }
.text-blue-9 { color: #1E3A8A; }
.text-blue-6 { color: #2563EB; }

.bg-green-1 { background-color: #F0FDF4; }
.text-green-9 { color: #14532D; }
.text-green-6 { color: #16A34A; }

.bg-orange-1 { background-color: #FFF7ED; }
.text-orange-9 { color: #7C2D12; }
.text-orange-4 { color: #FB923C; }

.bg-red-1 { background-color: #FEF2F2; }
.text-red-6 { color: #DC2626; }

.bg-purple-1 { background-color: #FAF5FF; }
.text-purple-6 { color: #9333EA; }

.bg-yellow-1 { background-color: #FEF9C3; }
.text-yellow-9 { color: #713F12; }
</style>
