<template>
  <q-item
    clickable
    v-ripple
    :active="task == activeTask"
    active-class="bg-blue-1"
  >
    <q-item-section>
      <div class="text-h6 q-mb-sm">
        {{ metadata ? metadata.name : props.task.elementId }}
      </div>

      <q-item-label caption>
        <div>
          <q-badge
            color="primary"
            :label="metadata ? metadata.process : props.task.processInstanceKey"
          />
        </div>
      </q-item-label>
      <q-item-label caption>
        <q-icon name="event" class="q-mr-sm" />
        {{ new Date(props.task.createdAt).toLocaleString() }}
      </q-item-label>
    </q-item-section>
    <q-item-section side style="align-self: flex-end">
      <q-item-label caption
        ><q-avatar color="primary" text-color="white" size="md" class="q-ml-sm"
          >J

          <q-tooltip>
            {{ props.task.assignee }}
          </q-tooltip></q-avatar
        ></q-item-label
      >
      <!-- <q-item-label caption
              >{{ task.candidateGroup }}<q-icon name="group" class="q-mr-sm"
            /></q-item-label> -->
    </q-item-section>
  </q-item>
</template>
<script setup>
const props = defineProps(["task", "activeTask", "metadata"]);
</script>
