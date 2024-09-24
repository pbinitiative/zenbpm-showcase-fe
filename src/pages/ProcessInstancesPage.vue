<template>
  <q-page class="q-pa-md">
    <q-table
      title="Process Instances"
      :rows="processInstances"
      :columns="columns"
      row-key="key"
      :filter="filter"
      :pagination="pagination"
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
import { ProcessInstancesApi, ApiClient } from "src/api-client/src";
import { ref, onMounted } from "vue";

const processInstancesApi = ref(null);
const processInstances = ref([]);

onMounted(() => {
  const client = new ApiClient("/api");
  processInstancesApi.value = new ProcessInstancesApi(client);

  processInstancesApi.value.getProcessInstances().end((err, res) => {
    if (err) {
      console.log(err);
    } else {
      processInstances.value.push(...res.body.items);
    }
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
