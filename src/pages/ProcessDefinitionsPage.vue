<template>
  <q-page class="q-pa-md pb-100">
  <q-table
      ref="tableRef"
      v-if="processDefinitions"
      title="Process Definitions"
      :rows="processDefinitions"
      :columns="columns"
      row-key="key"
      :filter="filter"
      v-model:pagination="pagination"
      @request="loadProcessDefinitions"
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
    </q-table>
  </q-page>
  <q-page-sticky position="bottom-right" :offset="[18, 18]">
    <div class="q-gutter-x-sm">
      <q-btn fab icon="upload" color="primary" @click="fileInput.click()">
        <q-tooltip>Deploy new process definition from file</q-tooltip>
      </q-btn>
      <q-btn fab icon="edit" color="primary" @click="editNewProcessDefinition">
        <q-tooltip>Edit&nbsp;new&nbsp;process&nbsp;definition</q-tooltip>
      </q-btn>
    </div>
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
import { ProcessDefinitionApi } from "src/api-client";
import { ref, onMounted } from "vue";

import config from "../config/config";
import {useRouter} from "vue-router";
import {useQuasar} from "quasar";

const processDefinitions = ref([]);
const processDefinitionApi = ref(null);
const tableRef = ref(null)
const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0
    })

const router = useRouter();
const $q = useQuasar()

onMounted(() => {
  tableRef.value.requestServerInteraction()
});

const loadProcessDefinitions = (props) => {
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  processDefinitionApi.value = new ProcessDefinitionApi(config);

  processDefinitionApi.value
    .getProcessDefinitions(page, rowsPerPage)
    .then((res) => {
      processDefinitions.value = res.data.items;
      pagination.value.page = page;
      pagination.value.rowsPerPage = rowsPerPage;
      pagination.value.sortBy = sortBy;
      pagination.value.descending = descending;
      pagination.value.rowsNumber = res.data.count;
      console.log("RES", res)
    })
    .catch((err) => {
      console.log(err);
    });
}

const fileInput = ref(null);

const deployProcess = () => {
  const selectedFile = fileInput.value.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    processDefinitionApi.value.createProcessDefinition(e.target.result)
      .then(() => {
        loadProcessDefinitions({pagination: pagination.value});
      })
      .catch((error) => {
        console.log(error)
        $q.notify({
          message: error.response.data.message,
          position: 'bottom',
          timeout: 5000,
          actions: [
            {
              icon: 'close',
              color: 'white',
            }
          ]
        })
      });
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

function editNewProcessDefinition() {
  router.push(`/process-definitions/new`);
}
</script>
