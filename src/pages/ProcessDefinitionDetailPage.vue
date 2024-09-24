<template>
  <div class="q-pa-md">
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
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        icon="add"
        color="primary"
        @click="startProcessInstance"
      ></q-btn>
    </q-page-sticky>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import { QForm } from "quasar";

import { useQuasar } from "quasar";

import {
  ProcessDefinitionsApi,
  ProcessInstancesApi,
  ApiClient,
} from "src/api-client/src";
import BpmnIoDiagram from "src/components/BpmnIoDiagram.vue";

const processDefinitionsApi = ref(null);
const processInstancesApi = ref(null);
const processDefinition = ref({});
const route = useRoute();

const $q = useQuasar();

onMounted(async () => {
  const client = new ApiClient("/api");
  processDefinitionsApi.value = new ProcessDefinitionsApi(client);
  processInstancesApi.value = new ProcessInstancesApi(client);
  processDefinitionsApi.value.getProcessDefinition(
    route.params.processDefinitionKey,
    (err, res) => {
      if (err) {
        console.log(err);
      }
      processDefinition.value = res;
    }
  );
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
    processInstancesApi.value.createProcessInstance(
      {
        processDefinitionKey: processDefinition.value.key,
        variables: JSON.parse(variables),
      },
      (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
          // TODO: redirect to process instance detail page
        }
      }
    );
  });

  dialogRef.onCancel(() => {
    console.log("Cancel");
  });
}
</script>
