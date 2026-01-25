<template>
  <div class="bg-grey-1 min-h-screen">
    <!-- 1. Top Navigation Bar -->
    <div class="bg-white text-grey-8 q-px-lg row items-center justify-between border-bottom" style="height: 64px;">
        <div class="row items-center q-gutter-x-lg">
            <div class="column">
                <div class="text-h6 text-weight-bold text-grey-9 lh-1">Event Draft</div>
                <div class="text-caption text-grey-6">Create and manage your event details</div>
            </div>
            <q-separator vertical color="grey-3" class="q-my-sm" inset />
            <q-tabs v-model="tab" dense no-caps class="text-grey-6" active-color="primary" indicator-color="primary">
                <q-tab name="dashboard" label="Dashboard" />
                <q-tab name="employee" label="Employee" disable />
                <q-tab name="schedule" label="Schedule/Gantt" disable />
                <q-tab name="tasks" label="Tasks" disable />
                <q-tab name="briefing" label="Briefing & Files" disable />
                <q-tab name="finance" label="Finance" disable />
                <q-tab name="settings" label="Settings" disable />
            </q-tabs>
        </div>
        <div class="row items-center q-gutter-x-sm">
            <q-btn flat color="negative" icon="delete" label="Delete" no-caps @click="onDelete" />
            <q-btn outline color="grey-8" label="Save Draft" no-caps @click="onSaveDraft" />
            <q-btn unelevated color="primary" label="Create Event" no-caps @click="onCreateEvent" />
        </div>
    </div>

    <!-- Main Content -->
    <div class="q-pa-md q-mx-auto" style="max-width: 1200px;">
        
        <!-- 2. Basic Event Information -->
        <q-card flat class="bg-white q-mb-lg rounded-borders border-grey">
            <q-card-section class="q-pa-lg">
                <div class="text-h6 q-mb-md text-weight-bold text-grey-9">Event Details</div>
                <div class="row q-col-gutter-lg">
                    <div class="col-12 col-md-6">
                        <q-input outlined stack-label v-model="eventData.date" label="Date" type="date" bg-color="white">
                             <template v-slot:prepend><q-icon name="event" class="text-grey-6" /></template>
                        </q-input>
                    </div>
                    <div class="col-12 col-md-6 row q-col-gutter-sm">
                        <div class="col-6">
                            <q-input outlined stack-label v-model="eventData.startTime" label="Start Time" type="time" bg-color="white">
                                <template v-slot:prepend><q-icon name="schedule" class="text-grey-6" /></template>
                            </q-input>
                        </div>
                        <div class="col-6">
                            <q-input outlined stack-label v-model="eventData.endTime" label="End Time" type="time" bg-color="white" />
                        </div>
                    </div>

                    <div class="col-12 col-md-6">
                         <q-input outlined stack-label v-model="eventData.location" label="Location" placeholder="e.g. Grand Hall" bg-color="white">
                            <template v-slot:prepend><q-icon name="place" class="text-grey-6" /></template>
                         </q-input>
                    </div>
                     <div class="col-12 col-md-6">
                        <q-select outlined stack-label v-model="eventData.type" :options="['Conference', 'Wedding', 'Party', 'Corporate']" label="Event Type" bg-color="white">
                            <template v-slot:prepend><q-icon name="category" class="text-grey-6" /></template>
                        </q-select>
                    </div>

                    <div class="col-12 col-md-6">
                        <q-input outlined stack-label v-model="eventData.attendees" label="Attendees Count" type="number" bg-color="white">
                            <template v-slot:prepend><q-icon name="group" class="text-grey-6" /></template>
                        </q-input>
                    </div>
                     <div class="col-12 col-md-6">
                        <q-input outlined stack-label v-model="eventData.businessName" label="Client / Business Name" bg-color="white">
                             <template v-slot:prepend><q-icon name="business" class="text-grey-6" /></template>
                        </q-input>
                    </div>
                </div>
            </q-card-section>
        </q-card>

         <!-- 3. Event Requirements -->
         <!-- 3. Event Requirements -->
        <q-card flat class="bg-white q-mb-lg rounded-borders border-grey">
            <q-card-section class="q-pa-lg">
                 <div class="row items-center justify-between q-mb-md">
                    <div class="text-h6 text-weight-bold text-grey-9">Staff Requirements</div>
                    <q-toggle v-model="applyDateToAll" label="Apply event date to all shifts" color="primary" />
                 </div>
                 
                 <!-- Requirements Header -->
                 <div class="row q-col-gutter-sm text-caption text-uppercase text-grey-6 text-weight-bold q-mb-sm mobile-hide q-px-sm">
                    <div class="col-2">Role</div>
                    <div class="col-1">Qty</div>
                    <div class="col-2">Shift Type</div>
                    <div class="col-2">Time</div>
                    <div class="col-2">Skills</div>
                    <div class="col-1">Cost / Hr</div>
                    <div class="col-1 text-right">Total</div>
                    <div class="col-1"></div>
                 </div>

                 <!-- List -->
                 <div v-for="(req, index) in requirements" :key="index" class="requirement-row row q-col-gutter-sm q-mb-sm items-center q-py-sm rounded-borders hover-effect">
                    <div class="col-12 col-md-2">
                        <q-select outlined dense v-model="req.role" :options="roleOptions" label="Role" bg-color="white" options-dense />
                    </div>
                    <div class="col-6 col-md-1">
                        <q-input outlined dense v-model.number="req.count" type="number" min="1" bg-color="white" />
                    </div>
                     <div class="col-6 col-md-2">
                         <q-select outlined dense v-model="req.shiftType" :options="['Setup', 'Event', 'Teardown', 'Security', 'Overnight']" bg-color="white" options-dense />
                    </div>
                     <div class="col-12 col-md-2 row q-col-gutter-xs">
                        <div class="col-6">
                            <q-input outlined dense v-model="req.startTime" type="time" bg-color="white" />
                        </div>
                         <div class="col-6">
                            <q-input outlined dense v-model="req.endTime" type="time" bg-color="white" />
                        </div>
                    </div>
                     <div class="col-12 col-md-2">
                        <q-select outlined dense v-model="req.skills" use-input use-chips multiple input-debounce="0" @new-value="createSkill" :options="skillOptions" label="Select..." bg-color="white" options-dense class="no-wrap-chips">
                             <template v-slot:selected-item="scope">
                                <q-chip dense :tabindex="scope.tabindex" color="grey-2" text-color="grey-9" class="q-ma-none q-mr-xs">
                                    {{ scope.opt }}
                                </q-chip>
                            </template>
                        </q-select>
                    </div>
                    <div class="col-6 col-md-1">
                         <q-input outlined dense v-model.number="req.costPerWorker" type="number" prefix="$" bg-color="white" />
                    </div>
                    <div class="col-6 col-md-1">
                        <div class="text-subtitle2 text-weight-bold text-grey-9 text-right">${{ (req.count * req.costPerWorker) || 0 }}</div>
                    </div>
                    <div class="col-12 col-md-1 text-center">
                        <q-btn flat round color="grey-5" icon="delete_outline" size="sm" class="hover-red" @click="removeRequirement(index)" />
                    </div>
                 </div>

                 <q-btn outline color="primary" icon="add" label="Add Requirement" no-caps class="full-width q-mt-md border-dashed q-py-sm" @click="addRequirement" />

            </q-card-section>
        </q-card>

        <!-- 4. Mini Schedule Preview -->
         <!-- 4. Mini Schedule Preview -->
         <q-card flat class="bg-white q-mb-lg rounded-borders border-grey">
            <q-card-section class="q-pa-lg">
                 <div class="text-h6 q-mb-md text-weight-bold text-grey-9">Coverage Preview</div>
                 <div class="schedule-container relative-position rounded-borders bg-grey-1" style="height: 220px; overflow-x: auto; border: 1px solid #e0e0e0;">
                    <!-- Time Axis -->
                     <div class="row no-wrap full-height relative-position" style="min-width: 900px;">
                        <div v-for="hour in scheduleHours" :key="hour" class="col text-center border-right-dash relative-position">
                            <div class="text-caption text-grey-6 q-pt-sm text-weight-medium">{{ hour }}:00</div>
                        </div>
                        
                        <!-- Bars -->
                        <div v-for="(req, index) in requirements" :key="'bar-'+index" 
                             class="absolute rounded-borders row items-center q-px-sm text-white text-caption shadow-1 transition-generic"
                             :class="getRoleColor(req.role)"
                             :style="getBarStyle(req, index)"
                        >
                            <span class="text-weight-bold q-mr-xs">{{ req.role || 'New Role' }}</span> 
                            <span class="opacity-80">({{ req.count }})</span>
                        </div>
                     </div>
                 </div>
            </q-card-section>
        </q-card>

        <!-- 5. Briefing & Logistics -->
        <!-- 5. Briefing & Logistics -->
         <q-card flat class="bg-white q-mb-lg rounded-borders border-grey">
            <q-card-section class="q-pa-lg">
                 <div class="text-h6 q-mb-lg text-weight-bold text-grey-9">Briefing & Materials</div>
                 
                 <div class="row q-col-gutter-lg">
                     <div class="col-12 col-md-8">
                        <div class="q-mb-md">
                            <div class="text-subtitle2 q-mb-xs text-grey-8">Briefing Message <span class="text-caption text-grey-6">(Visible to workers)</span></div>
                            <q-input outlined v-model="briefingData.message" type="textarea" rows="4" placeholder="Important instructions, location details, etc..." bg-color="white" />
                        </div>
                         
                         <div>
                            <div class="text-subtitle2 q-mb-xs text-grey-8">Internal Notes <span class="text-caption text-grey-6">(Admins only)</span></div>
                            <q-input outlined v-model="briefingData.internalNotes" type="textarea" rows="2" bg-color="amber-1" placeholder="Private notes for the management team..." />
                         </div>
                     </div>
                     
                     <div class="col-12 col-md-4">
                        <div class="q-mb-md">
                            <div class="text-subtitle2 q-mb-xs text-grey-8">Files</div>
                            <q-file outlined v-model="briefingData.files" label="Upload PDF/Images" multiple use-chips bg-color="grey-1">
                                <template v-slot:prepend>
                                    <q-icon name="cloud_upload" class="text-grey-6" />
                                </template>
                            </q-file>
                        </div>
                        
                        <div class="bg-grey-1 q-pa-md rounded-borders">
                            <div class="text-subtitle2 q-mb-sm text-grey-8">Pre-event Checklist</div>
                            <div v-for="(item, i) in briefingData.checklist" :key="i" class="q-mb-xs">
                                <q-checkbox v-model="item.checked" :label="item.label" dense color="primary" />
                            </div>
                        </div>
                     </div>
                 </div>
            </q-card-section>
        </q-card>

        <!-- 6. Financial Summary -->
        <!-- 6. Financial Summary -->
         <q-card flat class="bg-white q-mb-xl rounded-borders border-grey">
            <q-card-section class="q-pa-lg">
                 <div class="text-h6 q-mb-lg text-weight-bold text-grey-9">Financial Summary</div>
                 
                 <div class="row q-col-gutter-lg">
                     <!-- Costs -->
                    <div class="col-12 col-md-3">
                        <q-card flat class="bg-red-1 q-pa-md full-height column justify-center rounded-borders">
                             <div class="text-caption text-red-9 text-uppercase text-weight-bold">Total Labor</div>
                             <div class="text-h4 text-red-9 text-weight-bold lh-1">${{ formatMoney(totalLaborCost) }}</div>
                             <div class="text-caption text-red-4 q-mt-xs">Based on current shifts</div>
                        </q-card>
                    </div>
                    <div class="col-12 col-md-3">
                         <q-input outlined stack-label v-model.number="financeData.additionalCosts" label="Additional Costs" prefix="$" type="number" bg-color="white" class="q-mb-md" />
                         <q-input outlined stack-label v-model.number="financeData.vatPercent" label="VAT Percentage" suffix="%" type="number" bg-color="white" />
                    </div>

                    <!-- Revenue -->
                     <div class="col-12 col-md-3">
                        <q-input outlined stack-label v-model.number="financeData.invoiceAmount" label="Total Invoice Value" prefix="$" type="number" bg-color="white" class="q-mb-md" />
                        <q-input outlined stack-label v-model.number="financeData.depositReceived" label="Deposit Received" prefix="$" type="number" bg-color="white" />
                    </div>
                    
                    <!-- Profit Card -->
                     <div class="col-12 col-md-3">
                        <q-card flat class="bg-blue-1 q-pa-md full-height column justify-center rounded-borders">
                            <div class="text-caption text-blue-9 text-uppercase text-weight-bold">Estimated Profit</div>
                            <div class="text-h4 text-blue-9 text-weight-bold lh-1">
                                ${{ formatMoney(estimatedProfit) }} 
                            </div>
                            <div class="text-subtitle2 text-blue-7 q-mt-xs">Margin: {{ profitMargin }}%</div>
                        </q-card>
                    </div>
                 </div>

                 <q-separator class="q-my-lg" />

                 <div class="row justify-end items-center">
                    <div class="text-right">
                        <div class="text-caption text-grey-6 text-uppercase text-weight-bold">Balance Due</div>
                        <div class="text-h4 text-orange-9 text-weight-bold">${{ formatMoney(balanceDue) }}</div>
                         <div class="text-caption text-grey-5">Including ${{ formatMoney(vatAmount) }} VAT</div>
                    </div>
                 </div>
            </q-card-section>
        </q-card>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()
