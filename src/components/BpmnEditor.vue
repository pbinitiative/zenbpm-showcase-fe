<template>
  <div class="row">
    <div class="col-10" ref="diagramRef" style="height: 500px"></div>
    <div class="col-2" id="properties"></div>
  </div>
</template>

<script setup>
import Modeler from "bpmn-js/lib/Modeler";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "@bpmn-io/properties-panel/dist/assets/properties-panel.css";
import TokenSimulationModule from 'bpmn-js-token-simulation';
import 'bpmn-js-token-simulation/assets/css/bpmn-js-token-simulation.css';
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  ZeebePropertiesProviderModule,
} from 'bpmn-js-properties-panel';
import zeebeModdle from "zeebe-bpmn-moddle/resources/zeebe";

import { onMounted, onBeforeUnmount, ref } from "vue";

const props = defineProps({
  diagramData: {
    type: String,
    required: false,
  },
});

const diagramRef = ref(null);
// bpmn-js does not support Proxy objects we can not use ref(), it causes user visible errors.
let bpmnEditor = null;

const getXml = async () => {
  if (!bpmnEditor) return null;
  const { xml } = await bpmnEditor.saveXML({ format: true });
  return xml;
};

defineExpose({
  getXml,
});

onMounted(async () => {
  bpmnEditor = new Modeler({
    container: diagramRef.value,
    keyboard: {
      bindTo: window,
    },
    propertiesPanel: {
      parent: '#properties'
    },
    additionalModules: [
      BpmnPropertiesPanelModule,
      BpmnPropertiesProviderModule,
      ZeebePropertiesProviderModule,
      TokenSimulationModule,
    ],
    moddleExtensions: {
      zeebe: zeebeModdle,
    },
  });
  const xml =
    props.diagramData[0] === "<"
      ? props.diagramData
      : new TextDecoder().decode(
        Uint8Array.from(atob(props.diagramData), (c) => c.charCodeAt(0))
      );
  await bpmnEditor.importXML(xml);
});

onBeforeUnmount(() => {
  // Clean up keyboard bindings to avoid not working keyboard
  if (bpmnEditor) {
    const keyboard = bpmnEditor.get('keyboard');
    if (keyboard) {
      keyboard.unbind();
    }
  }
});

</script>
