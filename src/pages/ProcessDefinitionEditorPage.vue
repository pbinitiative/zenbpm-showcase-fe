<template>
  <q-page class="q-pa-md pb-100 column">
    <div class="col row q-col-gutter-md">
      <div class="col-12 col-md-12">
        <q-card class="column full-height">
          <q-card-section>
            <div class="text-h6">Process Definition Editor</div>
          </q-card-section>
          <q-card-section class="col q-pa-none">
            <BpmnEditor
              ref="bpmnEditorRef"
              :diagram-data="route.params.processDefinitionKey ? processDefinition.bpmnData : emptyProcess()"
              v-if="route.params.processDefinitionKey ? processDefinition.bpmnData : true"
              @diagram-changed="onDiagramChanged"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>

   <div class="row q-col-gutter-md q-mt-md q-ml-none"
        v-if="log.length && showLog"
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
    <div class="q-gutter-x-sm">
      <q-btn v-if="log.length" fab :icon="showLog?'keyboard_arrow_down':'keyboard_arrow_up'" color="primary" @click="() => showLog = !showLog">
        <q-tooltip>{{showLog ? "Hide" : "Show"}} Log</q-tooltip>
      </q-btn>
      <q-btn fab icon="rocket" color="primary" @click="deployProcessDefinition">
        <q-tooltip>Deploy process definition</q-tooltip>
      </q-btn>
    </div>
  </q-page-sticky>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import { ProcessDefinitionApi } from "src/api-client";
import BpmnEditor from "components/diagrams/BpmnEditor.vue";

import config from "../config/config";
import {useQuasar} from "quasar";

const processDefinitionApi = ref(null);
const processDefinition = ref({});
const partitionsData = ref([]);
const selectedPartition = ref(null);
const route = useRoute();
const bpmnEditorRef = ref(null);
const log = ref([]);
const tab = ref("log");
const showLog = ref(true);

const router = useRouter();
const $q = useQuasar()

// Computed properties
const partitionOptions = computed(() =>
  partitionsData.value.map((p) => ({
    label: `${p.partition}`,
    value: p.partition,
  }))
);

onMounted(async () => {
  processDefinitionApi.value = new ProcessDefinitionApi(config);
  processDefinitionApi.value
    .getProcessDefinition(route.params.processDefinitionKey)
    .then((res) => {
      processDefinition.value = res.data;
    })
    .catch((err) => {
      console.log(err);
    });
});

async function deployProcessDefinition() {
  try {
    const xmlToSend = await bpmnEditorRef.value.getXml();

    if (!xmlToSend) {
      log.value.unshift({
        time: new Date(),
        icon: 'warning',
        color: 'red',
        message: 'No XML to deploy'
      });
      return;
    }

    const response = await processDefinitionApi.value.createProcessDefinition(xmlToSend);
    if (response.status === 409) {
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
    await router.push(`/process-definitions/${response.data.processDefinitionKey}`);
  } catch (error) {
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
  const processId = `Process_${randomId()}`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_${randomId()}" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="${processId}" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${processId}">
      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="182" y="162" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`
}

function randomId() {
  return Math.random().toString(16).slice(2,9);
}

</script>
