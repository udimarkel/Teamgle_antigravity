<template>
  <q-layout view="lHh Lpr fff">
    <q-page-container>
      <!-- Ensure dir depends on lang -->
      <q-page class="flex flex-center bg-grey-2" :dir="langStore.isRtl ? 'rtl' : 'ltr'">
        <q-card class="login-card q-pa-lg shadow-2 relative-position" bordered>
          
          <!-- Language Switcher in Top Right -->
          <div class="absolute-top-right q-pa-sm">
             <q-btn flat dense round icon="language" color="primary">
               <q-menu>
                 <q-list style="min-width: 100px">
                   <q-item clickable v-close-popup @click="langStore.setLanguage('EN')">
                     <q-item-section>{{ langStore.t('English') }}</q-item-section>
                   </q-item>
                   <q-item clickable v-close-popup @click="langStore.setLanguage('HE')">
                     <q-item-section>{{ langStore.t('Hebrew') }}</q-item-section>
                   </q-item>
                 </q-list>
               </q-menu>
             </q-btn>
          </div>

          <q-card-section class="text-center">
            <img src="/teamgle-logo.png" alt="Teamgle" style="height: 60px; margin-bottom: 20px;" />
            <div class="text-h5 text-weight-bold text-primary">{{ langStore.t('Login') }}</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit="handleLogin" class="q-gutter-md">
              <q-input
                filled
                v-model="company"
                :label="langStore.t('Company')"
                lazy-rules
                :rules="[ val => val && val.length > 0 || langStore.t('Please type your company name')]"
                :class="{'text-right': langStore.isRtl}"
                @update:model-value="errorMessage = ''"
              >
                <template v-slot:prepend>
                  <q-icon name="business" />
                </template>
              </q-input>

              <q-input
                filled
                v-model="username"
                :label="langStore.t('Username')"
                lazy-rules
                :rules="[ val => val && val.length > 0 || langStore.t('Please type your username')]"
                :class="{'text-right': langStore.isRtl}"
                @update:model-value="errorMessage = ''"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>

              <q-input
                filled
                type="password"
                v-model="password"
                :label="langStore.t('Password')"
                lazy-rules
                :rules="[ val => val && val.length > 0 || langStore.t('Please type your password')]"
                :class="{'text-right': langStore.isRtl}"
                @update:model-value="errorMessage = ''"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>

              <div class="row items-center" :class="langStore.isRtl ? 'justify-start' : 'justify-end'">
                <q-btn flat :label="langStore.t('Forgot Password?')" color="primary" class="no-padding text-capitalize" @click="forgotPassword" />
              </div>

              <div>
                <q-btn :label="langStore.t('Login')" type="submit" color="primary" class="full-width text-weight-bold" size="lg" unelevated />
              </div>

              <!-- Error Message at the bottom -->
              <div v-if="errorMessage" class="text-negative text-center q-mt-md text-weight-bold">
                {{ errorMessage }}
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useLanguageStore } from '../stores/language'

const router = useRouter()
const $q = useQuasar()
const langStore = useLanguageStore()

const company = ref('')
const username = ref('')
const password = ref('')
const errorMessage = ref('')

function handleLogin() {
  errorMessage.value = ''
  
  const comp = company.value.trim().toLowerCase()
  const user = username.value.trim().toLowerCase()
  const pass = password.value.trim()

  console.log('Login Attempt:', { comp, user, pass })

  // Detailed validation debugging
  if (comp !== 'teamgle') {
    errorMessage.value = langStore.t('Invalid Company') + ` (${comp})` 
    // Note: 'Invalid Company' might not be in store, will show key. Good for debug.
    return
  }

  if (user !== 'udi@teamgle.com' && user !== 'udi') {
    errorMessage.value = langStore.t('Invalid Email') + ` (${user})`
    return
  }

  if (pass !== '1234') {
    errorMessage.value = langStore.t('Invalid Password')
    return
  }

  // If we get here, everything is valid
  console.log('Credentials Valid, Redirecting...')
  $q.notify({
    color: 'positive',
    textColor: 'white',
    icon: 'check',
    message: langStore.t('Login successful'),
    position: 'top'
  })
    
  router.push({ name: 'home' })
}

function forgotPassword() {
  $q.notify({
    color: 'info',
    textColor: 'white',
    icon: 'info',
    message: langStore.t('Forgot password functionality not implemented yet'),
    position: 'top'
  })
}
</script>

<style scoped lang="scss">
.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
}

.text-primary {
  color: #283593 !important;
}

.bg-grey-2 {
  background-color: #f5f5f5 !important;
}
</style>
