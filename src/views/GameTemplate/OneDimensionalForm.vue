<template>
  <div ref="container" class="container">
    <div class="title">FORM TITLE</div>
    <div class="form">
      <div class="column">
        <div class="title">TITLE</div>
        <div class="formElements">
          <div v-for="i in 6" :key="i - 1">{{ i }}</div>
        </div>
      </div>
      <div class="column">
        <div class="title">TITLE</div>
        <div class="formElements">
          <div v-for="i in 6" :key="i - 1">{{ i }}</div>
        </div>
      </div>
    </div>
  </div>
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
  font-size: 2rem;
}
.form {
  height: 50%;
  width: 100%;
  background-color: white;
  display: flex;
}
.column {
  flex: 1;
  padding-left: 5%;
  padding-right: 5%;
}
.title {
  text-align: center;
  width: 100%;
}
.formElements {
  font-size: 2rem;
  display: grid;
  grid-template-columns: repeat(3, auto);
  gap: 2%;
}
</style>
