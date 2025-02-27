<template>
  <div class="container">
    <div class="question">{{ GameData.Question }}</div>
    <div class="answerArea">
      <div class="ribbons">
        <div class="rowContainer">
          <div
            v-for="j in GameData.Denominator"
            :key="j - 1"
            class="ribbonPart"
            :style="wholeRibbonStyle[j - 1]"
          ></div>
        </div>

        <div v-for="i in GameData.Option" :key="i - 1" class="rowContainer">
          <div
            v-for="j in GameData.Denominator"
            :key="j - 1"
            class="ribbonPart"
            :style="ribbonStyle[i - 1][j - 1]"
          ></div>
        </div>
      </div>
      <div class="checkBoxes">
        <div class="rowContainer">這是一條緞帶。</div>
        <div v-for="i in GameData.Option" :key="i" class="rowContainer">
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
    return {
      map: [],
      wholeRibbonStyle: [],
      ribbonStyle: [],
      color: "lightblue",
    };
  },

  beforeMount() {
    this.setMap();
    this.setRibbonStyle();
  },

  methods: {
    setMap() {
      this.correctOptionID = this.randomCombination(
        this.GameData.Option,
        this.GameData.CorrectOption
      );
      for (let i = 0; i < this.GameData.Option; ++i) {
        if (this.correctOptionID.includes(i)) this.map.push(this.GameData.Numerator);
        else {
          let random;
          do {
            random = Math.ceil(Math.random() * this.GameData.Denominator);
          } while (random == this.GameData.Numerator);
          this.map.push(random);
        }
      }
    },
    setRibbonStyle() {
      for (let j = 0; j < this.GameData.Denominator; ++j) {
        let style = {};
        if (j == this.GameData.Denominator - 1) style.border = "none";
        this.wholeRibbonStyle.push(style);
      }

      for (let i = 0; i < this.GameData.Option; ++i) {
        let row = [];
        for (let j = 0; j < this.GameData.Denominator; ++j) {
          let style = {};
          if (j == this.GameData.Denominator - 1) style.border = "none";
          row.push(style);
        }
        this.ribbonStyle.push(row);
      }
    },
    randomCombination(n, r) {
      let combination = [];
      do {
        let random = Math.floor(Math.random() * n);
        if (!combination.includes(random)) combination.push(random);
      } while (combination.length < r);
      return combination;
    },
  },
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
