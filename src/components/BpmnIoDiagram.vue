<template>
  <div ref="diagramRef" style="height: 500px"></div>
</template>

<script setup>
import BpmnViewer from "bpmn-js";
import { onMounted, ref, watch } from "vue";

const props = defineProps({
  diagramData: {
    type: String,
    required: true,
  },
  overlays: {
    type: Object,
    default: () => {},
  },
});

const diagramRef = ref(null);
const bpmnViewer = ref(null);

function applyOverlays() {
  // access viewer components
  var canvas = bpmnViewer.value.get("canvas");
  var overlays = bpmnViewer.value.get("overlays");

  // zoom to fit full viewport
  canvas.zoom("fit-viewport");

  // attach an overlay to a node
  for (const [bpmnId, data] of Object.entries(props.overlays)) {
    if (
      data.bpmnElementType != "SEQUENCE_FLOW" &&
      data.state == "ELEMENT_ACTIVATED"
    ) {
      overlays.add(bpmnId, data.state, {
        position: {
          bottom: 3,
          right: 3,
        },
        html: `<div class="overlay element-active">⌖</div>`,
      });
    }
    canvas.addMarker(bpmnId, "highlighted");
  }
}

onMounted(async () => {
  bpmnViewer.value = new BpmnViewer({
    container: diagramRef.value,
  });

  const xml = atob(props.diagramData);
  await bpmnViewer.value.importXML(xml);
  applyOverlays();
});

watch(
  () => props.overlays,
  () => applyOverlays()
);
</script>

<style>
.overlay {
  color: white;
  font-weight: bold;
  font-size: 14pt;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  width: 22px;
  height: 22px;
}
.element-completed {
  background-color: grey;
}

.element-active {
  background-color: var(--q-positive);
}

.highlighted .djs-visual rect,
.highlighted .djs-visual circle {
  stroke: var(--q-primary) !important;
}
.highlighted .djs-visual path {
  stroke: var(--q-primary) !important;
  fill: var(--q-primary) !important;
}
</style>
