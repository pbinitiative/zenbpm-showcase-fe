<template>
  <q-card class="q-ma-md" v-if="task">
    <q-card-section>
      <div class="text-h4 q-mb-lg">
        <q-icon name="task" class="q-mr-sm text-primary" />
        {{ task.name }}
      </div>
      <div class="row q-gutter-xs q-mt-sm">
        <div class="col">
          <q-item-label caption>
            <q-icon name="person" class="q-mr-xs" />
            {{ task.assignee ? task.assignee : "Not assigned" }}
          </q-item-label>
        </div>
        <div class="col">
          <q-item-label caption>
            <q-icon name="group" class="q-mr-xs" />
            {{
              task.candidateGroup ? task.candidateGroup : "No candidate group"
            }}
          </q-item-label>
        </div>
        <div class="col">
          <q-item-label caption>
            <q-icon name="event" class="q-mr-xs" />
            {{ new Date(task.startDate).toLocaleString("cs-CZ") }}
          </q-item-label>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps({
  task: {
    type: Object,
    required: true,
  },
});
</script>
