<template>
  <q-layout view="hHh Lpr fff">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="onMenuClick"
        />

        <q-toolbar-title> GoBPM Showcase </q-toolbar-title>

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

        <div>Quasar v{{ $q.version }}</div>
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
    title: "Process Definitions",
    caption: "process-definitions",
    icon: "description",
    to: "/process-definitions",
  },
  {
    title: "Process Instances",
    caption: "process-instances",
    icon: "assignment_turned_in",
    to: "/process-instances",
  },
];

function onMenuClick() {
  console.log("Menu clicked");
}
</script>
