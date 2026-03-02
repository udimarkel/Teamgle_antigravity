<template>
  <q-page class="q-pa-md bg-grey-1 column">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-md">
      <!-- Breadcrumb / Title if needed. For now empty to match clean look or add Button -->
      <div></div>
      <!-- Spacer -->
      <div class="row items-center q-gutter-x-sm">
        <q-btn
          unelevated
          color="primary"
          icon="add"
          :label="langStore.t('New Worker')"
          no-caps
          class="q-px-md"
          @click="showAddWorkerDialog = true"
        />
        <q-input
          dense
          outlined
          bg-color="white"
          v-model="search"
          :placeholder="langStore.t('Search')"
          class="search-input"
        >
          <template v-slot:prepend>
            <q-icon name="search" color="grey-5" />
          </template>
        </q-input>
        <q-btn
          outline
          color="grey-5"
          icon="filter_list"
          class="bg-white text-grey-8"
        />
      </div>
    </div>

    <!-- Main Content -->
    <div class="col column">
      <!-- Tabs & View Toggles -->
      <div class="row items-center justify-between q-mb-md">
        <div class="row items-center q-gutter-x-md">
          <q-btn
            unelevated
            rounded
            color="primary"
            no-caps
            :label="langStore.t('All workers')"
            class="q-px-lg"
          />
          <q-btn
            flat
            rounded
            color="grey-7"
            no-caps
            :label="langStore.t('Active')"
            class="q-px-lg"
          />
          <q-btn
            flat
            rounded
            color="grey-7"
            no-caps
            :label="langStore.t('Inactive')"
            class="q-px-lg"
          />
        </div>

        <div class="row items-center q-gutter-x-sm">
          <q-btn
            :flat="viewMode !== 'grid'"
            :unelevated="viewMode === 'grid'"
            round
            dense
            icon="grid_view"
            :color="viewMode === 'grid' ? 'primary' : 'grey-5'"
            @click="viewMode = 'grid'"
          />
          <q-btn
            :flat="viewMode !== 'list'"
            :unelevated="viewMode === 'list'"
            round
            dense
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
        @row-click="(evt, row) => openEmployeeDetails(row)"
        style="cursor: pointer"
      >
        <!-- Name Column -->
        <template v-slot:body-cell-name="props">
          <q-td :props="props">
            <div class="row items-center q-gutter-x-sm">
              <q-avatar size="40px">
                <img
                  :src="
                    props.row.avatar || 'https://cdn.quasar.dev/img/avatar.png'
                  "
                />
              </q-avatar>
              <div class="column">
                <span class="text-weight-bold">{{ props.row.name }}</span>
                <span class="text-caption text-grey-6">{{
                  props.row.role
                }}</span>
              </div>
            </div>
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
          <div
            v-for="worker in filteredEmployees"
            :key="worker.id"
            class="col-12 col-sm-6 col-md-4 col-lg-3"
          >
            <q-card
              flat
              class="items-start q-pa-md rounded-borders-md bordered-card clickable-card"
              @click="openEmployeeDetails(worker)"
            >
              <div class="row items-start justify-between q-mb-sm">
                <div class="row items-center q-gutter-x-sm">
                  <q-avatar size="48px">
                    <img
                      :src="
                        worker.avatar || 'https://cdn.quasar.dev/img/avatar.png'
                      "
                    />
                  </q-avatar>
                  <div>
                    <div class="text-subtitle2 text-weight-bold">
                      {{ worker.name }}
                    </div>
                    <div class="text-caption text-grey-6">
                      {{ worker.role }}
                    </div>
                  </div>
                </div>
                <q-btn flat round dense icon="more_vert" color="grey-5" />
              </div>

              <div class="q-mb-sm text-grey-7 text-caption">
                <div class="row items-center q-mb-xs">
                  <q-icon name="email" size="xs" class="q-mr-xs" />
                  {{ worker.email }}
                </div>
                <div class="row items-center">
                  <q-icon name="phone" size="xs" class="q-mr-xs" />
                  {{ worker.phoneNum || worker.phone }}
                </div>
              </div>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <!-- Employee Details Dialog -->
    <q-dialog v-model="showEmployeeDetailsDialog">
      <q-card style="min-width: 500px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ langStore.t("Employee Details") }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section v-if="selectedEmployee">
          <div class="row q-col-gutter-md">
            <!-- Avatar -->
            <div class="col-12 text-center">
              <q-avatar size="100px">
                <img
                  :src="
                    selectedEmployee.avatar ||
                    'https://cdn.quasar.dev/img/avatar.png'
                  "
                />
              </q-avatar>
            </div>

            <!-- Full Name -->
            <div class="col-12">
              <div class="text-caption text-grey-6">
                {{ langStore.t("Full Name") }}
              </div>
              <div class="text-body1 text-weight-medium">
                {{ selectedEmployee.name }}
              </div>
            </div>

            <!-- Email -->
            <div class="col-12">
              <div class="text-caption text-grey-6">
                {{ langStore.t("Email") }}
              </div>
              <div class="text-body1">{{ selectedEmployee.email }}</div>
            </div>

            <!-- Phone -->
            <div class="col-12">
              <div class="text-caption text-grey-6">
                {{ langStore.t("Phone Number") }}
              </div>
              <div class="text-body1">{{ selectedEmployee.phoneNum }}</div>
            </div>

            <!-- Role -->
            <div class="col-12">
              <div class="text-caption text-grey-6">
                {{ langStore.t("Role") }}
              </div>
              <div class="text-body1">{{ selectedEmployee.role }}</div>
            </div>

            <!-- Date of Birth -->
            <div class="col-12">
              <div class="text-caption text-grey-6">
                {{ langStore.t("Date of Birth") }}
              </div>
              <div class="text-body1">
                {{ formatDate(selectedEmployee.dob) }}
              </div>
            </div>

            <!-- Cost Per Hour -->
            <div class="col-12">
              <div class="text-caption text-grey-6">
                {{ langStore.t("Cost Per Hour") }}
              </div>
              <div class="text-body1">₪{{ selectedEmployee.costPerHour }}</div>
            </div>

            <!-- UID -->
            <div class="col-12" v-if="selectedEmployee.uid">
              <div class="text-caption text-grey-6">
                {{ langStore.t("UID") }}
              </div>
              <div class="text-body1">{{ selectedEmployee.uid }}</div>
            </div>

            <!-- Company -->
            <div class="col-12">
              <div class="text-caption text-grey-6">
                {{ langStore.t("Company") }}
              </div>
              <div class="text-body1">{{ selectedEmployee.companyName }}</div>
            </div>

            <!-- Manager -->
            <div class="col-12">
              <div class="text-caption text-grey-6">
                {{ langStore.t("Manager") }}
              </div>
              <div class="text-body1">{{ selectedEmployee.managerName }}</div>
            </div>

            <!-- Files Link -->
            <div class="col-12" v-if="selectedEmployee.filesLink">
              <div class="text-caption text-grey-6">
                {{ langStore.t("Files Link") }}
              </div>
              <div class="text-body1">
                <a
                  :href="selectedEmployee.filesLink"
                  target="_blank"
                  class="text-primary"
                >
                  {{ selectedEmployee.filesLink }}
                </a>
              </div>
            </div>

            <!-- Created At -->
            <div class="col-12">
              <div class="text-caption text-grey-6">
                {{ langStore.t("Created At") }}
              </div>
              <div class="text-body1">
                {{ formatDate(selectedEmployee.created_at) }}
              </div>
            </div>

            <!-- Firebase UID -->
            <div class="col-12">
              <div class="text-caption text-grey-6">
                {{ langStore.t("Firebase UID") }}
              </div>
              <div
                class="text-body1 text-grey-7"
                style="word-break: break-all; font-size: 0.85rem"
              >
                {{ selectedEmployee.firebaseUID }}
              </div>
            </div>

            <!-- Employee Files from Firebase -->
            <div class="col-12">
              <q-separator class="q-my-md" />
              <div class="text-subtitle2 text-weight-medium q-mb-sm">
                {{ langStore.t("Employee Files") }}
              </div>

              <div
                v-if="selectedEmployeeFiles.length === 0"
                class="text-grey-6 text-caption"
              >
                {{ langStore.t("No files uploaded") }}
              </div>

              <div v-else class="row q-col-gutter-sm">
                <div
                  v-for="file in selectedEmployeeFiles"
                  :key="file.fullPath"
                  class="col-12"
                >
                  <q-card flat bordered class="q-pa-sm">
                    <div class="row items-center">
                      <q-icon
                        name="description"
                        size="sm"
                        color="primary"
                        class="q-mr-sm"
                      />
                      <div class="col">
                        <div class="text-body2">
                          {{ getFileName(file.name) }}
                        </div>
                      </div>
                      <q-btn
                        flat
                        dense
                        round
                        icon="download"
                        color="primary"
                        size="sm"
                        @click="downloadFile(file.url, file.name)"
                      >
                        <q-tooltip>{{ langStore.t("Download") }}</q-tooltip>
                      </q-btn>
                      <q-btn
                        flat
                        dense
                        round
                        icon="visibility"
                        color="primary"
                        size="sm"
                        @click="openFile(file.url)"
                      >
                        <q-tooltip>{{ langStore.t("View") }}</q-tooltip>
                      </q-btn>
                    </div>
                  </q-card>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            :label="langStore.t('Close')"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Add Worker Dialog -->
    <q-dialog v-model="showAddWorkerDialog" persistent>
      <q-card style="min-width: 500px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ langStore.t("Add New Worker") }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <q-form @submit="handleAddWorker" class="q-gutter-md">
            <!-- Email -->
            <q-input
              v-model="newWorker.email"
              :label="langStore.t('Email') + ' *'"
              type="email"
              outlined
              dense
              :rules="[
                (val) => !!val || 'Field is required',
                (val) => /.+@.+\..+/.test(val) || 'Invalid email',
              ]"
            />

            <!-- Password -->
            <q-input
              v-model="newWorker.password"
              :label="langStore.t('Password') + ' *'"
              type="password"
              outlined
              dense
              :rules="[
                (val) => !!val || 'Field is required',
                (val) =>
                  val.length >= 6 || 'Password must be at least 6 characters',
              ]"
            />

            <!-- First Name -->
            <q-input
              v-model="newWorker.firstName"
              :label="langStore.t('First Name') + ' *'"
              outlined
              dense
              :rules="[(val) => !!val || 'Field is required']"
            />

            <!-- Last Name -->
            <q-input
              v-model="newWorker.lastName"
              :label="langStore.t('Last Name') + ' *'"
              outlined
              dense
              :rules="[(val) => !!val || 'Field is required']"
            />

            <!-- Date of Birth -->
            <q-input
              v-model="newWorker.dob"
              :label="langStore.t('Date of Birth') + ' *'"
              type="date"
              outlined
              dense
              :rules="[(val) => !!val || 'Field is required']"
            />

            <!-- Phone Number -->
            <q-input
              v-model="newWorker.phoneNum"
              :label="langStore.t('Phone Number') + ' *'"
              outlined
              dense
              :rules="[(val) => !!val || 'Field is required']"
            />

            <!-- Picture URL (Optional) -->
            <q-input
              v-model="newWorker.picture_URL"
              :label="langStore.t('Picture URL')"
              outlined
              dense
            />

            <!-- Role -->
            <q-input
              v-model="newWorker.role"
              :label="langStore.t('Role') + ' *'"
              outlined
              dense
              :rules="[(val) => !!val || 'Field is required']"
            />

            <!-- Cost Per Hour -->
            <q-input
              v-model.number="newWorker.costPerHour"
              :label="langStore.t('Cost Per Hour') + ' *'"
              type="number"
              outlined
              dense
              :rules="[(val) => val > 0 || 'Must be greater than 0']"
            />

            <!-- Employee Files Upload -->
            <div class="q-mt-md">
              <div class="text-caption text-grey-7 q-mb-sm">
                {{ langStore.t("Employee Files") }}
              </div>
              <q-file
                v-model="employeeFiles"
                multiple
                outlined
                dense
                counter
                max-files="10"
                :label="langStore.t('Drag files here or click to select')"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
                <template v-slot:hint>
                  {{ langStore.t("PDF, Word, or Image files (max 10 files)") }}
                </template>
              </q-file>

              <!-- Files Preview -->
              <div
                v-if="employeeFiles && employeeFiles.length > 0"
                class="q-mt-sm"
              >
                <q-chip
                  v-for="(file, index) in employeeFiles"
                  :key="index"
                  removable
                  @remove="removeFile(index)"
                  color="primary"
                  text-color="white"
                  icon="description"
                >
                  {{ file.name }}
                </q-chip>
              </div>
            </div>

            <!-- UID (Optional) -->
            <q-input
              v-model="newWorker.uid"
              :label="langStore.t('UID')"
              outlined
              dense
            />

            <div class="row justify-end q-gutter-sm q-mt-md">
              <q-btn
                :label="langStore.t('Cancel')"
                color="grey-7"
                flat
                v-close-popup
              />
              <q-btn
                :label="langStore.t('Add Worker')"
                type="submit"
                color="primary"
                unelevated
                :loading="isSubmitting"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useLanguageStore } from "../stores/language";
