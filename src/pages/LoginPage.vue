<template>
  <q-layout view="lHh Lpr fff">
    <q-page-container>
      <!-- Ensure dir depends on lang -->
      <q-page
        class="flex flex-center bg-grey-2"
        :dir="langStore.isRtl ? 'rtl' : 'ltr'"
      >
        <q-card class="login-card q-pa-lg shadow-2 relative-position" bordered>
          <!-- Language Switcher in Top Right -->
          <div class="absolute-top-right q-pa-sm">
            <q-btn flat dense round icon="language" color="primary">
              <q-menu>
                <q-list style="min-width: 100px">
                  <q-item
                    clickable
                    v-close-popup
                    @click="langStore.setLanguage('EN')"
                  >
                    <q-item-section>{{
                      langStore.t("English")
                    }}</q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    v-close-popup
                    @click="langStore.setLanguage('HE')"
                  >
                    <q-item-section>{{ langStore.t("Hebrew") }}</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>

          <q-card-section class="text-center">
            <img
              src="/teamgle-logo.png"
              alt="Teamgle"
              style="height: 60px; margin-bottom: 20px"
            />
            <div class="text-h5 text-weight-bold text-primary">
              {{ langStore.t("Login") }}
            </div>
          </q-card-section>

          <q-card-section>
            <q-form @submit="handleLogin" class="q-gutter-md">
              <q-input
                filled
                v-model="email"
                :label="langStore.t('Email')"
                type="email"
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length > 0) ||
                    langStore.t('Please type your email'),
                ]"
                :class="{ 'text-right': langStore.isRtl }"
                @update:model-value="errorMessage = ''"
              >
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>

              <q-input
                filled
                type="password"
                v-model="password"
                :label="langStore.t('Password')"
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length > 0) ||
                    langStore.t('Please type your password'),
                ]"
                :class="{ 'text-right': langStore.isRtl }"
                @update:model-value="errorMessage = ''"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>

              <div
                class="row items-center"
                :class="langStore.isRtl ? 'justify-start' : 'justify-end'"
              >
                <q-btn
                  flat
                  :label="langStore.t('Forgot Password?')"
                  color="primary"
                  class="no-padding text-capitalize"
                  @click="forgotPassword"
                />
              </div>

              <div>
                <q-btn
                  :label="langStore.t('Login')"
                  type="submit"
                  color="primary"
                  class="full-width text-weight-bold"
                  size="lg"
                  unelevated
                  :loading="authStore.loading"
                  :disable="authStore.loading"
                />
              </div>

              <!-- Error Message at the bottom -->
              <div
                v-if="errorMessage"
                class="text-negative text-center q-mt-md text-weight-bold"
              >
                {{ errorMessage }}
              </div>

              <!-- Token Display (for debugging) -->
              <div v-if="showTokenDebug && authStore.token" class="q-mt-md">
                <q-separator class="q-mb-md" />
                <div class="text-caption text-grey-7 q-mb-sm">
                  Firebase Token (Debug):
                </div>
                <q-input
                  v-model="authStore.token"
                  type="textarea"
                  filled
                  readonly
                  rows="3"
                  class="text-caption"
                >
                  <template v-slot:append>
                    <q-btn
                      flat
                      dense
                      icon="content_copy"
                      @click="copyToken"
                      color="primary"
                    >
                      <q-tooltip>Copy Token</q-tooltip>
                    </q-btn>
                  </template>
                </q-input>

                <div class="q-mt-sm">
                  <q-btn
                    label="Test Token with API"
                    color="secondary"
                    outline
                    size="sm"
                    class="full-width"
                    @click="testToken"
                  />
                </div>

                <div
                  v-if="apiResponse"
                  class="q-mt-md q-pa-md bg-grey-3 rounded-borders"
                >
                  <div class="text-caption text-weight-bold q-mb-xs">
                    API Response:
                  </div>
                  <pre class="text-caption">{{ apiResponse }}</pre>
                </div>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useLanguageStore } from "../stores/language";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const $q = useQuasar();
const langStore = useLanguageStore();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const showTokenDebug = ref(true); // Set to false to hide debug info
const apiResponse = ref<any>(null);

