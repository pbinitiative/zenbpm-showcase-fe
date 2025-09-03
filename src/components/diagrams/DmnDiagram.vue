<template>
  <div>
    <div ref="diagramRef" ></div>
    <div ref="propertiesRef"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import DmnJS from "dmn-js/lib/Viewer";
import "dmn-js/dist/assets/diagram-js.css";
import "dmn-js/dist/assets/dmn-js-shared.css";
import "dmn-js/dist/assets/dmn-js-drd.css";
import "dmn-js/dist/assets/dmn-js-decision-table.css";
import "dmn-js/dist/assets/dmn-js-decision-table-controls.css";
import "dmn-js/dist/assets/dmn-js-literal-expression.css";
import "dmn-js/dist/assets/dmn-font/css/dmn.css";
import "dmn-js/dist/assets/dmn-font/css/dmn.css";
import "dmn-js-properties-panel/dist/assets/properties-panel.css";


const props = defineProps({
  diagramData: {
    type: String,
    required: true,
  },
  onViewChanged: {
    type: Function,
    required: false,
    default: () => {}
  }
});

const diagramRef = ref(null);
const propertiesRef = ref(null);
// const dmnViewer = ref(null);
let dmnViewer = null;

onMounted(async () => {
  dmnViewer = new DmnJS({
    container: diagramRef.value,
    width: "100%",
    height: "500px",
    keyboard: {
      bindTo: window,
    },
  })
  const xml =
    props.diagramData[0] === "<"
      ? props.diagramData
      : new TextDecoder().decode(
          Uint8Array.from(atob(props.diagramData), (c) => c.charCodeAt(0))
        );
  dmnViewer.importXML(xml);


  dmnViewer._viewsChanged = () => {
    if (dmnViewer._activeView?.type === "decisionTable") {
      const activeView = dmnViewer._activeView;
      const decisionId = activeView && activeView.element ? activeView.element.id : "";
      props.onViewChanged(decisionId);
      return;
    }
    props.onViewChanged("");
  };

//  dmnViewer.on("element.click", (event) => {
//    alert("Decision clicked");
//    if (event.element.type === "dmn:Decision") {
//      props.onViewChanged(event.element.id);
//    }
//  });

});
</script>
