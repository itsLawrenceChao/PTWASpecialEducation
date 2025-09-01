<template>
  <div class="outter-container">
    <div class="left-column">
      <div v-if="GameData.questionText" class="text-area">
        {{ GameData.questionText }}
      </div>
      <div v-if="GameConfig.layout.top" class="game-area--top game-area">
        <component
          :is="GameData.topComponent.Name"
          :Data="GameData.topComponent.Data"
          :ID="ID"
          @replyAnswer="topReply"
        ></component>
      </div>
      <div v-if="GameData.middleText" class="text-area">
        {{ GameData.middleText }}
      </div>
      <div v-if="GameConfig.layout.down" class="game-area--down game-area">
        <component
          :is="GameData.downComponent.Name"
          :Data="GameData.downComponent.Data"
          :ID="ID"
          @replyAnswer="downReply"
        ></component>
      </div>
    </div>
    {{ NowSelect }}
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { getSlotComponentAssets } from "@/utilitys/get_assets.js";
import { subComponentsVerifyAnswer as emitter } from "@/utilitys/mitt.js";

export default {
  name: "NumberLock",
  components: {
    TextOnly: defineAsyncComponent(() => import("@/components/TextOnly.vue")),
    Markdown: defineAsyncComponent(() => import("@/components/Markdown.vue")),
    NumberLine: defineAsyncComponent(
      () => import("@/components/NumberLine.vue")
    ),
    NumberLineWithBlank: defineAsyncComponent(
      () => import("@/components/NumberLineWithBlank.vue")
    ),
    DragOnNumberLine: defineAsyncComponent(
      () => import("@/components/DragOnNumberLine.vue")
    ),
    ImageContainer: defineAsyncComponent(
      () => import("@/components/ImageContainer.vue")
    ),
    InteractiveMathEquation: defineAsyncComponent(
      () => import("@/components/InteractiveMathEquation.vue")
    ),
    RepeatImage: defineAsyncComponent(
      () => import("@/components/RepeatImage.vue")
    ),
    DragImages: defineAsyncComponent(
      () => import("@/components/DragImages.vue")
    ),
    NumberBoard: defineAsyncComponent(
      () => import("@/components/NumberBoard.vue")
    ),
    FractionForAnswer: defineAsyncComponent(
      () => import("@/components/FractionForAnswer.vue")
    ),
    NumberLineVisualizer: defineAsyncComponent(
      () => import("@/components/NumberLineVisualizer.vue")
    ),
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
    return {
      NowSelect: null,
      ShowPad: false,
      topComponentsAnswer: false,
      downComponentsAnswer: false,
    };
  },
  computed: {
    Arrow() {
      return getSlotComponentAssets("NumberLineV2", "ArrowRight.svg"); //FIXME
    },
  },
  created() {
    let NewArr = [];
    let cnt = 0;
    for (var i in this.GameData.Data) {
      NewArr.push(this.GameData.Data[i]);
      // Initial the ComponentAnswer
      if (this.GameData.Data[i].Blank == true) {
        this.ComponentsAnswers[cnt] = false;
      }
      cnt++;
      if (i != this.GameData.Data.length - 1) {
        NewArr.push({
          Arrow: true,
        });
        cnt++;
      }
    }
    this.FinalData = NewArr;
    emitter.on("submitAnswer", this.CheckAnswer);
  },
  mounted() {
    if (this.GameConfig.NumberPadAutoDisappear == false) {
      this.SlidAnimation("in");
      this.ShowPad = true;
    }
    document.addEventListener("click", this.NowClick);
  },
  beforeUnmount() {
    emitter.off("submitAnswer", this.CheckAnswer);
  },
  methods: {
    downReply(result) {
      console.log(result);
      this.downComponentsAnswer = result;
    },
    topReply(result) {
      console.log(result);
      this.topComponentsAnswer = result;
    },
    NowClick() {
      if (this.GameConfig.layout.pad == false) return;
      if (document.activeElement.tagName == "INPUT") {
        this.SlidAnimation("in");
        this.ShowPad = true;
        this.NowSelect = document.activeElement;
      } else if (document.activeElement.tagName == "BUTTON") {
        this.NowSelect.focus();
        this.ShowPad = true;
      } else {
        if (this.GameConfig.NumberPadAutoDisappear != false) {
          this.ShowPad = false;
          this.SlidAnimation("out");
        }
      }
    },
    SlidAnimation(action) {
      if (this.GameConfig.layout.pad == false) return;
      if (this.GameConfig.NumberPadAutoDisappear != false) {
        let OutterContainer =
          document.getElementsByClassName("OutterContainer")[0];
        let GameWindows = document.getElementsByClassName("GameWindows")[0];
        if (action == "in") {
          OutterContainer.style.gridTemplateColumns = "4fr 1f";
          GameWindows.style.gridColumn = "1/2";
        } else {
          OutterContainer.style.gridTemplateColumns = "1fr";
          GameWindows.style.gridColumn = "1/2";
        }
      }
    },
    CheckAnswer() {
      console.log(this.topComponentsAnswer, this.downComponentsAnswer);
      if (
        this.GameConfig.layout.top == false ||
        this.GameConfig.checkAnswer.top == false
      ) {
        this.topComponentsAnswer = true;
      }
      if (
        this.GameConfig.layout.down == false ||
        this.GameConfig.checkAnswer.down == false
      ) {
        this.downComponentsAnswer = true;
      }

      let ans = this.topComponentsAnswer && this.downComponentsAnswer;
      console.log(ans);

      if (ans == true) {
        this.$emit("play-effect", "CorrectSound");
        this.$emit("add-record", ["不支援顯示", "不支援顯示", `正確`]);
        this.$emit("next-question");
      } else {
        this.$emit("play-effect", "WrongSound");
        this.$emit("add-record", ["不支援顯示", "不支援顯示", `錯誤`]);
        emitter.emit("checkAnswer");
      }
    },
  },
};
</script>

<style scoped lang="scss">
/* Your component-specific styles go here */
.outter-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 10px;
  border: solid;
  max-height: 79vh;
}
.left-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: $gap--small;
  max-height: 100%;
  overflow-y: auto;

  .text-area {
    flex-shrink: 0;
    padding: $gap--tiny;
    background-color: #dfdfdf;
    border-radius: $border-radius;
    font-size: $text-medium;
    white-space: pre-wrap;
  }
  .game-area {
    min-height: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: $border-radius;
    background-color: #f0f0f0;

    &--top {
      flex-shrink: 0;
    }

    &--down {
      flex: 1;
      min-height: 0;
    }
  }
}
</style>
