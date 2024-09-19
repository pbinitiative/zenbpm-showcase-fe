<template>
  <div ref="diagramRef" style="height: 600px"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import BpmnViewer from "bpmn-js";

const props = defineProps({
  diagramData: {
    type: String,
    required: true,
  },
});

const diagramRef = ref(null);

onMounted(async () => {
  const bpmnViewer = new BpmnViewer({
    container: diagramRef.value,
  });

  const xml = atob(props.diagramData);
  await bpmnViewer.importXML(xml);
  // access viewer components
  var canvas = bpmnViewer.get("canvas");
  var overlays = bpmnViewer.get("overlays");

  // zoom to fit full viewport
  canvas.zoom("fit-viewport");

  // attach an overlay to a node
  overlays.add("SCAN_OK", "note", {
    position: {
      bottom: 0,
      right: 0,
    },
    html: '<div class="diagram-note">Mixed up the labels?</div>',
  });

  // add marker
  canvas.addMarker("SCAN_OK", "needs-discussion");
});
</script>
