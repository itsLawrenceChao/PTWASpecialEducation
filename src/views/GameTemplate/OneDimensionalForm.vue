<template>
  <div ref="container" class="container"></div>
</template>

<script>
import { getGameAssets } from "@/utilitys/get_assets.js";
import * as canvasTools from "@/utilitys/canvasTools.js";
import { defineAsyncComponent } from "vue";
export default {
  components: {},

  props: {
    GameData: {
      type: Object,
      required: true,
    },
    GameConfig: {
      type: Object,
      required: true,
    },
    ID: {
      type: String,
      required: true,
    },
  },

  emits: ["play-effect", "add-record", "next-question"],

  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="css" scoped>
.container {
  height: 100%;
  width: 100%;
  background-color: gray;
}
</style>
