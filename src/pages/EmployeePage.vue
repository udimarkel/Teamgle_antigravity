<template>
  <q-page class="q-pa-md bg-grey-1 column">
    
    <!-- Header -->
    <div class="row items-center justify-between q-mb-md">
        <!-- Breadcrumb / Title if needed. For now empty to match clean look or add Button -->
        <div></div> <!-- Spacer -->
        <div class="row items-center q-gutter-x-sm">
            <q-btn unelevated color="primary" icon="add" :label="langStore.t('New Worker')" no-caps class="q-px-md" />
            <q-input dense outlined bg-color="white" v-model="search" :placeholder="langStore.t('Search')" class="search-input">
                <template v-slot:prepend>
                    <q-icon name="search" color="grey-5" />
                </template>
            </q-input>
            <q-btn outline color="grey-5" icon="filter_list" class="bg-white text-grey-8" />
        </div>
    </div>

    <!-- Confirmation Section -->
    <q-card flat class="bg-indigo-1 q-mb-lg rounded-borders-lg">
        <div class="q-pa-md row items-center justify-between">
            <div class="text-h6 text-grey-8 text-weight-regular">{{ langStore.t('New worker to confirm') }}</div>
            <q-btn flat round dense icon="close" color="grey-6" />
        </div>
        
        <div class="q-px-md q-pb-md row q-gutter-md no-wrap overflow-auto">
            <q-card v-for="worker in pendingEmployees" :key="worker.id" flat class="col-shrink bg-white rounded-borders-md pending-card row items-center q-pa-sm">
                <q-avatar size="48px">
                    <img :src="worker.avatar" />
                </q-avatar>
                
                <div class="column q-ml-md col">
                    <div class="text-subtitle2 text-weight-bold">{{ worker.name }}</div>
                    <div class="text-caption text-grey-6 ellipsis" style="max-width: 140px;">{{ worker.description }}</div>
                </div>

                <q-chip 
                    size="sm" 
                    :color="getRoleColor(worker.pendingRole)" 
                    text-color="dark"
                    class="role-chip"
                >
                >
                    {{ langStore.t(worker.pendingRole || '') }}
                </q-chip>
                
                <q-btn flat round dense icon="more_vert" color="grey-5" />
            </q-card>
        </div>
    </q-card>

    <!-- Main Content -->
    <div class="col column">
        <!-- Tabs & View Toggles -->
        <div class="row items-center justify-between q-mb-md">
            <div class="row items-center q-gutter-x-md">
                <q-btn unelevated rounded color="primary" no-caps :label="langStore.t('All workers')" class="q-px-lg" />
                <q-btn flat rounded color="grey-7" no-caps :label="langStore.t('Active')" class="q-px-lg" />
                <q-btn flat rounded color="grey-7" no-caps :label="langStore.t('Inactive')" class="q-px-lg" />
            </div>
            
            <div class="row items-center q-gutter-x-sm">
                <q-btn 
                    :flat="viewMode !== 'grid'" 
                    :unelevated="viewMode === 'grid'" 
                    round dense 
                    icon="grid_view" 
                    :color="viewMode === 'grid' ? 'primary' : 'grey-5'"
                    @click="viewMode = 'grid'" 
                />
                <q-btn 
                    :flat="viewMode !== 'list'" 
                    :unelevated="viewMode === 'list'" 
                    round dense 
                    icon="format_list_bulleted" 
                    :color="viewMode === 'list' ? 'primary' : 'grey-5'"
                     class="q-ml-sm" 
                     @click="viewMode = 'list'"
                />
            </div>
        </div>

        <!-- List View -->
        <q-table
            v-if="viewMode === 'list'"
            flat
            :rows="filteredEmployees"
            :columns="columns"
            row-key="id"
            class="employee-table col"
            :pagination="{ rowsPerPage: 7 }"
        >
            <!-- Name Column -->
            <template v-slot:body-cell-name="props">
                <q-td :props="props">
                    <div class="row items-center q-gutter-x-sm">
                        <q-avatar size="40px">
                            <img :src="props.row.avatar" />
                        </q-avatar>
                        <div class="column">
                            <span class="text-weight-bold">{{ props.row.name }}</span>
                            <span class="text-caption text-grey-6">{{ langStore.t(props.row.role) }}</span>
                        </div>
                    </div>
                </q-td>
            </template>

            <!-- Skills Column -->
            <template v-slot:body-cell-skills="props">
                <q-td :props="props">
                    <div class="row q-gutter-xs">
                        <q-chip 
                            v-for="skill in props.row.skills" 
                            :key="skill"
                            dense
                            :label="langStore.t(skill)"
                            :color="getSkillColor(skill)"
                            text-color="grey-9"
                            class="skill-chip q-px-sm"
                        />
                    </div>
                </q-td>
            </template>

            <!-- Rating Column -->
            <template v-slot:body-cell-rating="props">
                <q-td :props="props">
                    <q-rating 
                        v-model="props.row.rating" 
                        size="xs" 
                        :max="5" 
                        color="amber-4" 
                        readonly
                    />
                </q-td>
            </template>

            <!-- Actions Column -->
            <template v-slot:body-cell-actions="props">
                <q-td :props="props" class="text-right">
                    <q-btn flat round dense icon="more_vert" color="grey-5" />
                </q-td>
            </template>
        </q-table>

        <!-- Grid View -->
        <div v-else class="col scroll q-pa-xs">
            <div class="row q-col-gutter-md">
                <div v-for="worker in filteredEmployees" :key="worker.id" class="col-12 col-sm-6 col-md-4 col-lg-3">
                    <q-card flat class="items-start q-pa-md rounded-borders-md bordered-card">
                        <div class="row items-start justify-between q-mb-sm">
                             <div class="row items-center q-gutter-x-sm">
                                <q-avatar size="48px">
                                    <img :src="worker.avatar" />
                                </q-avatar>
                                <div>
                                    <div class="text-subtitle2 text-weight-bold">{{ worker.name }}</div>
                                    <div class="text-caption text-grey-6">{{ langStore.t(worker.role) }}</div>
                                </div>
                            </div>
                            <q-btn flat round dense icon="more_vert" color="grey-5" />
                        </div>
                        
                        <div class="q-mb-sm text-grey-7 text-caption">
                            <div class="row items-center q-mb-xs">
                                <q-icon name="email" size="xs" class="q-mr-xs" /> {{ worker.email }}
                            </div>
                            <div class="row items-center">
                                <q-icon name="phone" size="xs" class="q-mr-xs" /> {{ worker.phone }}
                            </div>
                        </div>

                        <div class="row q-gutter-xs q-mb-sm" style="min-height: 28px;">
                             <q-chip 
                                v-for="skill in worker.skills" 
                                :key="skill"
                                dense
                                :label="langStore.t(skill)"
                                :color="getSkillColor(skill)"
                                text-color="grey-9"
                                class="skill-chip q-px-sm"
                            />
                        </div>

                        <div class="row items-center justify-between">
                             <q-rating 
                                v-model="worker.rating" 
                                size="xs" 
                                :max="5" 
                                color="amber-4" 
                                readonly
                            />
                        </div>
                    </q-card>
                </div>
            </div>
        </div>
    </div>

  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getEmployees, getPendingEmployees, Employee } from '../services/mock/employeeController'
