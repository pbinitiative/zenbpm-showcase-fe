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
              :overlays="overlays"
              v-if="processDefinition.bpmnData && activities.length > 0"
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
          <q-tab name="variables" label="Variables" />
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
                { name: 'actions', label: 'Action' },
              ]"
              row-key="key"
            >
              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn
                    v-if="props.row.state == 1"
                    label="Complete"
                    color="primary"
                    @click="complete(props.row)"
                  ></q-btn>
                </q-td>
              </template>
            </q-table>
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

          <q-tab-panel name="variables" class="q-pa-none">
            <q-table
              v-if="processInstance.variableHolder"
              :rows="
                Object.keys(getVariableTableRows()).map((key) => ({
                  key: key,
                  value: getVariableTableRows()[key],
                }))
              "
              :columns="[
                {
                  name: 'key',
                  align: 'left',
                  label: 'Key',
                  field: 'key',
                },
                {
                  name: 'value',
                  align: 'left',
                  label: 'Value',
                  field: 'value',
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
  JobsApi,
} from "src/api-client/src";
import BpmnIoDiagram from "src/components/BpmnIoDiagram.vue";

const processInstancesApi = ref(null);
const processDefinitionsApi = ref(null);
const jobsApi = ref(null);
const processInstance = ref({});
const processDefinition = ref({});
const activities = ref([]);
const jobs = ref([]);
const route = useRoute();
const tab = ref("jobs");
const overlays = ref({});

onMounted(async () => {
  console.log("ProcessInstanceDetail");
  const client = new ApiClient("/api");
  processInstancesApi.value = new ProcessInstancesApi(client);
  processDefinitionsApi.value = new ProcessDefinitionsApi(client);
  jobsApi.value = new JobsApi(client);

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

            for (let i = 0; i < activities.value.length; i++) {
              overlays.value[activities.value[i].elementId] = {
                state: activities.value[i].state,
                bpmnElementType: activities.value[i].bpmnElementType,
              };
            }
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

function getVariableTableRows() {
  return JSON.parse(processInstance.value.variableHolder);
}

function complete(job) {
  jobsApi.value.completeJob({ jobKey: job.key }, (err, res) => {
    if (err) {
      console.log(err);
    }
  });
}
</script>
