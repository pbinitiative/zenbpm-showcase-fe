<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-3">
        <q-card>
          <q-card-section>
            <div class="text-h6">Process Instance Detail</div>
          </q-card-section>
          <q-card-section>
            <q-list dense>
              <q-item>
                <q-item-section>
                  <q-item-label>Key</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption>{{ processInstance.key }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>CreatedAt</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption>{{
                    new Date(processInstance.createdAt).toLocaleString()
                  }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>State</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption>{{
                    processInstance.state
                  }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>ProcessDefinitionKey</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption>{{
                    processInstance.processDefinitionKey
                  }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>BPMN Process Id</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption>{{
                    processDefinition.bpmnProcessId
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
    <div class="row q-col-gutter-md q-mt-md q-ml-none">
      <q-card class="col-12">
        <q-tabs
          class="col-12"
          v-model="tab"
          narrow-indicator
          dense
          align="left"
        >
          <q-tab name="jobs" label="Jobs" />
          <q-tab name="activities" label="Activities" />
        </q-tabs>

        <q-tab-panels class="col-12" v-model="tab">
          <q-tab-panel name="jobs" class="q-pa-none">
            <q-table
              v-if="jobs"
              :rows="jobs"
              :columns="[
                { name: 'key', align: 'left', label: 'Key', field: 'key' },
                {
                  name: 'elementId',
                  align: 'left',
                  label: 'Element ID',
                  field: 'elementId',
                },
                {
                  name: 'processInstanceKey',
                  align: 'left',
                  label: 'Process Instance Key',
                  field: 'processInstanceKey',
                },
                {
                  name: 'state',
                  align: 'left',
                  label: 'State',
                  field: 'state',
                },
                {
                  name: 'createdAt',
                  align: 'left',
                  label: 'Created At',
                  field: (row) => new Date(row.createdAt).toLocaleString(),
                },
              ]"
              row-key="key"
            />
          </q-tab-panel>

          <q-tab-panel name="activities" class="q-pa-none">
            <q-table
              v-if="activities"
              :rows="activities"
              :columns="[
                { name: 'key', align: 'left', label: 'Key', field: 'key' },
                {
                  name: 'elementId',
                  align: 'left',
                  label: 'Element ID',
                  field: 'elementId',
                },
                {
                  name: 'processInstanceKey',
                  align: 'left',
                  label: 'Process Instance Key',
                  field: 'processInstanceKey',
                },
                {
                  name: 'state',
                  align: 'left',
                  label: 'State',
                  field: 'state',
                },
                {
                  name: 'createdAt',
                  align: 'left',
                  label: 'Created At',
                  field: (row) => new Date(row.createdAt).toLocaleString(),
                },
              ]"
              row-key="key"
            />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import {
  ProcessInstancesApi,
  ProcessDefinitionsApi,
  ApiClient,
} from "src/api-client/src";
import BpmnIoDiagram from "src/components/BpmnIoDiagram.vue";

const processInstancesApi = ref(null);
const processDefinitionsApi = ref(null);
const processInstance = ref({});
const processDefinition = ref({});
const activities = ref([]);
const jobs = ref([]);
const route = useRoute();
const tab = ref("jobs");

onMounted(async () => {
  console.log("ProcessInstanceDetail");
  const client = new ApiClient("/api");
  processInstancesApi.value = new ProcessInstancesApi(client);
  processDefinitionsApi.value = new ProcessDefinitionsApi(client);

  try {
    processInstancesApi.value.getProcessInstance(
      route.params.processInstanceKey,
      (err, res) => {
        if (err) {
          console.log(err);
        }
        processInstance.value = res;
        // Load process definition
        processDefinitionsApi.value.getProcessDefinition(
          processInstance.value.processDefinitionKey,
          (err, res) => {
            if (err) {
              console.log(err);
            }
            processDefinition.value = res;
          }
        );

        // Load activities
        processInstancesApi.value.getActivities(
          route.params.processInstanceKey,
          (err, res) => {
            if (err) {
              console.log(err);
            }
            activities.value.push(...res.items);
          }
        );

        // Load jobs
        processInstancesApi.value.getJobs(
          route.params.processInstanceKey,
          (err, res) => {
            if (err) {
              console.log(err);
            }
            jobs.value.push(...res.items);
          }
        );
      }
    );
  } catch (err) {
    console.log(err);
  }
});
</script>
