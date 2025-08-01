<template>
  <div class="row">
    <div class="col-10" ref="diagramRef" style="height: 500px"></div>
    <div class="col-2" ref="propertiesRef"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import DmnJS from "dmn-js/lib/Modeler";
import "dmn-js/dist/assets/diagram-js.css";
import "dmn-js/dist/assets/dmn-js-shared.css";
import "dmn-js/dist/assets/dmn-js-drd.css";
import "dmn-js/dist/assets/dmn-js-decision-table.css";
import "dmn-js/dist/assets/dmn-js-decision-table-controls.css";
import "dmn-js/dist/assets/dmn-js-literal-expression.css";
import "dmn-js/dist/assets/dmn-font/css/dmn.css";
import "dmn-js/dist/assets/dmn-font/css/dmn.css";
import { DmnPropertiesPanelModule, DmnPropertiesProviderModule } from "dmn-js-properties-panel";
import "dmn-js-properties-panel/dist/assets/properties-panel.css";

const props = defineProps({
  diagramData: {
    type: String,
    required: false,
  },
});

const diagramRef = ref(null);
const propertiesRef = ref(null);
const dmnEditor = ref(null);

const getXml = async () => {
  if (!dmnEditor.value) return null;
  const { xml } = await dmnEditor.value.saveXML({ format: true });
  return xml;
};

defineExpose({
  getXml,
});

onMounted(async () => {
  dmnEditor.value = new DmnJS({
    container: diagramRef.value,
    width: "100%",
    height: "500px",
    keyboard: {
      bindTo: window,
    },
    drd: {
      propertiesPanel: {
        parent: propertiesRef.value,
      },
      additionalModules: [
        DmnPropertiesPanelModule,
        DmnPropertiesProviderModule,
      ],
    },
  });
  const xml =
    props.diagramData[0] === "<"
      ? props.diagramData
      : new TextDecoder().decode(
        Uint8Array.from(atob(props.diagramData), (c) => c.charCodeAt(0))
      );
  await dmnEditor.value.importXML(xml);
});
</script>
