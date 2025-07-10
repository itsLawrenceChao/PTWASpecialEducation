<template>
  <div class="game-container">
    <template v-if="gameLevel === 1">
      <Level1
        ref="level1"
        :ID="ID"
        :imageData="imageData"
        :markdownData="markdownData"
        :questions="questions"
        @play-effect="$emit('play-effect', $event)"
        @next-question="$emit('next-question')"
      />
    </template>
    <template v-if="gameLevel === 2">
      <Level2
        ref="level2"
        :ID="ID"
        :GameData="GameData"
        @play-effect="$emit('play-effect', $event)"
        @next-question="$emit('next-question')"
      />
    </template>
    <template v-if="gameLevel === 3">
      <Level3
        ref="level3"
        :ID="ID"
        :GameData="GameData"
        :imageData="imageData"
        :markdownData="markdownData"
        :boxes="boxes"
        @play-effect="$emit('play-effect', $event)"
        @next-question="$emit('next-question')"
      />
    </template>
    <div class="button-container">
      <button class="submit-btn" @click="submitAnswer">送出答案</button>
    </div>
  </div>
</template>

<script>
import Level1 from "./games/MA3132/Level1.vue";
import Level2 from "./games/MA3132/Level2.vue";
import Level3 from "./games/MA3132/Level3.vue";

export default {
  name: "MA3132",
  components: {
    Level1,
    Level2,
    Level3,
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
  emits: ["play-effect", "next-question"],
  data() {
    return {
      imageData: this.GameData.imageData,
      markdownData: this.GameData.markdownData,
      questions: this.GameData.Questions,
      gameLevel: this.GameData.GameLevel,
      boxes: this.GameData.Boxes,
    };
  },
  methods: {
    submitAnswer() {
      const levelComponent = this.$refs[`level${this.gameLevel}`];
      if (levelComponent) {
        levelComponent.submitAnswer();
      }
    },
  },
};
</script>

<style scoped lang="scss">
.game-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: $gap--small;
}

.button-container {
  display: flex;
  justify-content: center;
  padding: $padding--small;
}

.submit-btn {
  background-color: $submit-color;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1em;
  transition: background-color 0.3s;

  &:hover {
    background-color: darken($submit-color, 10%);
  }
}
</style>
