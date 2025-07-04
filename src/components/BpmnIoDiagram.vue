<template>
  <div ref="diagramRef" style="height: 500px"></div>
</template>

<script setup>
import BpmnViewer from "bpmn-js/lib/NavigatedViewer";
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
  history: {
    type: Array,
    default: () => [],
  },
});

const diagramRef = ref(null);
const bpmnViewer = ref(null);

function applyHistory() {
  if (!bpmnViewer.value || !props.history) return;
  var canvas = bpmnViewer.value.get("canvas");
  for (let i = 0; i < props.history.length; i++) {
    canvas.addMarker(props.history[i].elementId, "highlighted");
    canvas.addMarker(props.history[i].elementId, "element-completed");
  }
}

function applyOverlays() {
  // access viewer components
  var canvas = bpmnViewer.value.get("canvas");
  var overlays = bpmnViewer.value.get("overlays");

  // zoom to fit full viewport
  canvas.zoom("fit-viewport");

  // attach an overlay to a node
  for (const [bpmnId, data] of Object.entries(props.overlays)) {
    if (
      data.bpmnElementType !== "SEQUENCE_FLOW" &&
      data.state === "ELEMENT_ACTIVATED"
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

  const xml =
    props.diagramData[0] === "<"
      ? props.diagramData
      : new TextDecoder().decode(
          Uint8Array.from(atob(props.diagramData), (c) => c.charCodeAt(0))
        );
  await bpmnViewer.value.importXML(xml);
  applyOverlays();
  applyHistory();
});

watch(
  () => props.history,
  () => applyHistory()
);
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
.highlighted .djs-visual polygon,
.highlighted .djs-visual circle {
  stroke: var(--q-positive) !important;
}
.highlighted .djs-visual path {
  stroke: var(--q-positive) !important;
  /* fill: var(--q-primary) !important; */
}
</style>
