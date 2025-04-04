<template>
  <q-layout view="hHh Lpr fff">
    <q-header elevated class="text-white">
      <q-toolbar>
        <q-img
          class="gt-xs q-mr-xs"
          src="/logo.png"
          style="height: 50px; width: 50px"
        />
        <q-toolbar-title> ZenBPM Showcase </q-toolbar-title>

        <q-btn
          v-for="link in linksList"
          :key="link.title"
          stretch
          flat
          :label="link.title"
          :to="link.to"
          :icon="link.icon"
        >
        </q-btn>
        <q-space />

        <!-- <div>Quasar v{{ $q.version }}</div> -->
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";

defineOptions({
  name: "MainLayout",
});

const linksList = [
  {
    title: "Tasklist",
    caption: "tasklist",
    to: "/tasklist",
  },
  {
    title: "Process Definitions",
    caption: "process-definitions",
    // icon: "description",
    to: "/process-definitions",
  },
  {
    title: "Process Instances",
    caption: "process-instances",
    // icon: "assignment_turned_in",
    to: "/process-instances",
  },
];

function onMenuClick() {
  console.log("Menu clicked");
}
</script>
