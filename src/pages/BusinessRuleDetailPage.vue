<template>
  <q-page v-if="loading" class="q-pa-md flex flex-center">
    <q-spinner-gears size="50px" color="primary" />
  </q-page>
  <q-page class="q-pa-md pb-100" v-if="!loading">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-3">
        <q-card>
          <q-card-section>
            <div class="text-h6">Business Rule Detail</div>
          </q-card-section>

          <q-card-section>
            <q-list dense>
              <q-item>
                <q-item-section>
                  <q-item-label>Key</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption>{{
                    decisionDefinition.key
                  }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>Version</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption>{{
                    decisionDefinition.version
                  }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>DMN Definition ID</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption>{{
                    decisionDefinition.dmnDecisionId
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
            <div class="text-h6">DMN Diagram</div>
          </q-card-section>
          <q-card-section>
            <DmnDiagram
              v-if="decisionDefinition.dmnData"
              :diagram-data="decisionDefinition.dmnData"
              :onViewChanged="onViewChanged"
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

  </q-page>
  <q-page-sticky v-if="!loading" position="bottom-right" :offset="[18, 18]">
    <div class="q-gutter-x-sm">
      <q-btn v-if="activeDecisionId" fab icon="troubleshoot" color="primary" @click="evaluateDecision">
        <q-tooltip>Evaluate Decision</q-tooltip>
      </q-btn>
      <q-btn fab icon="edit" color="primary" @click="editDecisionDefinition">
        <q-tooltip>Edit decision definition</q-tooltip>
      </q-btn>
    </div>
  </q-page-sticky>
  <DmnEvaluateDialog
    ref="dmnEvaluateDialogRef"
  />
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useQuasar } from "quasar";

import { DecisionDefinitionsApi } from "src/api-client";
import "dmn-js/dist/assets/diagram-js.css";
import "dmn-js/dist/assets/dmn-js-shared.css";
import "dmn-js/dist/assets/dmn-js-drd.css";
import "dmn-js/dist/assets/dmn-js-decision-table.css";
import "dmn-js/dist/assets/dmn-js-decision-table-controls.css";
import "dmn-js/dist/assets/dmn-js-literal-expression.css";
import "dmn-js/dist/assets/dmn-font/css/dmn.css";


import config from "../config/config";
import DmnDiagram from "components/diagrams/DmnDiagram.vue";
import DmnEvaluateDialog from "components/diagrams/DmnEvaluateDialog.vue";

const decisionDefinitionsApi = ref(null);
const decisionDefinition = ref({});
const partitionsData = ref([]);
const selectedPartition = ref(null);
const route = useRoute();
const loading = ref(true);
const reloadInterval = ref(100);
const dmnEvaluateDialogRef = ref(null);
const activeDecisionId = ref("");

const router = useRouter();

const $q = useQuasar();

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

onMounted(async () => {
  getDecisionDefinition();
});

function getDecisionDefinition() {
  decisionDefinitionsApi.value = new DecisionDefinitionsApi(config);
  decisionDefinitionsApi.value
    .getDecisionDefinition(route.params.decisionDefinitionKey)
    .then((res) => {
      decisionDefinition.value = res.data;
      loading.value = false;
    })
    .catch((err) => {
      console.log(err);
      setTimeout(getDecisionDefinition, reloadInterval.value);
      if (reloadInterval.value < 10000) reloadInterval.value *= 2;
    });
}

function editDecisionDefinition() {
  router.push(`/business-rules/edit/${decisionDefinition.value.key}`);
}

function evaluateDecision() {
  dmnEvaluateDialogRef.value.open(activeDecisionId.value, decisionDefinition.value.key);
}

function onViewChanged (decisionId) {
  activeDecisionId.value = decisionId;
}

</script>
