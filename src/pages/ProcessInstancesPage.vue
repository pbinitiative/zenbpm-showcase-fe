<template>
  <q-page class="q-pa-md">
    <q-table
      title="Process Instances"
      :rows="processInstances"
      :columns="columns"
      row-key="key"
      :filter="filter"
      :pagination="pagination"
      :rows-per-page-options="[15]"
      @row-click="(evt, row) => $router.push(`/process-instances/${row.key}`)"
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
import { ProcessInstancesApi } from "src/api-client";
import { ref, onMounted } from "vue";
import config from "../config/config";

const processInstancesApi = ref(null);
const processInstances = ref([]);

onMounted(() => {
  processInstancesApi.value = new ProcessInstancesApi(config);

  processInstancesApi.value
    .getProcessInstances()
    .then((res) => {
      processInstances.value.push(...res.data.processInstances[0].items);
    })
    .catch((err) => {
      console.log(err);
    });
});

const columns = [
  {
    name: "Key",
    label: "Key",
    field: "key",
    sortable: true,
  },
  {
    name: "ProcessDefinitionKey",
    label: "ProcessDefinitionKey",
    field: "processDefinitionKey",
    sortable: true,
  },
  {
    name: "CreatedAt",
    label: "CreatedAt",
    field: "createdAt",
    sortable: true,
  },
  {
    name: "State",
    label: "State",
    field: "state",
    sortable: true,
  },
  {
    name: "VariableHolder",
    label: "VariableHolder",
    field: "variableHolder",
    sortable: true,
  },
  {
    name: "CaughtEvents",
    label: "CaughtEvents",
    field: "caughtEvents",
    sortable: true,
  },
  {
    name: "Activities",
    label: "Activities",
    field: "activities",
    sortable: true,
  },
];

const filter = ref("");
const pagination = ref({
  sortBy: "Key",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
});
</script>