const tab = ref('dashboard')

// --- Event Data ---
const eventData = reactive({
    date: new Date().toISOString().split('T')[0],
    startTime: '14:00',
    endTime: '23:00',
    location: '',
    type: 'Conference',
    attendees: 100,
    businessName: '',
    contactName: '',
    phone: '',
    dressCode: '',
    parking: ''
})

// --- Requirements Logic ---
interface Requirement {
    role: string;
    count: number;
    shiftType: string;
    startTime: string;
    endTime: string;
    skills: string[];
    costPerWorker: number;
}

const requirements = ref<Requirement[]>([
    { role: 'Driver', count: 10, shiftType: 'Event', startTime: '18:00', endTime: '23:00', skills: ['Forklift'], costPerWorker: 25 },
    { role: 'Server', count: 5, shiftType: 'Setup', startTime: '15:00', endTime: '18:00', skills: ['Food Handling'], costPerWorker: 20 },
    { role: 'Security', count: 3, shiftType: 'Overnight', startTime: '23:00', endTime: '02:00', skills: ['First Aid'], costPerWorker: 30 }
])

const applyDateToAll = ref(true)
const roleOptions = ['Driver', 'Server', 'Security', 'Bartender', 'Host', 'Cleaner', 'Sound Tech', 'Light Tech', 'Stagehand']
const skillOptions = ref(['Bartending', 'Serving', 'Security Clearance', 'First Aid', 'Crowd Control', 'Ticket Scanning', 'Sound Engineering', 'Lighting Tech'])

