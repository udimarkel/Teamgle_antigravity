<template>
  <q-page class="event-team-page q-pa-lg">
    <div class="column q-gutter-y-md">
      
      <!-- Header -->
      <div class="row justify-between items-center">
        <div>
           <div class="text-h5 text-weight-bold">Event Staff</div>
           <div class="text-subtitle2 text-grey-7">Manage assignments, roles, and shift status.</div>
        </div>
        <div class="row q-gutter-x-sm">
             <q-btn outline color="grey-7" label="Import" icon="upload" no-caps />
             <q-btn unelevated color="primary" label="Add Worker" icon="add" no-caps />
        </div>
      </div>

      <!-- Filters & StatsRow (Optional Summary) -->
      <div class="row q-col-gutter-md">
          <div class="col-12 col-md-3">
              <q-card flat class="stat-card bg-green-1">
                  <q-card-section class="row items-center justify-between q-py-sm">
                      <div>
                          <div class="text-caption text-green-9 text-weight-bold">CONFIRMED</div>
                          <div class="text-h6 text-green-9">28/30</div>
                      </div>
                      <q-icon name="check_circle" color="green-7" size="md" />
                  </q-card-section>
              </q-card>
          </div>
          <div class="col-12 col-md-3">
              <q-card flat class="stat-card bg-orange-1">
                  <q-card-section class="row items-center justify-between q-py-sm">
                      <div>
                          <div class="text-caption text-orange-9 text-weight-bold">PENDING</div>
                          <div class="text-h6 text-orange-9">2</div>
                      </div>
                      <q-icon name="hourglass_empty" color="orange-7" size="md" />
                  </q-card-section>
              </q-card>
          </div>
      </div>

      <!-- Staff Table -->
      <q-card flat class="table-card">
          <q-table
            flat
            :rows="rows"
            :columns="columns"
            row-key="id"
            :filter="filter"
            :pagination="{ rowsPerPage: 10 }"
          >
            <template v-slot:top-right>
                <q-input dense outlined debounce="300" v-model="filter" placeholder="Search staff...">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>
            </template>

            <!-- Name Column -->
            <template v-slot:body-cell-name="props">
                <q-td :props="props">
                    <div class="row items-center">
                        <q-avatar size="32px" class="q-mr-sm">
                            <img :src="props.row.avatarUrl" />
                        </q-avatar>
                        <div>
                            <div class="text-weight-bold">{{ props.row.name }}</div>
                            <div class="text-caption text-grey">{{ props.row.phone }}</div>
                        </div>
                    </div>
                </q-td>
            </template>

            <!-- Role Column -->
            <template v-slot:body-cell-role="props">
                <q-td :props="props">
                    <q-badge :color="getRoleColor(props.row.role)" class="q-px-sm q-py-xs">
                        {{ props.row.role }}
                    </q-badge>
                </q-td>
            </template>

            <!-- Status Column -->
            <template v-slot:body-cell-status="props">
                <q-td :props="props">
                    <div class="row items-center q-gutter-x-xs">
                        <q-icon :name="getStatusIcon(props.row.status)" :color="getStatusColor(props.row.status)" />
                        <span :class="'text-' + getStatusColor(props.row.status)">{{ props.row.status }}</span>
                    </div>
                </q-td>
            </template>

            <!-- Actions Column -->
            <template v-slot:body-cell-actions="props">
                <q-td :props="props" class="text-right">
                    <q-btn flat round dense icon="chat_bubble_outline" color="grey-7" size="sm" class="q-mr-xs">
                         <q-tooltip>Message</q-tooltip>
                    </q-btn>
                    <q-btn flat round dense icon="edit" color="grey-7" size="sm" class="q-mr-xs">
                        <q-tooltip>Edit Shift</q-tooltip>
                    </q-btn>
                    <q-btn flat round dense icon="more_vert" color="grey-7" size="sm" />
                </q-td>
            </template>

          </q-table>
      </q-card>

    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface StaffMember {
    id: number;
    name: string;
    avatarUrl: string;
    phone: string;
    role: string;
    status: 'Confirmed' | 'Pending' | 'Declined' | 'Checked In';
    shiftTime: string;
    hourlyRate: number;
}

const filter = ref('')

const rows = ref<StaffMember[]>([
    { id: 1, name: 'Alice Johnson', avatarUrl: 'https://cdn.quasar.dev/img/avatar1.jpg', phone: '+1 555-0101', role: 'Server', status: 'Checked In', shiftTime: '18:00 - 23:00', hourlyRate: 25 },
    { id: 2, name: 'Bob Smith', avatarUrl: 'https://cdn.quasar.dev/img/avatar2.jpg', phone: '+1 555-0102', role: 'Bartender', status: 'Confirmed', shiftTime: '17:30 - 23:30', hourlyRate: 30 },
    { id: 3, name: 'Charlie Brown', avatarUrl: 'https://cdn.quasar.dev/img/avatar3.jpg', phone: '+1 555-0103', role: 'Security', status: 'Pending', shiftTime: '18:00 - 00:00', hourlyRate: 22 },
    { id: 4, name: 'Diana Prince', avatarUrl: 'https://cdn.quasar.dev/img/avatar4.jpg', phone: '+1 555-0104', role: 'Manager', status: 'Confirmed', shiftTime: '16:00 - 00:00', hourlyRate: 45 },
    { id: 5, name: 'Evan Wright', avatarUrl: 'https://cdn.quasar.dev/img/avatar5.jpg', phone: '+1 555-0105', role: 'Server', status: 'Declined', shiftTime: '18:00 - 23:00', hourlyRate: 25 },
    { id: 6, name: 'Fiona Gallagher', avatarUrl: 'https://cdn.quasar.dev/img/avatar6.jpg', phone: '+1 555-0106', role: 'Chef', status: 'Checked In', shiftTime: '15:00 - 21:00', hourlyRate: 40 },
])

const columns = [
    { name: 'name', label: 'Worker', align: 'left', field: 'name', sortable: true },
    { name: 'role', label: 'Role', align: 'left', field: 'role', sortable: true },
    { name: 'status', label: 'Status', align: 'left', field: 'status', sortable: true },
    { name: 'shiftTime', label: 'Shift', align: 'left', field: 'shiftTime' },
    { name: 'hourlyRate', label: 'Rate ($/hr)', align: 'right', field: 'hourlyRate', sortable: true },
    { name: 'actions', label: '', align: 'right' }
]

const getRoleColor = (role: string) => {
    switch(role) {
        case 'Manager': return 'purple-7'
        case 'Security': return 'grey-9'
        case 'Server': return 'orange-8'
        case 'Bartender': return 'blue-8'
        case 'Chef': return 'red-8'
        default: return 'grey'
    }
}

const getStatusColor = (status: string) => {
    switch(status) {
        case 'Confirmed': return 'green'
        case 'Checked In': return 'blue'
        case 'Pending': return 'orange'
        case 'Declined': return 'red'
        default: return 'grey'
    }
}

const getStatusIcon = (status: string) => {
    switch(status) {
        case 'Confirmed': return 'check_circle'
        case 'Checked In': return 'where_to_vote' // or similar
        case 'Pending': return 'schedule'
        case 'Declined': return 'cancel'
        default: return 'help'
    }
}
</script>

<style scoped lang="scss">
.event-team-page {
    background-color: #fafafa;
    min-height: 100%;
}

.stat-card {
    border: 1px solid rgba(0,0,0,0.05);
    border-radius: 8px;
}

.table-card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
}
</style>
