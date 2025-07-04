<template>
  <q-card class="q-ma-md">
    <q-card-section>
      <div class="text-h4 q-mb-lg">
        <q-icon name="play_arrow" class="q-mr-sm text-positive" />
        {{ process.name }}
      </div>
      <div class="row q-gutter-xs q-mt-sm">
        <div class="col">
          <q-item-label caption>
            <q-icon name="bookmark_border" class="q-mr-xs" />
            {{ process.agenda }}
          </q-item-label>
        </div>
        <div class="col">
          <q-item-label caption>
            <q-icon name="tag" class="q-mr-xs" />
            {{ process.id }}
          </q-item-label>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  props: {
    process: {
      type: Object,
      required: true,
    },
  },
};
</script>
