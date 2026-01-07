<template>
  <q-page class="event-team-page q-pa-md q-pa-md-lg">
    <div class="column q-gutter-y-lg">
      
      <!-- 1. SHIFT APPLICANTS (With Filters) -->
      <StaffTable 
        title="Shift Applicants" 
        :rows="filteredRows" 
        :show-actions="true"
        @approve="updateStatus($event, 'Approved')"
        @reject="updateStatus($event, 'Rejected')"
        @hold="updateStatus($event, 'Standby')"
      >
          <template v-slot:filters>
             <div class="row q-gutter-md items-center q-mb-md">
                <q-select dense outlined v-model="filters.role" :options="roleOptions" label="Role filter" style="min-width: 150px" clearable bg-color="white" />
                <q-select dense outlined v-model="filters.shift" :options="shiftOptions" label="Shift filter" style="min-width: 150px" clearable bg-color="white" />
                
                <q-input dense outlined debounce="300" v-model="filterSearch" placeholder="Search by worker name" bg-color="white">
                      <template v-slot:prepend>
                          <q-icon name="search" />
                      </template>
                </q-input>
            </div>
          </template>
      </StaffTable>

      <!-- 2. APPROVED WORKERS -->
      <StaffTable title="Approved Workers" :rows="approvedRows" />

      <!-- 3. STANDBY WORKERS -->
      <StaffTable title="Standby Workers" :rows="standbyRows" />

      <!-- 4. REJECTED WORKERS -->
      <StaffTable 
          title="Rejected Workers" 
          :rows="rejectedRows" 
          @restore="updateStatus($event, 'Applicant')"
      />

    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import StaffTable from '../../components/event/StaffTable.vue'

interface StaffMember {
    id: number;
    name: string;
    avatarUrl: string;
    role: string;
    status: 'Applicant' | 'Approved' | 'Standby' | 'Rejected';
    shiftTime: string;
    shiftCategory: string; // Added for filtering
    hourlyRate: number;
    workFrequency: string;
    hasWarning: boolean;
    hasWarning: boolean;
    hasDoc: boolean;
    appliedAt: string; // ISO string
    statusChangedAt?: string; // ISO string
}

const filterSearch = ref('')
const filters = ref({
    role: null as string | null,
    shift: null as string | null
})

const shiftOptions = ['Morning', 'Evening', 'Night']

const allRows = ref<StaffMember[]>([
    { id: 1, name: 'Alice Johnson', avatarUrl: 'https://cdn.quasar.dev/img/avatar1.jpg', role: 'Cashier', status: 'Applicant', shiftTime: '10:00 - 18:00', shiftCategory: 'Morning', hourlyRate: 50, workFrequency: 'High', hasWarning: true, hasDoc: true, appliedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() }, // 12H ago
    { id: 2, name: 'Bob Smith', avatarUrl: 'https://cdn.quasar.dev/img/avatar2.jpg', role: 'Bartender', status: 'Applicant', shiftTime: '17:30 - 23:30', shiftCategory: 'Evening', hourlyRate: 30, workFrequency: 'Medium', hasWarning: false, hasDoc: true, appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }, // 2D ago
    { id: 3, name: 'Charlie Brown', avatarUrl: 'https://cdn.quasar.dev/img/avatar3.jpg', role: 'Security', status: 'Approved', shiftTime: '18:00 - 00:00', shiftCategory: 'Evening', hourlyRate: 22, workFrequency: 'Low', hasWarning: true, hasDoc: false, appliedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), statusChangedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() }, // Approved 3H ago
    { id: 4, name: 'Diana Prince', avatarUrl: 'https://cdn.quasar.dev/img/avatar4.jpg', role: 'Manager', status: 'Approved', shiftTime: '16:00 - 00:00', shiftCategory: 'Evening', hourlyRate: 45, workFrequency: 'High', hasWarning: false, hasDoc: false, appliedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), statusChangedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() }, // Approved 30m ago
    { id: 5, name: 'Evan Wright', avatarUrl: 'https://cdn.quasar.dev/img/avatar5.jpg', role: 'Server', status: 'Standby', shiftTime: '18:00 - 23:00', shiftCategory: 'Evening', hourlyRate: 25, workFrequency: 'Low', hasWarning: false, hasDoc: true, appliedAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), statusChangedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() }, // Standby 1H ago
    { id: 6, name: 'Fiona Gallagher', avatarUrl: 'https://cdn.quasar.dev/img/avatar6.jpg', role: 'Chef', status: 'Rejected', shiftTime: '15:00 - 21:00', shiftCategory: 'Evening', hourlyRate: 40, workFrequency: 'High', hasWarning: true, hasDoc: true, appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() }, // 5D ago
])

// Compute unique roles from applicants only or all? Let's do all.
const roleOptions = computed(() => {
    const roles = new Set(allRows.value.map(row => row.role))
    return Array.from(roles).sort()
})

// --- Computed Lists based on Status ---

// 1. Applicants (Filtered)
const filteredRows = computed(() => {
    return allRows.value.filter(row => {
        if (row.status !== 'Applicant') return false
        
        // Filter by text search (name)
        if (filterSearch.value && !row.name.toLowerCase().includes(filterSearch.value.toLowerCase())) {
            return false
        }
        // Filter by Role
        if (filters.value.role && row.role !== filters.value.role) {
            return false
        }
        // Filter by Shift
        if (filters.value.shift && row.shiftCategory !== filters.value.shift) {
            return false
        }
        return true
    })
})

// 2. Approved
const approvedRows = computed(() => allRows.value.filter(row => row.status === 'Approved'))

// 3. Standby
const standbyRows = computed(() => allRows.value.filter(row => row.status === 'Standby'))

// 4. Rejected
const rejectedRows = computed(() => allRows.value.filter(row => row.status === 'Rejected'))

const updateStatus = (row: StaffMember, newStatus: 'Applicant' | 'Approved' | 'Rejected' | 'Standby') => {
    const index = allRows.value.findIndex(r => r.id === row.id)
    if (index !== -1) {
        allRows.value[index].status = newStatus
        // Keep appliedAt for Applicants, but set statusChangedAt for others to track "time since change"
        if (newStatus !== 'Applicant') {
             allRows.value[index].statusChangedAt = new Date().toISOString()
        }
    }
}

</script>

<style scoped lang="scss">
.event-team-page {
    background-color: #fafafa;
    min-height: 100%;
}
</style>