const createSkill = (val: string, done: (item: string) => void) => {
    if (val.length > 0) {
        if (!skillOptions.value.includes(val)) {
            skillOptions.value.push(val)
        }
        done(val)
    }
}

const addRequirement = () => {
    requirements.value.push({
        role: '',
        count: 1,
        shiftType: 'Event',
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        skills: [],
        costPerWorker: 0
    })
}

const removeRequirement = (index: number) => {
    requirements.value.splice(index, 1)
}

// --- Schedule Logic ---
const scheduleStartHour = 14
const scheduleHours = computed(() => {
    const hours = []
    for (let i = 0; i < 13; i++) {
        hours.push((scheduleStartHour + i) % 24)
    }
    return hours
})

const getRoleColor = (role: string) => {
    switch (role) {
        case 'Driver': return 'bg-orange-5'
        case 'Server': return 'bg-blue-6'
        case 'Security': return 'bg-green-6'
        case 'Bartender': return 'bg-purple-5'
        case 'Host': return 'bg-pink-5'
        default: return 'bg-grey-7'
    }
}

const getBarStyle = (req: Requirement, index: number) => {
    if (!req.startTime || !req.endTime) return { display: 'none' }
    
    // Parse times
    const startH = parseInt(req.startTime.split(':')[0])
    const startM = parseInt(req.startTime.split(':')[1])
    const endH = parseInt(req.endTime.split(':')[0])
    const endM = parseInt(req.endTime.split(':')[1])

    // Normalize to timeline relative to 14:00
    let relativeStart = startH + startM / 60 - scheduleStartHour;
    let relativeEnd = endH + endM / 60 - scheduleStartHour;

    // Handle next day crossing (e.g. 02:00 is 26h, so 26 - 14 = 12)
    if (relativeStart < 0) relativeStart += 24
    if (relativeEnd < relativeStart) relativeEnd += 24
    
    // Convert to percentage (13 hours total shown)
    const totalHours = 13
    const left = (relativeStart / totalHours) * 100
    const width = ((relativeEnd - relativeStart) / totalHours) * 100
    const top = 30 + (index * 40) // Simple vertical stacking

    return {
        left: `${left}%`,
        width: `${width}%`,
        top: `${top}px`,
        height: '30px'
    }
}

