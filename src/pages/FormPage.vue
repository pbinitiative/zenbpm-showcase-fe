<template>
  <q-drawer side="left" show-if-above bordered :width="350" :breakpoint="500">
    <q-scroll-area class="fit">
      <q-tabs v-model="tab" inline-label class="shadow-2">
        <q-tab name="tasks" label="Tasks" />
        <q-tab name="processes" label="Processes" />
      </q-tabs>
      <q-list separator v-if="tab == 'tasks'">
        <template v-if="tasks.length > 0">
          <TaskItem
            v-for="task in tasks"
            :key="task.id"
            :task="task"
            :metadata="tasksMetadata.find((t) => t.id == task.elementId)"
            :active-task="activeTask"
            @click="selectTask(task)"
          />
        </template>
        <q-item v-else>
          <q-item-section>
            <q-item-label class="text-grey text-italic"
              >No tasks found</q-item-label
            >
          </q-item-section>
        </q-item>
      </q-list>
      <q-list separator v-else-if="tab == 'processes'">
        <template v-if="processes.length > 0">
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
        </template>
        <q-item v-else>
          <q-item-section>
            <q-item-label class="text-grey text-italic"
              >No processes found</q-item-label
            >
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
  <div>
    <TaskHeader
      v-if="activeTask"
      :task="activeTask"
      :metadata="tasksMetadata.find((t) => t.id == activeTask.elementId)"
    />
    <ProcessHeader
      v-else-if="activeProcess"
      :process="
        processesMetadata.find((p) => p.id == activeProcess.bpmnProcessId)
      "
    />

    <div>
      <div v-if="currentFormComponent">
        <component
          :is="currentFormComponent"
          v-model="formData"
          @submit="submit"
        />
      </div>
      <q-banner v-else class="q-ma-md bg-primary text-white">
        <template v-slot:avatar>
          <q-icon name="warning" />
        </template>
        No form selected. Please select a form in the left menu.
      </q-banner>
    </div>
  </div>
</template>

<script setup>
import {
  defineAsyncComponent,
  watch,
  ref,
  onMounted,
  shallowRef,
  compile,
  getCurrentInstance,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import TaskItem from "src/components/tasklist/TaskItem.vue";
import ProcessItem from "src/components/tasklist/ProcessItem.vue";
import TaskHeader from "src/components/tasklist/TaskHeader.vue";
import ProcessHeader from "src/components/tasklist/ProcessHeader.vue";
import { loadExtSFC } from "src/sfc-loader";

import {
  ProcessDefinitionsApi,
  ProcessInstancesApi,
  JobsApi,
  JobState,
} from "src/api-client";

import config from "../config/config";

const processInstancesApi = new ProcessInstancesApi(config);
const processDefinitionsApi = new ProcessDefinitionsApi(config);
const jobsApi = new JobsApi(config);

const route = useRoute();
const router = useRouter();

const tab = ref("tasks");
const formData = ref({});

const tasks = ref([]);

const getTaskByKey = (key) => {
  return tasks.value.find((task) => task.key == key);
};

const getProcessById = (id) => {
  return processes.value.find((process) => process.bpmnProcessId == id);
};

const activeTask = ref(null);
const activeProcess = ref(null);
const processes = ref([]);
const processesMetadata = ref([]);

const tasksMetadata = ref([]);

const currentFormComponent = shallowRef(null);
onMounted(async () => {
  const data = await fetch("forms/metadata").then((r) => r.json());
  processesMetadata.value = data.processes;
  tasksMetadata.value = data.tasks;

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

  await loadUserTasks();
  setCurrentComponent();
});

const selectTask = (task) => {
  router.push({
    path: `/tasklist/${task.key}`,
  });
};

const loadUserTasks = async () => {
  tasks.value.length = 0;
  await jobsApi.getJobs("user-task-type", JobState.Active).then((res) => {
    tasks.value.push(...res.data.partitions[0].items);
  });
};

const submit = (data) => {
  formData.value = data;
  console.log(formData.value);
  if (activeProcess.value) {
    processInstancesApi
      .createProcessInstance({
        processDefinitionKey: String(activeProcess.value.key),
        variables: formData.value,
      })
      .then((res) => {
        console.log(res);
        tab.value = "tasks";
        loadUserTasks();
        formData.value = {};
        router.push(`/tasklist/`);
      })
      .catch((err) => {
        console.log(err);
      });
  } else if (activeTask.value) {
    jobsApi
      .completeJob({ jobKey: activeTask.value.key, variables: formData.value })
      .then(() => {
        tab.value = "tasks";
        loadUserTasks();
        router.push(`/tasklist/`);
      })
      .catch((err) => {
        console.log(err);
      });
  }
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
  currentFormComponent.value = defineAsyncComponent(async () => {
    if (action == "start") {
      activeTask.value = null;
      const process = getProcessById(id);
      if (!process) {
        activeProcess.value = null;
      } else {
        activeProcess.value = process;
        try {
          // return await debugLoadSFC(
          //   "/forms/components/" + `${process.bpmnProcessId}-start-form.vue`
          // );
          return await loadExtSFC(`${process.bpmnProcessId}-start-form.vue`);
        } catch (error) {
          console.log(error);
          currentFormComponent.value = null;
        }
      }
    }
    activeProcess.value = null;
    const task = getTaskByKey(id);
    if (!task) {
      activeTask.value = null;
      currentFormComponent.value = null;
    } else {
      activeTask.value = task;
      formData.value = task.variables;
      try {
        const formId = task.elementId.substring(
          0,
          task.elementId.lastIndexOf("-")
        );

        return await loadExtSFC(`${formId}-form.vue`);
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