import {
  registerEmployee,
  RegisterEmployeeDto,
  getEmployees as getEmployeesFromAPI,
} from "../services/api";
import {
  createFirebaseUser,
  uploadEmployeeFiles,
  getEmployeeFiles,
} from "../services/firebase";
import { useQuasar } from "quasar";

const langStore = useLanguageStore();
const $q = useQuasar();

const search = ref("");
const viewMode = ref<"list" | "grid">("list");
const employees = ref<any[]>([]);
const showAddWorkerDialog = ref(false);
const showEmployeeDetailsDialog = ref(false);
const selectedEmployee = ref<any>(null);
const selectedEmployeeFiles = ref<any[]>([]);
const isSubmitting = ref(false);
const employeeFiles = ref<File[] | null>(null);

// הרחבת ה-DTO עם שדה סיסמה (רק לשימוש מקומי)
interface LocalEmployeeDto extends RegisterEmployeeDto {
  password: string;
}

const newWorker = ref<LocalEmployeeDto>({
  firebaseUID: "",
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  dob: "",
  phoneNum: "",
  picture_URL: "",
  role: "",
  costPerHour: 0,
  filesLink: "",
  uid: "",
});

const filteredEmployees = computed(() => {
  if (!search.value) return employees.value;
  const term = search.value.toLowerCase();
  return employees.value.filter((e) => {
    const fullName = `${e.firstName} ${e.lastName}`.toLowerCase();
    return (
      fullName.includes(term) ||
      e.email.toLowerCase().includes(term) ||
      e.role.toLowerCase().includes(term) ||
      e.phoneNum.toLowerCase().includes(term)
    );
  });
});

