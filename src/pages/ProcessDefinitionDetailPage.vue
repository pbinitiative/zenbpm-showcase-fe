<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-3">
        <q-card>
          <q-card-section>
            <div class="text-h6">Process Definition Detail</div>
          </q-card-section>

          <q-card-section>
            <q-list dense>
              <q-item>
                <q-item-section>
                  <q-item-label>Key</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption>{{
                    processDefinition.key
                  }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>Version</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption>{{
                    processDefinition.version
                  }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>BPMN Process ID</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption>{{
                    processDefinition.bpmnProcessId
                  }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-9">
        <q-card>
          <q-card-section>
            <div class="text-h6">BPMN Diagram</div>
          </q-card-section>
          <q-card-section>
            <BpmnIoDiagram
              :diagram-data="processDefinition.bpmnData"
              v-if="processDefinition.bpmnData"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-mb-md q-mt-md" v-if="partitionOptions.length > 1">
      <div class="col-12">
        <div class="text-subtitle2 q-mb-sm">Select Partition:</div>
        <q-btn-toggle
          v-model="selectedPartition"
          :options="partitionOptions"
          color="primary"
          toggle-color="primary"
          unelevated
        />
      </div>
    </div>

    <q-table
      title="Process Instances"
      :rows="processInstances"
      :columns="columns"
      row-key="key"
      :filter="filter"
      :pagination="pagination"
      :rows-per-page-options="[15]"
      class="q-mt-md"
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
  <q-page-sticky position="bottom-right" :offset="[18, 18]">
    <q-btn fab icon="add" color="primary" @click="startProcessInstance">
      <q-tooltip>Create&nbsp;new&nbsp;process&nbsp;instance</q-tooltip>
    </q-btn>
  </q-page-sticky>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useQuasar } from "quasar";

import { ProcessDefinitionsApi, ProcessInstancesApi } from "src/api-client";
import BpmnIoDiagram from "src/components/BpmnIoDiagram.vue";

import config from "../config/config";

const processDefinitionsApi = ref(null);
const processInstancesApi = ref(null);
const processDefinition = ref({});
const partitionsData = ref([]);
const selectedPartition = ref(null);
const route = useRoute();

const router = useRouter();

const $q = useQuasar();

const columns = [
  {
    name: "Key",
    label: "Key",
    field: "key",
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
    name: "Variables",
    label: "Variables",
    field: (row) => {
      return JSON.stringify(row.variables, null, 2);
    },
    sortable: false,
    align: "left",
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

// Computed properties
const partitionOptions = computed(() =>
  partitionsData.value.map((p) => ({
    label: `${p.partition}`,
    value: p.partition,
  }))
);

const processInstances = computed(() => {
  const partition = partitionsData.value.find(
    (p) => p.partition === selectedPartition.value
  );
  return partition ? partition.items : [];
});

onMounted(async () => {
  processDefinitionsApi.value = new ProcessDefinitionsApi(config);
  processInstancesApi.value = new ProcessInstancesApi(config);
  processDefinitionsApi.value
    .getProcessDefinition(route.params.processDefinitionKey)
    .then((res) => {
      processDefinition.value = res.data;
    })
    .catch((err) => {
      console.log(err);
    });
  processInstancesApi.value
    .getProcessInstances(route.params.processDefinitionKey)
    .then((res) => {
      partitionsData.value = res.data.partitions || [];
      // Set initial selected partition to the first available partition
      if (partitionsData.value.length > 0) {
        selectedPartition.value = partitionsData.value[0].partition;
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

function startProcessInstance() {
  const dialogRef = $q.dialog({
    title: "New Process Instance",
    message: "Enter process variables in JSON format",
    prompt: {
      model: "",
      type: "text", // optional
    },
    cancel: true,
    persistent: true,
  });

  dialogRef.onOk((variables) => {
    processInstancesApi.value
      .createProcessInstance({
        processDefinitionKey: processDefinition.value.key,
        variables: JSON.parse(variables),
      })
      .then((res) => {
        console.log(res);
        // TODO: redirect to process instance detail page
        router.push(`/process-instances/${res.data.key}`);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  dialogRef.onCancel(() => {
    console.log("Cancel");
  });
}
</script>
