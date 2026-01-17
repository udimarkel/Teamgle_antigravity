<template>
  <div class="bg-white q-pa-md" style="border-radius: 16px">
     <div class="column q-gutter-y-md">
        
       <!-- Header -->
       <div class="row justify-between items-center" v-if="title">
         <div>
            <div class="text-h5 text-weight-bold text-black">{{ title }}</div>
         </div>
         <div class="row q-gutter-x-sm" v-if="showActions">
              <q-btn outline color="grey-7" :label="langStore.t('Boost Requests')" no-caps />
              <q-btn outline color="grey-7" :label="langStore.t('Publish Staffing Request')" no-caps />
         </div>
       </div>

       <!-- Optional Filters Slot -->
       <slot name="filters"></slot>

        <!-- Staff Table -->
        <q-card flat class="table-card">
            <q-table
              flat
              :rows="rows"
              :columns="columns"
              row-key="id"
              :pagination="{ rowsPerPage: 10 }"
              hide-pagination
              :grid="$q.screen.xs"
            >
              <!-- GRID MODE (Mobile) -->
              <template v-slot:item="props">
                <div class="q-pa-xs col-12 grid-style-transition" :style="props.selected ? 'transform: scale(0.95);' : ''">
                  <q-card bordered flat class="q-mb-sm">
                    <q-card-section class="row items-center justify-between no-wrap q-pb-none">
                        <div class="row items-center">
                             <q-avatar size="40px" class="q-mr-sm">
                                <img :src="props.row.avatarUrl" />
                            </q-avatar>
                            <div>
                                <div class="text-weight-bold">{{ props.row.name }}</div>
                                <div class="text-caption text-grey-7">{{ props.row.role }} • {{ props.row.shiftCategory }}</div>
                            </div>
                        </div>
                        <!-- Time badge if applicant or status changed -->
                        <div v-if="props.row.status === 'Applicant' && props.row.appliedAt" class="text-caption text-weight-bold" :class="getTimeColor(props.row.appliedAt)">
                             {{ formatTimeSince(props.row.appliedAt) }}
                        </div>
                        <div v-else-if="['Standby', 'Approved'].includes(props.row.status) && props.row.statusChangedAt" class="text-caption text-weight-bold" :class="getTimeColor(props.row.statusChangedAt)">
                             {{ formatTimeSince(props.row.statusChangedAt) }}
                        </div>
                    </q-card-section>

                    <q-card-section class="q-pt-sm">
                         <!-- Ratings / Freq / Warnings -->
                         <div class="row items-center justify-between">
                            <div class="row items-center q-gutter-x-sm">
                                <q-badge :color="getFrequencyColor(props.row.workFrequency)" :text-color="getFrequencyTextColor(props.row.workFrequency)">
                                    {{ props.row.workFrequency }}
                                </q-badge>
                                <div class="row no-wrap">
                                    <q-icon v-for="n in 5" :key="n" name="star" color="amber" size="xs" />
                                </div>
                                <!-- Warnings -->
                                <q-icon v-if="props.row.hasWarning" name="error_outline" color="red" size="xs" />
                                <q-icon v-if="props.row.hasDoc" name="description" color="blue" size="xs" />
                            </div>
                            <div class="text-weight-bold text-grey-8">${{ props.row.hourlyRate }}/hr</div>
                         </div>
                    </q-card-section>

                    <q-separator />

                    <!-- Actions Footer -->
                    <q-card-actions align="right" class="q-pa-sm bg-grey-1">
                         <!-- 1. APPLICANT -->
                          <div v-if="props.row.status === 'Applicant'" class="row q-gutter-x-sm full-width justify-end">
                            <q-btn flat class="bg-white" dense icon="check" label="Approve" color="green" size="sm" @click="$emit('approve', props.row)" />
                            <q-btn flat class="bg-white" dense icon="close" label="Reject" color="red" size="sm" @click="$emit('reject', props.row)" />
                            <q-btn flat class="bg-white" dense icon="hourglass_empty" color="purple" size="sm" @click="$emit('hold', props.row)" />
                          </div>

                          <!-- 2. STANDBY -->
                          <div v-else-if="props.row.status === 'Standby'">
                              <span class="text-orange-8 text-weight-bold q-mr-sm">Standby</span>
                          </div>

                          <!-- 3. APPROVED -->
                          <div v-else-if="props.row.status === 'Approved'">
                              <span class="text-green-8 text-weight-bold q-mr-sm">Approved</span>
                          </div>

                          <!-- 4. REJECTED -->
                          <div v-else-if="props.row.status === 'Rejected'">
                              <q-btn outline dense icon="replay" label="Restore" color="grey-8" size="sm" @click="$emit('restore', props.row)" />
                          </div>
                    </q-card-actions>
                  </q-card>
                </div>
              </template>
              <!-- Worker Info Column -->
              <template v-slot:body-cell-worker_info="props">
                  <q-td :props="props">
                      <div class="row items-center">
                          <q-avatar size="32px" class="q-mr-sm">
                              <img :src="props.row.avatarUrl" />
                          </q-avatar>
                          <div class="text-weight-bold">{{ props.row.name }}</div>
                      </div>
                  </q-td>
              </template>

              <!-- Rating Column -->
              <template v-slot:body-cell-rating="props">
                  <q-td :props="props">
                      <div class="row no-wrap">
                          <q-icon v-for="n in 5" :key="n" name="star" color="amber" size="xs" />
                      </div>
                  </q-td>
              </template>

              <!-- Work Frequency Column -->
              <template v-slot:body-cell-workFrequency="props">
                  <q-td :props="props">
                      <q-badge 
                          :color="getFrequencyColor(props.row.workFrequency)" 
                          :text-color="getFrequencyTextColor(props.row.workFrequency)" 
                          class="q-px-sm"
                      >
                          {{ props.row.workFrequency }}
                      </q-badge>
                  </q-td>
              </template>

              <!-- Cost Column -->
              <template v-slot:body-cell-cost="props">
                  <q-td :props="props" class="text-weight-bold">
                      ${{ props.row.hourlyRate }}
                  </q-td>
              </template>

              <!-- Warnings Column -->
              <template v-slot:body-cell-warnings="props">
                  <q-td :props="props">
                      <div class="row q-gutter-x-sm justify-center">
                          <q-icon v-if="props.row.hasWarning" name="error_outline" color="red" size="sm" />
                          <q-icon v-if="props.row.hasDoc" name="description" color="blue" size="sm" />
                      </div>
                  </q-td>
              </template>

              <!-- Actions Column -->
              <!-- Actions Column -->
              <template v-slot:body-cell-actions="props">
                  <q-td :props="props" class="text-right">
                      <!-- 1. APPLICANT: Action Buttons Only -->
                      <div v-if="props.row.status === 'Applicant'" class="row items-center justify-end no-wrap">
                        <q-btn outline round dense icon="check" color="green" size="sm" class="q-mr-xs" @click="$emit('approve', props.row)">
                            <q-tooltip>Approve</q-tooltip>
                        </q-btn>
                        <q-btn outline round dense icon="close" color="red" size="sm" class="q-mr-xs" @click="$emit('reject', props.row)">
                            <q-tooltip>Reject</q-tooltip>
                        </q-btn>
                        <q-btn outline round dense icon="chat_bubble_outline" color="grey-7" size="sm" class="q-mr-xs">
                            <q-tooltip>Message</q-tooltip>
                        </q-btn>
                        <q-btn outline round dense icon="hourglass_empty" color="purple" size="sm" @click="$emit('hold', props.row)">
                            <q-tooltip>Hold</q-tooltip>
                        </q-btn>
                      </div>

                      <!-- 2. STANDBY: Text Status -->
                      <div v-else-if="props.row.status === 'Standby'" class="row items-center justify-end no-wrap">
                          <span class="text-orange-8 text-weight-bold">Waiting</span>
                      </div>

                      <!-- 3. APPROVED: Text Status (Waiting for confirmation) -->
                      <div v-else-if="props.row.status === 'Approved'" class="row items-center justify-end no-wrap">
                          <span class="text-orange-8 text-weight-bold">Waiting</span>
                      </div>

                      <!-- 4. REJECTED: Restore Button -->
                      <div v-else-if="props.row.status === 'Rejected'" class="row items-center justify-end no-wrap">
                          <q-btn outline round dense icon="replay" color="grey-8" size="sm" @click="$emit('restore', props.row)">
                              <q-tooltip>Restore to Applicants</q-tooltip>
                          </q-btn>
                      </div>
                  </q-td>
              </template>

              <!-- Time Column (Header with Icon) -->
              <template v-slot:header-cell-time_elapsed="props">
                  <q-th :props="props">
                      <q-icon name="schedule" size="sm" color="grey-7" />
                  </q-th>
              </template>

              <!-- Time Column (Body) -->
              <template v-slot:body-cell-time_elapsed="props">
                  <q-td :props="props" class="text-center">
                       <!-- Applicant: Time since appliedAt -->
                      <div v-if="props.row.status === 'Applicant' && props.row.appliedAt" class="text-weight-bold" :class="getTimeColor(props.row.appliedAt)">
                           {{ formatTimeSince(props.row.appliedAt) }}
                      </div>
                      
                      <!-- Standby / Approved: Time since statusChangedAt -->
                      <div v-else-if="['Standby', 'Approved'].includes(props.row.status) && props.row.statusChangedAt" class="text-weight-bold" :class="getTimeColor(props.row.statusChangedAt)">
                           {{ formatTimeSince(props.row.statusChangedAt) }}
                      </div>
                  </q-td>
              </template>

            </q-table>
        </q-card>
     </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue'