const columns = computed(() => [
  {
    name: "name",
    label: langStore.t("Name"),
    align: "left",
    field: "name",
    sortable: true,
  },
  { name: "phone", label: langStore.t("Phone"), align: "left", field: "phone" },
  { name: "email", label: langStore.t("Email"), align: "left", field: "email" },
  { name: "actions", label: "", align: "right" },
]);

onMounted(async () => {
  try {
    // קבלת עובדים אמיתיים מהשרת
    const employeesData = await getEmployeesFromAPI();

    // מיפוי הנתונים מהשרת לפורמט של הקומפוננטה
    employees.value = employeesData.map((emp: any) => ({
      id: emp.firebaseUID,
      firebaseUID: emp.firebaseUID,
      name: `${emp.firstName} ${emp.lastName}`,
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      phone: emp.phoneNum,
      phoneNum: emp.phoneNum,
      role: emp.role,
      avatar: emp.picture_URL || "https://cdn.quasar.dev/img/avatar.png",
      picture_URL: emp.picture_URL,
      dob: emp.dob,
      costPerHour: emp.costPerHour,
      filesLink: emp.filesLink,
      uid: emp.uid,
      companyID: emp.companyID,
      companyName: emp.companyName,
      firebaseUID_Manager: emp.firebaseUID_Manager,
      managerName: emp.managerName,
      created_at: emp.created_at,
    }));

    console.log("✅ עובדים נטענו בהצלחה:", employees.value);
  } catch (error) {
    console.error("❌ שגיאה בטעינת עובדים:", error);
    $q.notify({
      type: "negative",
      message: langStore.t("Failed to load employees"),
      position: "top",
      timeout: 3000,
    });
  }
});

