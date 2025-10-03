<template>
  <q-page class="q-pa-md pb-100">
    <q-table
      v-if="businessRules"
      title="Business Rules"
      :rows="businessRules"
      :columns="columns"
      row-key="key"
      :filter="filter"
      :pagination="pagination"
      :rows-per-page-options="[15]"
      @row-click="(evt, row) => $router.push(`/business-rules/${row.key}`)"
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
      <q-btn fab icon="edit" color="primary" @click="editNewDecisionDefinition">
        <q-tooltip>Edit&nbsp;new&nbsp;process&nbsp;definition</q-tooltip>
      </q-btn>
    </div>
  </q-page-sticky>
  <input
    type="file"
    ref="fileInput"
    @change="deployProcess"
    accept=".dmn"
    style="display: none"
  />
</template>

<script setup>
import { DecisionDefinitionApi } from "src/api-client";
import { ref, onMounted } from "vue";

import config from "../config/config";
import {useRouter} from "vue-router";
import {useQuasar} from "quasar";

const businessRules = ref([]);
const decisionDefinitionApi = ref(null);
const router = useRouter();
const $q = useQuasar()

onMounted(() => {
  loadDecisionDefinitions();
});

const loadDecisionDefinitions = () => {
  decisionDefinitionApi.value = new DecisionDefinitionApi(config);

  decisionDefinitionApi.value
    .getDecisionDefinitions()
    .then((res) => {
      businessRules.value = res.data.items;
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
    decisionDefinitionApi.value.createDecisionDefinition(e.target.result)
      .then(() => {
        loadDecisionDefinitions();
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
      })


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
    name: "dmnDecisionId",
    label: "DMN Decision ID",
    field: "dmnDecisionId",
    sortable: true,
  },
  {
    name: "resourceName",
    label: "Resource Name",
    field: "dmnResourceName",
    sortable: true,
  },
];

function editNewDecisionDefinition() {
  router.push(`/business-rules/new`);
}
</script>
