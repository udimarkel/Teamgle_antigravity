<template>
  <div class="test-container q-pa-md">
    <q-card class="my-card bg-primary text-white">
      <q-card-section>
        <div class="text-h6">Hello World</div>
        <div class="text-subtitle2">Vue 3 + Quasar</div>
      </q-card-section>

      <q-card-section>
        This is a simple test component.
      </q-card-section>

      <q-separator dark />

      <q-card-actions>
        <q-btn flat>Action</q-btn>
        <q-btn flat>Secondary</q-btn>
      </q-card-actions>
    </q-card>
    
    <div class="q-mt-md">
      <q-btn color="secondary" label="Test Secondary Color" />
    </div>
  </div>
</template>

<script setup lang="ts">
// Logic here
</script>

<style scoped>
.test-container {
  max-width: 400px;
  margin: 0 auto;
  padding-top: 50px;
}
</style>
