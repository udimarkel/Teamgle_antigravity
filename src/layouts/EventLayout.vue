<template>
  <div class="column full-height">
    <!-- Secondary Top Nav -->
    <div class="event-nav-bar row no-wrap items-center justify-between q-px-md bg-white border-bottom">
      <div class="row items-center q-gutter-x-sm">
        <q-btn flat round icon="arrow_back" color="grey-8" @click="$router.push('/events')" />
        
        <!-- Event Title -->
        <!-- Event Title -->
        <div v-if="eventTitle" class="bg-grey-2 q-px-md q-py-xs rounded-borders text-subtitle2 text-weight-bold text-grey-8 ellipsis q-mr-md text-center" style="width: 200px;" :title="eventTitle">
            {{ eventTitle }}
        </div>
        
        <q-tabs 
            v-model="tab" 
            dense 
            no-caps 
            class="text-grey-7" 
            active-color="primary" 
            indicator-color="primary"
            align="left"
        >
            <q-route-tab :to="`/events/${eventId}/dashboard`" name="dashboard" label="Dashboard" />
            <q-route-tab :to="`/events/${eventId}/employee`" name="team" label="Employee" />
            <q-route-tab :to="`/events/${eventId}/schedule`" name="schedule" label="Schedule/Gantt" />
            <q-route-tab :to="`/events/${eventId}/tasks`" name="tasks" label="Tasks" />
            <q-route-tab :to="`/events/${eventId}/briefing`" name="briefing" label="Briefing & Files" />
            <q-route-tab :to="`/events/${eventId}/finance`" name="finance" label="Finance" />
            <q-route-tab :to="`/events/${eventId}/settings`" name="settings" label="Settings" />
        </q-tabs>
      </div>

      <div class="row items-center q-gutter-x-sm">
         <q-btn outline color="grey-7" label="Edit" no-caps />
      </div>
    </div>

    <!-- Child Page Content -->
    <div class="col relative-position">
        <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getEventById } from '../services/mock/eventController'

const route = useRoute()
const tab = ref('dashboard')
const eventTitle = ref('')

// Extract eventId from route params
const eventId = computed(() => route.params.id as string)

const fetchEvent = async () => {
    if (eventId.value) {
        const event = await getEventById(eventId.value)
        if (event) {
            eventTitle.value = event.title
        }
    }
}

onMounted(fetchEvent)
watch(eventId, fetchEvent)

</script>

<style scoped lang="scss">
.event-nav-bar {
    height: 56px;
    border-bottom: 1px solid #e0e0e0;
}

.border-bottom {
    border-bottom: 1px solid #e0e0e0;
}
</style>
