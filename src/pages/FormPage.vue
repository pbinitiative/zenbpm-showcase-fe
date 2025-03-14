<template>
  <q-drawer side="left" show-if-above bordered :width="350" :breakpoint="500">
    <q-scroll-area class="fit">
      <q-list separator>
        <q-item v-for="task in tasks" :key="task.id" clickable v-ripple>
          <q-item-section>
            <div class="text-h6 q-mb-sm">{{ task.name }}</div>

            <q-item-label caption>
              <div>
                <q-badge
                  color="primary"
                  :label="task.process"
                  class="text-subtitle2"
                />
              </div>
            </q-item-label>
            <q-item-label caption>
              <q-icon name="event" class="q-mr-sm" />
              {{ task.startDate.toLocaleString("cs-CZ") }}
            </q-item-label>
          </q-item-section>
          <q-item-section side style="align-self: flex-end">
            <q-item-label caption
              ><q-avatar
                color="primary"
                text-color="white"
                size="md"
                class="q-ml-sm"
                >J

                <q-tooltip>
                  {{ task.assignee }}
                </q-tooltip></q-avatar
              ></q-item-label
            >
            <!-- <q-item-label caption
              >{{ task.candidateGroup }}<q-icon name="group" class="q-mr-sm"
            /></q-item-label> -->
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
  <div>
    <component :is="currentFormComponent" v-if="currentFormComponent" />
    <div v-else class="q-pa-md text-negative">Formulář nenalezen.</div>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, watch, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const tasks = ref([
  {
    id: 1,
    name: "Task 1",
    formKey: "claim-form",
    startDate: new Date(),
    assignee: "John Doe",
    process: "Claim",
    candidateGroup: "Engineers",
  },
  {
    id: 2,
    name: "Task 2",
    formKey: "claim-form",
    startDate: new Date(),
    assignee: "Jane Smith",
    process: "Claim",
    candidateGroup: "Managers",
  },
]);

const currentFormComponent = computed(() => {
  try {
    return defineAsyncComponent(() =>
      import(`../forms/${route.params.formKey}.vue`)
    );
  } catch (error) {
    console.error("Form component not found:", error);
    return null;
  }
});

// Ensure the component updates when the route changes
watch(
  () => route.params.formKey,
  () => {
    currentFormComponent.value = computed(() => {
      try {
        return defineAsyncComponent(() =>
          import(`@/forms/${route.params.formKey}.vue`)
        );
      } catch (error) {
        console.error("Form component not found:", error);
        return null;
      }
    });
  }
);
</script>
