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
      @row-click="(evt, row) => $router.push(`/process-definitions/${row.key}`)"
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
    </q-table> </q-page
  ><q-page-sticky position="bottom-right" :offset="[18, 18]">
    <q-btn fab icon="add" color="primary" @click="fileInput.click()">
      <q-tooltip>Deploy new process definition</q-tooltip>
    </q-btn>
  </q-page-sticky>
  <input
    type="file"
    ref="fileInput"
    @change="deployProcess"
    accept=".bpmn"
    style="display: none"
  />
</template>

<script setup>
import { ProcessDefinitionsApi } from "src/api-client";
import { ref, onMounted } from "vue";

import config from "../config/config";

const processDefinitions = ref([]);
const processDefinitionsApi = ref(null);

onMounted(() => {
  processDefinitionsApi.value = new ProcessDefinitionsApi(config);

  processDefinitionsApi.value
    .getProcessDefinitions()
    .then((res) => {
      processDefinitions.value.push(...res.data.items);
    })
    .catch((err) => {
      console.log(err);
    });
});

const fileInput = ref(null);

const deployProcess = () => {
  const selectedFile = fileInput.value.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    processDefinitionsApi.value.createProcessDefinition(e.target.result).then;
  };
  reader.readAsText(selectedFile);
};

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
