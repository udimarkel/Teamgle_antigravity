<template>
  <div class="column full-height">
    <!-- Secondary Top Nav -->
    <div class="event-nav-bar row items-center justify-between q-px-md bg-white border-bottom">
      <div class="row items-center q-gutter-x-md">
        <q-btn flat round icon="arrow_back" color="grey-8" @click="$router.push('/events')" />
        
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
            <q-route-tab :to="`/events/${eventId}/team`" name="team" label="Employee" />
            <q-route-tab :to="`/events/${eventId}/schedule`" name="schedule" label="Schedule/Gantt" />
            <q-route-tab :to="`/events/${eventId}/tasks`" name="tasks" label="Tasks" />
            <q-route-tab :to="`/events/${eventId}/briefing`" name="briefing" label="Briefing & Files" />
            <q-route-tab :to="`/events/${eventId}/finance`" name="finance" label="Finance" />
            <q-route-tab :to="`/events/${eventId}/settings`" name="settings" label="Settings" />
        </q-tabs>
      </div>

      <div class="row items-center q-gutter-x-sm">
         <q-btn outline color="grey-7" label="Send Update" no-caps />
         <q-btn outline color="grey-7" label="Edit" no-caps />
         <q-btn unelevated color="primary" label="Go Live" no-caps icon-right="videocam" />
      </div>
    </div>

    <!-- Child Page Content -->
    <div class="col relative-position">
        <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const tab = ref('dashboard')

// Extract eventId from route params
const eventId = computed(() => route.params.id)

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
