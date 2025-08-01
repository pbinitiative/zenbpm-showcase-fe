<template>
  <q-dialog v-model="showDialog">
    <q-card style="min-width:600px">
    <q-card-section
        class="row items-center q-pb-none"
        style="position: sticky; top: 0; z-index: 1000; background-color: white;"
      >
        <div class="text-h6">Evaluate Decision</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input
          v-model="variables"
          dense
          type="textarea"
          autofocus
          label="Enter JSON input"
          :error="jsonError"
          :error-message="jsonError ? 'Invalid JSON format' : ''"
        />
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn label="Evaluate" color="primary" @click="evaluate" :loading="loading"/>
      </q-card-actions>
      <q-card-section>
        <div v-if="result !== undefined" class="q-mt-md">
          <div class="text-subtitle2">Matched Rules:</div>
          <div>{{matchedRules.join(", ")}}</div>
          <div class="text-subtitle2">Result:</div>
          <pre class="bg-grey-2 q-pa-sm">{{ JSON.stringify(result, null, 2) }}</pre>
        </div>
        <div v-if="error" class="q-mt-md">
          <div class="text-subtitle2">Error:</div>
          <pre class="bg-red-2 q-pa-sm">{{ error }}</pre>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { onMounted, ref } from "vue";

import config from "../../config/config";
import { DecisionEvaluationApi } from "src/api-client";

const decisionEvaluationApi = ref(null);
const variables = ref("");
const loading = ref(false);
const result = ref(undefined);
const error = ref(null);
const jsonError = ref(false);
const showDialog = ref(false);
const decisionId = ref("");
const decisionDefinitionKey = ref("");
const matchedRules = ref([]);

onMounted(() => {
  decisionEvaluationApi.value = new DecisionEvaluationApi(config);
})

const updateVariables = (value) => {
  variables.value = value;
};
const evaluate = async () => {
  loading.value = true;
  result.value = undefined;
  error.value = null;
  matchedRules.value = [];
  if (!isJsonString(variables.value)) {
    jsonError.value = true;
    loading.value = false;
    return;
  } else {
    jsonError.value = false;
  }
  decisionEvaluationApi.value.evaluateDecision({
    decisionId: decisionId.value,
    variables: JSON.parse(variables.value),
    decisionDefinitionKey: decisionDefinitionKey.value,
  })
    .then(res => {
      if (res.status === 200) {
        try {
          result.value = res.data.decisionOutput;
          res.data.evaluatedDecisions.forEach(decision => {
            decision.matchedRules.forEach(rule => {
              matchedRules.value.push(rule.ruleIndex);
            })
          })
        } catch (e){
          error.value = "Unable to parse result variables: " + e.message;
        }
      } else {
        error.value = "Error Evaluating Rule status: " + res.status + "" + " message: " + result.value;
      }
      loading.value = false;
    })
    .catch(err => {
      console.log(err);
      error.value = err.response.data;
      loading.value = false;
    })
}

const open = (activeDecisionId, definitionKey) =>{
  decisionId.value = activeDecisionId;
  showDialog.value = true;
  decisionDefinitionKey.value = definitionKey;
}
const close = () =>{
  showDialog.value = false;
}
defineExpose({open})

const isJsonString = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

</script>
