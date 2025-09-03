<template>
  <q-page class="q-pa-md pb-100 column">
    <div class="col row q-col-gutter-md">
      <div class="col-12 col-md-12">
        <q-card class="column full-height">
          <q-card-section>
            <div class="text-h6">Business Rule Editor</div>
          </q-card-section>
          <q-card-section class="col q-pa-none">
            <DmnEditor
              ref="dmnEditorRef"
              :diagram-data="route.params.decisionDefinitionKey ? decisionDefinition.dmnData : emptyProcess()"
              v-if="route.params.decisionDefinitionKey ? decisionDefinition.dmnData : true"
              @diagram-changed="onDiagramChanged"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>

   <div class="row q-col-gutter-md q-mt-md q-ml-none"
        v-if="log.length"
   >
      <q-card class="col-12">
        <q-tabs
          class="col-12"
          v-model="tab"
          narrow-indicator
          dense
          align="left"
        >
          <q-tab name="log" label="Deployment Log" />
        </q-tabs>

        <q-tab-panels class="col-12" v-model="tab">
          <q-tab-panel name="log" class="q-pa-none">
            <q-table
                style="max-height: 250px;"
                :rows="log"
                :columns="[
                {
                  name: 'time',
                  label: 'Time',
                  field: 'time',
                  format: t => t.toLocaleString(),
                  sortable: true,
                  align: 'left',
                },
                {
                  name: 'icon',
                  field: 'icon',
                  align: 'right',
                },
                {
                  name: 'message',
                  label: 'Message',
                  field: 'message',
                  align: 'left',
                  style: 'white-space: normal; width: 100%',
                }
              ]"
              row-key="time"
            >
              <template v-slot:body-cell-icon="props">
                <q-td :props="props">
                  <q-icon :name="props.row.icon" :color="props.row.color" />
                </q-td>
              </template>
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
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
  <q-page-sticky position="bottom-right" :offset="[18, 18]">
    <q-btn fab icon="rocket" color="primary" @click="deployDecisionDefinition">
      <q-tooltip>Deploy business rule</q-tooltip>
    </q-btn>
  </q-page-sticky>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import { DecisionDefinitionsApi } from "src/api-client";

import config from "../config/config";
import { useQuasar } from "quasar";
import DmnEditor from "components/diagrams/DmnEditor.vue";

const decisionDefinitionsApi = ref(null);
const decisionDefinition = ref({});
const partitionsData = ref([]);
const selectedPartition = ref(null);
const route = useRoute();
const dmnEditorRef = ref(null);
const log = ref([]);
const tab = ref("log");

const router = useRouter();
const $q = useQuasar()

// Computed properties
const partitionOptions = computed(() =>
  partitionsData.value.map((p) => ({
    label: `${p.partition}`,
    value: p.partition,
  }))
);

onMounted(() => {
  decisionDefinitionsApi.value = new DecisionDefinitionsApi(config);
  if (!route.params.decisionDefinitionKey) {
    decisionDefinition.value = emptyProcess();
    return;
  }
  decisionDefinitionsApi.value
    .getDecisionDefinition(route.params.decisionDefinitionKey)
    .then((res) => {
      decisionDefinition.value = res.data;
    })
    .catch((err) => {
      console.log(err);
    });
});

async function deployDecisionDefinition() {
  try {
    const xmlToSend = await dmnEditorRef.value.getXml();

    if (!xmlToSend) {
      log.value.unshift({
        time: new Date(),
        icon: 'warning',
        color: 'red',
        message: 'No XML to deploy'
      });
      return;
    }

    const response = await decisionDefinitionsApi.value.createDecisionDefinition(xmlToSend);
    console.log(response.data.decisionDefinitionKey ,"===", route.params.decisionDefinitionKey)
    if (response.data.decisionDefinitionKey === route.params.decisionDefinitionKey) {
      log.value.unshift({
        time: new Date(),
        icon: 'close',
        message: 'The same definition already exists.'
      });
      $q.notify({
        message: 'The same definition already exists.',
        position: 'bottom',
        timeout: 5000,
        actions: [
          {
            icon: 'close',
            color: 'white',
          }
        ]
      });
      return;
    }
    $q.notify({
      type: 'positive',
      message: 'Process definition deployed successfully',
      position: 'bottom',
      timeout: 5000,
      actions: [
        {
          icon: 'close',
          color: 'white',
        }
      ]
    });
    log.value.unshift({
      time: new Date(),
      icon: 'check',
      color: 'green',
      message: 'Process definition deployed successfully.'
    });
    await router.push(`/business-rules/${response.data.decisionDefinitionKey}`);
  } catch (error) {
    console.log("ERROR", error)
    $q.notify({
      type: 'negative',
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
    log.value.unshift({
      time: new Date(),
      icon: 'warning',
      color: 'red',
      message: error.response.data.message,
    });
  }
}

function emptyProcess() {
  const id = randomId();
  return `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" xmlns:dmndi="https://www.omg.org/spec/DMN/20191111/DMNDI/" xmlns:dc="http://www.omg.org/spec/DMN/20180521/DC/" id="Definitions_${id}" name="DRD">
  <decision id="Decision_${id}" name="Decision 1">
    <decisionTable id="DecisionTable_${id}">
      <input id="Input_1">
        <inputExpression id="InputExpression_1" typeRef="string">
          <text></text>
        </inputExpression>
      </input>
      <output id="Output_1" typeRef="string" />
    </decisionTable>
  </decision>
  <dmndi:DMNDI>
    <dmndi:DMNDiagram>
      <dmndi:DMNShape dmnElementRef="Decision_${id}">
        <dc:Bounds height="80" width="180" x="160" y="100" />
      </dmndi:DMNShape>
    </dmndi:DMNDiagram>
  </dmndi:DMNDI>
</definitions>`
}

function randomId() {
  return Math.random().toString(16).slice(2,9);
}

</script>
