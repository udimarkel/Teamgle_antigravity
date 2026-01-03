<template>
  <q-layout view="hHh Lpr lFf">
    <!-- Top Header -->
    <q-header class="app-header">
      <q-toolbar class="header-toolbar">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="menu-btn"
        />
        <q-toolbar-title class="app-title">
           <q-icon name="sym_r_layers" size="32px" class="logo-icon" />
           Teamgle
        </q-toolbar-title>

        <q-space />

        <div class="header-actions">
           <q-btn flat round dense icon="sym_r_search" class="action-btn" />
           <q-btn flat round dense icon="sym_r_notifications" class="action-btn">
              <q-badge color="red" rounded floating>3</q-badge>
           </q-btn>
           <q-btn flat round dense>
              <q-avatar size="32px">
                <img src="https://cdn.quasar.dev/img/boy-avatar.png">
              </q-avatar>
           </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Desktop Drawer -->
    <q-drawer
      v-if="$q.screen.gt.sm"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="app-drawer"
    >
      <q-list class="drawer-list">
        <!-- Section: Planning -->
        <q-item-label header class="section-header">
          PLANNING & SCHEDULING
        </q-item-label>

        <q-item
          v-for="link in planningLinks"
          :key="link.label"
          clickable
          v-ripple
          :to="link.to"
          exact
          active-class="active-nav-item"
          class="nav-item"
        >
          <q-item-section avatar>
            <q-icon :name="link.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ link.label }}</q-item-label>
          </q-item-section>
        </q-item>

        <!-- Section: Live -->
        <q-item-label header class="section-header live-section">
          LIVE EVENT
        </q-item-label>

        <q-item
          clickable
          v-ripple
          to="/live"
          active-class="active-nav-item"
          class="nav-item"
        >
          <q-item-section avatar>
            <q-icon name="sym_r_play_circle" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Live Mode</q-item-label>
          </q-item-section>
        </q-item>

      </q-list>
    </q-drawer>

    <!-- Main Page Container -->
    <q-page-container class="page-container">
      <router-view />
    </q-page-container>

    <!-- Mobile Footer -->
    <q-footer bordered class="mobile-footer" v-if="$q.screen.lt.md">
      <q-tabs no-caps active-color="primary" indicator-color="transparent" class="text-grey-7" v-model="tab">
        <q-route-tab name="home" label="Home" icon="sym_r_dashboard" to="/" />
        <q-route-tab name="schedule" label="Schedule" icon="sym_r_calendar_today" to="/schedule" />
        <q-route-tab name="events" label="Events" icon="sym_r_event" to="/events" />
      </q-tabs>
    </q-footer>

  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const leftDrawerOpen = ref<boolean>(false)
const tab = ref<string>('home')

interface NavLink {
  label: string;
  icon: string;
  to: string | object;
}

const planningLinks: NavLink[] = [
  { label: 'Home', icon: 'sym_r_dashboard', to: { name: 'home' } },
  { label: 'Events', icon: 'sym_r_event', to: '/events' },
  { label: 'Calendar', icon: 'sym_r_calendar_today', to: '/schedule' },
  { label: 'Employee', icon: 'sym_r_group', to: '/employee' },
  { label: 'Finance', icon: 'sym_r_paid', to: '/finance' }
]

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style scoped lang="scss">
.app-header {
  background-color: white;
  color: #333;
  border-bottom: 1px solid #e0e0e0;

  .header-toolbar {
    min-height: 60px;
  }

  .menu-btn {
    color: #333;
  }

  .app-title {
    font-weight: bold;
    display: flex;
    align-items: center;
    color: #283593;

    .logo-icon {
      margin-right: 8px;
    }
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .action-btn {
       color: #616161;
    }
  }
}

.app-drawer {
   background: linear-gradient(to bottom, #f0f4ff, #ffffff);
}

.drawer-list {
  padding: 16px;
}

.section-header {
  color: #757575;
  font-weight: bold;
  text-transform: uppercase;
  padding-bottom: 8px;

  &.live-section {
    margin-top: 24px;
  }
}

.nav-item {
  border-radius: 8px;
  color: #424242;
  margin-bottom: 4px;

  &.active-nav-item {
    background-color: #e8eaf6;
    color: #283593;
    font-weight: 500;
  }
}

.page-container {
  background-color: #fafafa;
}

.mobile-footer {
  background-color: white;
  color: var(--q-primary);
}
</style>
