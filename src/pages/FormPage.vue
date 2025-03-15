<template>
  <q-drawer side="left" show-if-above bordered :width="350" :breakpoint="500">
    <q-scroll-area class="fit">
      <q-tabs v-model="tab" inline-label class="shadow-2">
        <q-tab name="tasks" label="Tasks" />
        <q-tab name="processes" label="Processes" />
      </q-tabs>
      <q-list separator v-if="tab == 'tasks'">
        <TaskItem
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          :active-task="activeTask"
          @click="selectTask(task)"
        />
      </q-list>
      <q-list separator v-else-if="tab == 'processes'">
        <ProcessItem
          v-for="process in processes"
          :key="process.id"
          :process="process"
          :metadata="
            processesMetadata.find((p) => p.id == process.bpmnProcessId)
          "
          :active-process="activeProcess"
          @click="selectProcess(process)"
        />
      </q-list>
    </q-scroll-area>
  </q-drawer>
  <div>
    <TaskHeader v-if="activeTask" :task="activeTask" />
    <ProcessHeader
      v-else-if="activeProcess"
      :process="
        processesMetadata.find((p) => p.id == activeProcess.bpmnProcessId)
      "
    />

    <div>
      <div v-if="currentFormComponent">
        <component :is="currentFormComponent" v-model="formData" />
        <q-btn
          type="submit"
          label="Odeslat"
          color="primary"
          class="q-ma-xl"
          @click="submit"
        />
      </div>
      <div v-else class="q-pa-md text-negative">Formulář nevybrán.</div>
    </div>
  </div>
</template>

<script setup>
import { defineAsyncComponent, watch, ref, onMounted, shallowRef } from "vue";
import { useRoute, useRouter } from "vue-router";
import TaskItem from "src/components/tasklist/TaskItem.vue";
import ProcessItem from "src/components/tasklist/ProcessItem.vue";
import TaskHeader from "src/components/tasklist/TaskHeader.vue";
import ProcessHeader from "src/components/tasklist/ProcessHeader.vue";

import { ProcessDefinitionsApi, ProcessInstancesApi } from "src/api-client";

import config from "../config/config";

const processInstancesApi = new ProcessInstancesApi(config);
const processDefinitionsApi = new ProcessDefinitionsApi(config);

const route = useRoute();
const router = useRouter();

const tab = ref("tasks");
const formData = ref({});

const tasks = ref([]);

const getTaskById = (id) => {
  return tasks.value.find((task) => task.id == id);
};

const getProcessById = (id) => {
  return processes.value.find((process) => process.bpmnProcessId == id);
};

const activeTask = ref(null);
const activeProcess = ref(null);
const processes = ref([]);
const processesMetadata = ref([
  {
    id: "example-claim-handling",
    name: "Zpracování pojistné události",
    agenda: "Likvidace",
  },
  {
    id: "policy-change-process",
    name: "Změna smlovy",
    agenda: "Likvidace",
  },
]);

const currentFormComponent = shallowRef(null);
onMounted(() => {
  // setCurrentComponent();
  processes.value.length = 0;

  processDefinitionsApi
    .getProcessDefinitions()
    .then((res) => {
      processes.value.push(...res.data.items);
    })
    .catch((err) => {
      console.log(err);
    });
  const originalStringify = JSON.stringify;
  JSON.stringify = function (value, replacer, space) {
    return originalStringify(
      value,
      (key, val) =>
        typeof val === "bigint"
          ? val.toString()
          : replacer
          ? replacer(key, val)
          : val,
      space
    );
  };
});

const selectTask = (task) => {
  router.push({
    path: `/tasklist/${task.id}`,
  });
};

const submit = () => {
  console.log(formData.value);
  processInstancesApi
    .createProcessInstance({
      processDefinitionKey: BigInt(activeProcess.value.key),
      variables: formData.value,
    })
    .then((res) => {
      console.log(res);
      // TODO: redirect to process instance detail page
      router.push(`/tasklist/`);
    })
    .catch((err) => {
      console.log(err);
    });
};

const selectProcess = (process) => {
  router.push({
    path: `/tasklist/${process.bpmnProcessId}/start`,
  });
};

const setCurrentComponent = () => {
  const id = route.params.id;
  const action = route.params.action;
  if (!id) {
    currentFormComponent.value = null;
    activeTask.value = null;
    activeProcess.value = null;
    return;
  }
  currentFormComponent.value = defineAsyncComponent(() => {
    if (action == "start") {
      activeTask.value = null;
      const process = getProcessById(id);
      if (!process) {
        activeProcess.value = null;
      } else {
        activeProcess.value = process;
        try {
          return import(`../forms/${process.bpmnProcessId}-start-form.vue`);
        } catch (error) {
          console.log(error);
          currentFormComponent.value = null;
        }
      }
    }
    activeProcess.value = null;
    const task = getTaskById(id);
    if (!task) {
      activeTask.value = null;
      currentFormComponent.value = null;
    } else {
      activeTask.value = task;
      try {
        return import(`../forms/${task.formKey}-task-form.vue`);
      } catch (error) {
        console.log(error);
        currentFormComponent.value = null;
      }
    }
  });
};
// Ensure the component updates when the route changes
watch(
  () => route.params.id,
  () => {
    setCurrentComponent();
  }
);
</script>