// API Configuration
const API_BASE_URL = "https://localhost:7219";

async function handleLogin() {
  errorMessage.value = "";
  apiResponse.value = null;

  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();

  console.log("🔐 Login Attempt:", { email: emailValue });

  // Step 1: Login with Firebase
  const result = await authStore.login(emailValue, passwordValue);

  if (!result.success) {
    console.error("❌ שגיאת התחברות ל-Firebase:", result.error);
    errorMessage.value = getErrorMessage(result.error || "");
    return;
  }

  console.log("✅ התחברות מוצלחת ל-Firebase!");

  // Step 2: Test token with backend server
  console.log("🚀 בודק טוקן מול השרת...");
  $q.loading.show({ message: "מאמת טוקן בשרת..." });

  const serverResponse = await authStore.testTokenWithAPI(API_BASE_URL);

  $q.loading.hide();

  if (serverResponse) {
    // Server validated the token successfully
    console.log("✅ השרת אימת את הטוקן בהצלחה!");
    apiResponse.value = serverResponse;

    // Show success alert with server response
    alert(
      `✅ התחברות מוצלחת!\n\nתשובה מהשרת:\n${JSON.stringify(serverResponse, null, 2)}`,
    );

    $q.notify({
      color: "positive",
      textColor: "white",
      icon: "check",
      message: langStore.t("Login successful"),
      position: "top",
    });

    // Redirect to home
    router.push({ name: "home" });
  } else {
    // Server did not respond or rejected the token
    console.error("❌ השרת לא אימת את הטוקן");
    errorMessage.value = `לא ניתן להתחבר - השרת לא זמין או דחה את הטוקן.\nוודא שהשרת רץ על ${API_BASE_URL}`;

    // Show error alert
    alert(
      `❌ שגיאה באימות מול השרת\n\nהשרת לא זמין או דחה את הטוקן.\nוודא שהשרת רץ על ${API_BASE_URL}`,
    );

    // Optionally logout from Firebase since server rejected
    await authStore.logout();
  }
}

function getErrorMessage(error: string): string {
  // Map Firebase error codes to user-friendly messages
  if (
    error.includes("auth/user-not-found") ||
    error.includes("auth/wrong-password")
  ) {
    return langStore.t("Invalid email or password");
  } else if (error.includes("auth/invalid-email")) {
    return langStore.t("Invalid email format");
  } else if (error.includes("auth/too-many-requests")) {
    return langStore.t("Too many failed attempts. Please try again later.");
  } else if (error.includes("auth/network-request-failed")) {
    return langStore.t("Network error. Please check your connection.");
  }
  return error;
}

function copyToken() {
  if (authStore.token) {
    navigator.clipboard.writeText(authStore.token);
    $q.notify({
      color: "positive",
      message: "Token הועתק ללוח!",
      position: "top",
      timeout: 1000,
    });
  }
}

async function testToken() {
  if (!authStore.token) {
    $q.notify({
      color: "negative",
      message: "אין טוקן זמין",
      position: "top",
    });
    return;
  }

  $q.loading.show({ message: "בודק טוקן בשרת..." });

  const result = await authStore.testTokenWithAPI(API_BASE_URL);

  $q.loading.hide();

  if (result) {
    apiResponse.value = result;

    // Show notification
    $q.notify({
      color: "positive",
      message: "✅ השרת אימת את הטוקן בהצלחה!",
      position: "top",
    });

    // Show alert with server response
    alert(`✅ תשובה מהשרת:\n\n${JSON.stringify(result, null, 2)}`);
  } else {
    $q.notify({
      color: "negative",
      message: "❌ שגיאה בחיבור לשרת",
      position: "top",
    });

    // Show alert with error
    alert(`❌ שגיאה בחיבור לשרת\n\nוודא שהשרת רץ על ${API_BASE_URL}`);
  }
}

function forgotPassword() {
  $q.notify({
    color: "info",
    textColor: "white",
    icon: "info",
    message: langStore.t("Forgot password functionality not implemented yet"),
    position: "top",
  });
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

pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