// --- Briefing Logic ---
const briefingData = reactive({
    message: '',
    files: [],
    internalNotes: '',
    checklist: [
        { label: 'Confirm venue availability', checked: true },
        { label: 'Finalize catering menu', checked: false },
        { label: 'Distribute worker schedules', checked: false },
        { label: 'Arrange equipment rental', checked: true }
    ]
})

// --- Finance Logic ---
const financeData = reactive({
    additionalCosts: 2500,
    invoiceAmount: 50000,
    depositReceived: 15000,
    vatPercent: 10
})

const totalLaborCost = computed(() => {
    return requirements.value.reduce((sum, req) => sum + (req.count * req.costPerWorker), 0)
})

const vatAmount = computed(() => {
    return financeData.invoiceAmount * (financeData.vatPercent / 100)
})

const balanceDue = computed(() => {
    const totalBill = financeData.invoiceAmount + vatAmount.value
    return totalBill - financeData.depositReceived
})

const estimatedProfit = computed(() => {
    const totalCost = totalLaborCost.value + financeData.additionalCosts
    return financeData.invoiceAmount - totalCost
})

const profitMargin = computed(() => {
    if (financeData.invoiceAmount === 0) return '0.0'
    return ((estimatedProfit.value / financeData.invoiceAmount) * 100).toFixed(1)
})

