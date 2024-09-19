<template>
  <q-page class="q-pa-md">
    <q-table
      title="Process Instances"
      :rows="processInstances"
      :columns="columns"
      row-key="Key"
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
import { ref } from "vue";

const columns = [
  {
    name: "Key",
    label: "Key",
    field: "Key",
    sortable: true,
  },
  {
    name: "ProcessDefinitionKey",
    label: "ProcessDefinitionKey",
    field: "ProcessDefinitionKey",
    sortable: true,
  },
  {
    name: "CreatedAt",
    label: "CreatedAt",
    field: "CreatedAt",
    sortable: true,
  },
  {
    name: "State",
    label: "State",
    field: "State",
    sortable: true,
  },
  {
    name: "VariableHolder",
    label: "VariableHolder",
    field: "VariableHolder",
    sortable: true,
  },
  {
    name: "CaughtEvents",
    label: "CaughtEvents",
    field: "CaughtEvents",
    sortable: true,
  },
  {
    name: "Activities",
    label: "Activities",
    field: "Activities",
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

const processInstances = ref([]);
</script>