import { useLanguageStore } from '../../stores/language'

const langStore = useLanguageStore()

const props = defineProps({
    title: { type: String, default: '' },
    rows: { type: Array as PropType<any[]>, default: () => [] },
    showActions: { type: Boolean, default: false }
})

const emits = defineEmits(['approve', 'reject', 'hold', 'restore'])

const columns = computed(() => [
    { name: 'worker_info', label: langStore.t('WORKER INFO'), align: 'left', field: 'name', sortable: true },
    { name: 'role', label: langStore.t('APPLIED ROLE'), align: 'left', field: 'role', sortable: true },
    { name: 'shiftTime', label: langStore.t('APPLIED SHIFT'), align: 'left', field: 'shiftTime' },
    { name: 'rating', label: langStore.t('RATING'), align: 'left', field: 'id' }, // Hack for empty field mapping
    { name: 'workFrequency', label: langStore.t('WORK FREQUENCY'), align: 'left', field: 'workFrequency' },
    { name: 'cost', label: langStore.t('Cost (H)'), align: 'center', field: 'hourlyRate' },
    { name: 'warnings', label: langStore.t('WARNINGS'), align: 'center', field: 'id' },
    { name: 'actions', label: langStore.t('ACTIONS'), align: 'right' },
    { name: 'time_elapsed', label: langStore.t('TIME'), align: 'center', field: 'appliedAt' }
])

const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
        case 'High': return 'green-1'
        case 'Medium': return 'orange-1'
        case 'Low': return 'red-1'
        default: return 'grey-1'
    }
}

const getFrequencyTextColor = (frequency: string) => {
    switch (frequency) {
        case 'High': return 'green-8'
        case 'Medium': return 'orange-8'
        case 'Low': return 'red-8'
        default: return 'grey-8'
    }
}

// --- Time Since Logic ---
const formatTimeSince = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    
    if (diffHours < 24) {
        return `${diffHours}H`
    } else {
        const diffDays = Math.floor(diffHours / 24)
        return `${diffDays}D`
    }
}

const getTimeColor = (dateString: string) => {
     if (!dateString) return 'text-grey-8'
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

    if (diffHours > 72) return 'text-red' // > 3 Days
    if (diffHours > 24) return 'text-orange' // > 24 Hours
    return 'text-grey-8' // Default
}
</script>

<style scoped lang="scss">
.table-card {
    border: none;
}
</style>
