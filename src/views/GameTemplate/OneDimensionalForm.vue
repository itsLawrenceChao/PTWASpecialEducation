<template>
  <div ref="container" class="container">
    <div class="title">
      <component
        :is="GameData.FormTitle.Type"
        :Data="{ Text: GameData.FormTitle.Content, Size: 'large' }"
        :ID="ID"
      />
    </div>
    <div class="form">
      <div v-for="(column, index) in GameData.Form" :key="index" class="column">
        <div class="title">
          <component
            :is="column.Title.Type"
            :Data="{ Text: column.Title.Content }"
            :ID="ID"
          />
        </div>
        <div class="formElements">
          <div v-for="i in 6" :key="i - 1">{{ i }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getGameAssets } from "@/utilitys/get_assets.js";
import { defineAsyncComponent } from "vue";
export default {
  components: {
    TextOnly: defineAsyncComponent(() => import("@/components/TextOnly.vue")),
    ImageContainer: defineAsyncComponent(() => import("@/components/ImageContainer.vue")),
  },

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
}
.form {
  height: 50%;
  width: 100%;
  display: flex;
  background-color: lightblue;
}
.column {
  flex: 1;
  padding-left: 5%;
  padding-right: 5%;
}
.title {
  padding: 10px;
  background-color: lightblue;
}
.formElements {
  font-size: 2rem;
  display: grid;
  grid-template-columns: repeat(3, auto);
  gap: 2%;
}
</style>
