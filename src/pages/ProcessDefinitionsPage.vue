<template>
  <q-page class="q-pa-md">
    <q-table
      v-if="processDefinitions"
      title="Process Definitions"
      :rows="processDefinitions"
      :columns="columns"
      row-key="key"
      :filter="filter"
      :pagination="pagination"
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ProcessDefinitionsApi, ApiClient } from "src/api-client/src";
import { ref, onMounted } from "vue";

const processDefinitions = ref([]);
const processDefinitionsApi = ref(null);

onMounted(() => {
  const client = new ApiClient("/api");
  processDefinitionsApi.value = new ProcessDefinitionsApi(client);

  processDefinitionsApi.value.getProcessDefinitions().end((err, res) => {
    if (err) {
      console.log(err);
    } else {
      processDefinitions.value.push(...res.body.items);
    }
  });
});

const columns = [
  {
    name: "key",
    label: "Key",
    field: "key",
    sortable: true,
  },
  {
    name: "version",
    label: "Version",
    field: "version",
    sortable: true,
  },
  {
    name: "bpmnProcessId",
    label: "BPMN Process ID",
    field: "bpmnProcessId",
    sortable: true,
  },
  {
    name: "resourceName",
    label: "Resource Name",
    field: "bpmnResourceName",
    sortable: true,
  },
];
</script>
