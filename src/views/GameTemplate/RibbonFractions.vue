<template>
  <div class="container">
    <div class="question">{{ GameData.Question }}</div>
    <div class="answerArea">
      <div class="ribbons">
        <div v-for="i in 10" :key="i - 1" class="rowContainer">
          <div v-for="j in 5" :key="j - 1" class="ribbonPart"></div>
        </div>
      </div>
      <div class="checkBoxes">
        <div class="rowContainer">這是一條緞帶。</div>
        <div v-for="i in 9" :key="i" class="rowContainer">
          <button>✔</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
  },

  emits: ["play-effect", "add-record", "next-question"],

  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style scoped lang="scss">
.container {
  height: 100%;
  width: 100%;
}
.question {
  font-size: 2rem;
}
.answerArea {
  padding: 2%;
  width: 100%;
  height: 90%;
  display: flex;
  font-size: 2rem;
}
.ribbons {
  width: 70%;
  height: 100%;
}
.ribbonPart {
  width: 20%;
  height: 80%;
  background-color: lightblue;
  border-right: 2px black dashed;
}
.checkBoxes {
  width: 28%;
  height: 100%;
  margin-left: auto;
}
.rowContainer {
  height: 10%;
  width: 100%;
  display: flex;
}
.rowContainer button {
  font-size: 1rem;
  height: 80%;
  aspect-ratio: 1;
  background-color: transparent;
  color: transparent;
  border: 2px black solid;
}
</style>
