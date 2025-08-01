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
              <q-item class="row">
                <q-item-section>
                  <q-item-label>Key</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption>{{ processInstance.key }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="row">
                <q-item-section>
                  <q-item-label>Created at</q-item-label>
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
                    mapState(processInstance.state)
                  }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>Process definition key</q-item-label>
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
              :history="history"
              :incidents="incidents"
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
          <q-tab name="history" label="History" />
          <q-tab name="incidents" label="Incidents" />
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
                  name: 'type',
                  align: 'left',
                  label: 'Job type',
                  field: 'type',
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
                  field: (row) => mapState(row.state),
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
                    v-if="props.row.state === 'ActivityStateActive'"
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

          <q-tab-panel name="history" class="q-pa-none">
            <q-table
              v-if="history"
              :rows="history"
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
                  name: 'createdAt',
                  align: 'left',
                  label: 'Created At',
                  field: (row) => new Date(row.createdAt).toLocaleString(),
                },
              ]"
              row-key="key"
            />
          </q-tab-panel>

          <q-tab-panel name="incidents" class="q-pa-none">
            <q-table
              v-if="incidents"
              :rows="incidents"
              :columns="[
                { name: 'key', align: 'left', label: 'Key', field: 'key' },
                {
                  name: 'elementId',
                  align: 'left',
                  label: 'Element ID',
                  field: 'elementId',
                },
                {
                  name: 'message',
                  align: 'left',
                  label: 'Message',
                  field: 'message'
                },
                {
                  name: 'createdAt',
                  align: 'left',
                  label: 'Created At',
                  field: (row) => new Date(row.createdAt).toLocaleString(),
                },
                {
                  name: 'resolvedAt',
                  align: 'left',
                  label: 'Resolved At',
                  field: (row) =>
                    row.resolvedAt ? new Date(row.resolvedAt).toLocaleString() : '',
                },
                {
                  name: 'actions',
                  label: 'Action',
                },
              ]"
              row-key="key"
            >
              <template v-slot:body-cell-message="props">
                <q-td :props="props">
                  <div>
                    {{ props.row.message.substring(0, 50) + '...' }}
                    <q-tooltip anchor="top middle" self="bottom middle">
                      {{ props.row.message }}
                    </q-tooltip>
                  </div>
                </q-td>
              </template>
              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn
                    v-if="!props.row.resolvedAt"
                    label="Resolve"
                    color="primary"
                    @click="resolve(props.row)"
                  ></q-btn>
                </q-td>
              </template>
            </q-table>
          </q-tab-panel>

          <q-tab-panel name="variables" class="q-pa-none">
            <q-table
              v-if="processInstance.variables"
              :rows="
                Object.keys(processInstance.variables).map((key) => ({
                  key: key,
                  value: mapVariableValue(processInstance.variables[key]),
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
import { useRoute, useRouter } from "vue-router";
import config from "../config/config";

import {
  IncidentsApi,
  JobsApi,
  ProcessDefinitionsApi,
  ProcessInstancesApi,
} from "src/api-client";
import BpmnIoDiagram from "components/diagrams/BpmnIoDiagram.vue";

const processInstancesApi = ref(null);
const processDefinitionsApi = ref(null);
const jobsApi = ref(null);
const incidentApi = ref(null);
const processInstance = ref({});
const processDefinition = ref({});
const activities = ref([]);
const history = ref([]);
const incidents = ref([]);
const jobs = ref([]);
const route = useRoute();
const tab = ref("jobs");
const overlays = ref({});
const $router = useRouter();

onMounted(async () => {
  console.log("ProcessInstanceDetail");
  processInstancesApi.value = new ProcessInstancesApi(config);
  processDefinitionsApi.value = new ProcessDefinitionsApi(config);
  jobsApi.value = new JobsApi(config);
  incidentApi.value = new IncidentsApi(config);

  reload();
});

function reload() {
  try {
    processInstancesApi.value
      .getProcessInstance(route.params.processInstanceKey)
      .then((res) => {
        processInstance.value = res.data;
        // Load process definition
        processDefinitionsApi.value
          .getProcessDefinition(processInstance.value.processDefinitionKey)
          .then((res) => {
            processDefinition.value = res.data;
          })
          .catch((err) => {
            console.log(err);
          });

        // Load activities
        processInstancesApi.value
          .getActivities(route.params.processInstanceKey)
          .then((res) => {
            activities.value = res.data.count === 0 ? [] : res.data.items;

            for (let i = 0; i < activities.value.length; i++) {
              overlays.value[activities.value[i].elementId] = {
                state: activities.value[i].state,
                bpmnElementType: activities.value[i].bpmnElementType,
              };
            }
          })
          .catch((err) => {
            console.log(err);
          });

        // Load history
        processInstancesApi.value
          .getHistory(route.params.processInstanceKey)
          .then((res) => {
            history.value = res.data.count === 0 ? [] : res.data.items;
          })
          .catch((err) => {
            console.log(err);
          });

        // Load incidents
        processInstancesApi.value
          .getIncidents(route.params.processInstanceKey)
          .then((res) => {
            incidents.value = res.data.count === 0 ? [] : res.data.items;

            for (let i = 0; i < incidents.value.length; i++) {
              overlays.value[incidents.value[i].elementId] = {
                state: 'incident',
                bpmnElementType: incidents.value[i].bpmnElementType,
              };
            }
          })
          .catch((err) => {
            console.log(err);
          });

        // Load jobs
        processInstancesApi.value
          .getJobs(route.params.processInstanceKey)
          .then((res) => {
            jobs.value = res.data.items;
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
}

function getVariableTableRows() {
  return JSON.parse(processInstance.value.variables);
}

function mapVariableValue(value) {
  if (typeof value === "object") {
    return JSON.stringify(value);
  } else {
    return value;
  }
}

function complete(job) {
  jobsApi.value
    .completeJob({ jobKey: job.key })
    .then(() => {
      $router.go();
    })
    .catch((err) => {
      console.log(err);
    });
}

function resolve(incident) {

  incidentApi.value
    .resolveIncident(incident.key)
    .then(() => {
      $router.go();
    })
    .catch((err) => {
      console.log(err);
    });
}

function mapState(state) {
  /*
"ACTIVE":       1,
	"COMPENSATED":  2,
	"COMPENSATING": 3,
	"COMPLETED":    4,
	"COMPLETING":   5,
	"FAILED":       6,
	"FAILING":      7,
	"READY":        8,
	"TERMINATED":   9,
	"TERMINATING":  10,
	"WITHDRAWN":    11,
  */
  switch (state) {
    case "1":
      return "ACTIVE";
    case "2":
      return "COMPENSATED";
    case "3":
      return "COMPENSATING";
    case "4":
      return "COMPLETED";
    case "5":
      return "COMPLETING";
    case "6":
      return "FAILED";
    case "7":
      return "FAILING";
    case "8":
      return "READY";
    case "9":
      return "TERMINATED";
    case "10":
      return "TERMINATING";
    case "11":
      return "WITHDRAWN";
    default:
      return state;
  }
}
</script>