const getRoleColor = (role?: string) => {
  if (role === "Waiter") return "blue-1 text-blue-8";
  if (role === "General") return "blue-1 text-blue-8";
  if (role === "Driver") return "orange-1 text-orange-8";
  return "grey-2";
};

const getSkillColor = (skill: string) => {
  if (skill === "Driver") return "orange-1";
  if (skill === "Bartender") return "red-1";
  if (skill === "Security Guard") return "grey-2"; // Based on image
  if (skill === "Close as Won") return "green-1"; // Based on "Anthony Davis" row
  return "grey-2";
};

const handleAddWorker = async () => {
  isSubmitting.value = true;
  try {
    // שלב 1: יצירת משתמש ב-Firebase Authentication
    // הפונקציה מחזירה את ה-UID ושומרת על המנהל כמשתמש מחובר
    console.log("🔐 יוצר משתמש ב-Firebase...");
    const firebaseUID = await createFirebaseUser(
      newWorker.value.email,
      newWorker.value.password,
    );

    console.log("✅ משתמש נוצר ב-Firebase עם UID:", firebaseUID);

    // שלב 2: הכנת הנתונים לשליחה לשרת (ללא סיסמה!)
    const dobISO = new Date(newWorker.value.dob).toISOString();

    const dto: RegisterEmployeeDto = {
      firebaseUID: firebaseUID, // שימוש ב-UID שנוצר ב-Firebase
      email: newWorker.value.email,
      firstName: newWorker.value.firstName,
      lastName: newWorker.value.lastName,
      dob: dobISO,
      phoneNum: newWorker.value.phoneNum,
      picture_URL: newWorker.value.picture_URL,
      role: newWorker.value.role,
      costPerHour: newWorker.value.costPerHour,
      filesLink: newWorker.value.filesLink,
      uid: newWorker.value.uid,
    };

    // שלב 3: שליחת הנתונים לשרת (ללא הסיסמה!)
    // המנהל עדיין מחובר ולכן הטוקן שלו נשלח
    console.log("📤 שולח נתוני עובד לשרת...");
    await registerEmployee(dto);

    // שלב 4: העלאת קבצים ל-Firebase Storage (אם יש)
    if (employeeFiles.value && employeeFiles.value.length > 0) {
      console.log("📤 מעלה קבצים ל-Firebase Storage...");
      try {
        await uploadEmployeeFiles(firebaseUID, employeeFiles.value);
        console.log("✅ קבצים הועלו בהצלחה");
      } catch (fileError) {
        console.error("⚠️ שגיאה בהעלאת קבצים:", fileError);
        // לא נכשיל את כל התהליך בגלל שגיאה בקבצים
        $q.notify({
          type: "warning",
          message: langStore.t("Employee added but files upload failed"),
          position: "top",
          timeout: 3000,
        });
      }
    }

    // הצגת הודעת הצלחה
    $q.notify({
      type: "positive",
      message: langStore.t("Worker added successfully!"),
      position: "top",
      timeout: 2000,
    });

    // סגירת הדיאלוג ואיפוס הטופס
    showAddWorkerDialog.value = false;
    resetForm();

    // רענון רשימת העובדים מהשרת
    const employeesData = await getEmployeesFromAPI();
    employees.value = employeesData.map((emp: any) => ({
      id: emp.firebaseUID,
      firebaseUID: emp.firebaseUID,
      name: `${emp.firstName} ${emp.lastName}`,
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      phone: emp.phoneNum,
      phoneNum: emp.phoneNum,
      role: emp.role,
      avatar: emp.picture_URL || "https://cdn.quasar.dev/img/avatar.png",
      picture_URL: emp.picture_URL,
      dob: emp.dob,
      costPerHour: emp.costPerHour,
      filesLink: emp.filesLink,
      uid: emp.uid,
      companyID: emp.companyID,
      companyName: emp.companyName,
      firebaseUID_Manager: emp.firebaseUID_Manager,
      managerName: emp.managerName,
      created_at: emp.created_at,
    }));
  } catch (error: any) {
    console.error("Error adding worker:", error);
    $q.notify({
      type: "negative",
      message: error.message || langStore.t("Failed to add worker"),
      position: "top",
      timeout: 3000,
    });
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  newWorker.value = {
    firebaseUID: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    dob: "",
    phoneNum: "",
    picture_URL: "",
    role: "",
    costPerHour: 0,
    filesLink: "",
    uid: "",
  };
  employeeFiles.value = null;
};

// הסרת קבץ מהרשימה
const removeFile = (index: number) => {
  if (employeeFiles.value) {
    employeeFiles.value.splice(index, 1);
  }
};

// פתיחת דיאלוג פרטי עובד
const openEmployeeDetails = async (employee: any) => {
  selectedEmployee.value = employee;
  showEmployeeDetailsDialog.value = true;

  // טעינת קבצים של העובד מ-Firebase
  try {
    selectedEmployeeFiles.value = await getEmployeeFiles(employee.firebaseUID);
  } catch (error) {
    console.error("Error loading employee files:", error);
    selectedEmployeeFiles.value = [];
  }
};

// פורמט תאריך
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("he-IL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

// ניקוי שם קבץ (הסרת timestamp)
const getFileName = (fullName: string) => {
  // הסרת ה-timestamp מתחילת השם
  const parts = fullName.split("_");
  if (parts.length > 1) {
    return parts.slice(1).join("_");
  }
  return fullName;
};

// הורדת קבץ
const downloadFile = (url: string, fileName: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = getFileName(fileName);
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// פתיחת קבץ בטאב חדש
const openFile = (url: string) => {
  window.open(url, "_blank");
};
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

.clickable-card {
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
}

.employee-table {
  :deep(tbody tr) {
    cursor: pointer;

    &:hover {
      background-color: #f5f5f5;
    }
  }
}
</style>