const formatMoney = (val: number) => {
    return val.toLocaleString('en-US')
}

const onDelete = () => {
    $q.dialog({
        title: 'Confirm',
        message: 'Are you sure you want to discard this draft? All data will be lost.',
        cancel: true,
        persistent: true
    }).onOk(() => {
        router.push('/events')
    })
}

const onSaveDraft = () => {
     $q.notify({
        type: 'positive',
        message: 'Draft saved successfully (simulated)'
      })
      // Logic to save draft
}

const onCreateEvent = () => {
    // Validation logic here
    $q.notify({
        type: 'positive',
        message: 'Event published successfully (simulated)'
    })
    router.push('/events')
}

</script>



<style scoped lang="scss">
.min-h-screen {
    min-height: 100vh;
}

.border-bottom {
    border-bottom: 1px solid #e0e0e0;
}

.border-dashed {
    border: 1px dashed #bdbdbd;
}

.border-right-dash {
    border-right: 1px dashed #eeeeee;
}

.border-grey {
    border: 1px solid #e0e0e0;
}

.lh-1 {
    line-height: 1;
}

.hover-effect {
    transition: background-color 0.2s;
    &:hover {
        background-color: #f5f5f5;
    }
}

.hover-red:hover {
    color: #d32f2f !important;
    background-color: #ffebee;
}

.opacity-80 {
    opacity: 0.8;
}

.transition-generic {
    transition: all 0.3s ease;
}

/* Custom Skill Select Styling */
:deep(.no-wrap-chips .q-field__control) {
    padding-right: 0px !important; /* Optimise space */
}

:deep(.no-wrap-chips .q-field__native) {
    flex-wrap: nowrap !important;
    overflow-x: auto;
    padding-bottom: 4px; /* Space for scroll */
    scrollbar-width: thin;
}

/* Hide scrollbar for cleaner look if preferred, or keep thin */
:deep(.no-wrap-chips .q-field__native::-webkit-scrollbar) {
    height: 4px;
}
:deep(.no-wrap-chips .q-field__native::-webkit-scrollbar-thumb) {
    background: #e0e0e0;
    border-radius: 2px;
}
</style>