import { useLanguageStore } from '../stores/language'

const langStore = useLanguageStore()

const search = ref('')
const viewMode = ref<'list' | 'grid'>('list')
const employees = ref<Employee[]>([])
const pendingEmployees = ref<Employee[]>([])

const filteredEmployees = computed(() => {
    if (!search.value) return employees.value
    const term = search.value.toLowerCase()
    return employees.value.filter(e => 
        e.name.toLowerCase().includes(term) ||
        e.email.toLowerCase().includes(term) ||
        e.role.toLowerCase().includes(term)
    )
})

const columns = computed(() => [
    { name: 'name', label: langStore.t('Name'), align: 'left', field: 'name', sortable: true },
    { name: 'phone', label: langStore.t('Phone'), align: 'left', field: 'phone' },
    { name: 'email', label: langStore.t('Email'), align: 'left', field: 'email' },
    { name: 'skills', label: langStore.t('Skills Tags'), align: 'left', field: 'skills' },
    { name: 'rating', label: langStore.t('Rating'), align: 'left', field: 'rating', sortable: true },
    { name: 'actions', label: '', align: 'right' }
])

onMounted(async () => {
    employees.value = await getEmployees()
    pendingEmployees.value = await getPendingEmployees()
})

const getRoleColor = (role?: string) => {
    if (role === 'Waiter') return 'blue-1 text-blue-8'
    if (role === 'General') return 'blue-1 text-blue-8'
    if (role === 'Driver') return 'orange-1 text-orange-8'
    return 'grey-2'
}

const getSkillColor = (skill: string) => {
    if (skill === 'Driver') return 'orange-1'
    if (skill === 'Bartender') return 'red-1'
    if (skill === 'Security Guard') return 'grey-2' // Based on image
    if (skill === 'Close as Won') return 'green-1' // Based on "Anthony Davis" row
    return 'grey-2'
}

</script>

<style scoped lang="scss">
.rounded-borders-lg {
    border-radius: 12px;
}
.rounded-borders-md {
    border-radius: 8px;
}

.search-input {
    width: 300px;
}

.pending-card {
    min-width: 320px;
    border: 1px solid #f0f0f0;
}

.role-chip {
    font-weight: 500;
}

.skill-chip {
    font-size: 0.85rem; // Increased from default small
}

.bg-indigo-1 {
    background-color: #eef2ff !important; // Light purple match
}

.employee-table {
    /* Custom table styling to match clean UI */
    :deep(thead tr th) {
        font-weight: 600;
        color: #6b7280; // Grey-600
        font-size: 0.85rem;
    }
}

.bordered-card {
    border: 1px solid #e0e0e0;
}
</style>
