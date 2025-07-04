<template>
  <q-item
    clickable
    v-ripple
    :active="process == props.activeProcess"
    active-class="bg-blue-1"
  >
    <q-item-section>
      <div class="text-h6 q-mb-sm">
        {{ props.metadata ? props.metadata.name : process.bpmnProcessId }}
        <q-item-label caption v-if="props.metadata && props.metadata.agenda">
          <div>
            <q-badge color="purple" :label="props.metadata.agenda" />
          </div>
        </q-item-label>
        <q-item-label caption>
          <div><q-icon name="tag" />{{ process.key }}</div>
        </q-item-label>
        <q-item-label caption>
          <q-badge color="primary" :label="'v' + process.version" />
        </q-item-label>
      </div>
    </q-item-section>
  </q-item>
</template>
<script setup>
const props = defineProps(["process", "activeProcess", "metadata"]);
</script>
