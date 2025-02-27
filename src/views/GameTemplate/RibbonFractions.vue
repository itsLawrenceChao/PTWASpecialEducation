<template>
  <div class="container">
    <div class="question">
      {{ GameData.Question }}
    </div>
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
        <div v-for="i in GameData.Option" :key="i - 1" class="rowContainer">
          <button :style="btnStyle[i - 1]" @click="handleClick(i - 1)">✔</button>
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
      btnStyle: [],
      selected: [],
      color: "lightblue",
    };
  },

  beforeMount() {
    this.setMap();
    this.setRibbonStyle();
    this.setbtnStyle();
    console.log(this.correctOptionID);
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
      if (this.GameData.Color) this.color = this.GameData.Color;
      for (let j = 0; j < this.GameData.Denominator; ++j) {
        let style = {
          backgroundColor: this.color,
        };
        if (j == 0) style.borderLeft = "1px black solid";
        else if (j == this.GameData.Denominator - 1)
          style.borderRight = "1px black solid";
        this.wholeRibbonStyle.push(style);
      }

      for (let i = 0; i < this.GameData.Option; ++i) {
        let row = [];
        let coloredRibbon = this.randomCombination(
          this.GameData.Denominator,
          this.map[i]
        );
        for (let j = 0; j < this.GameData.Denominator; ++j) {
          let style = {};
          if (j == 0) style.borderLeft = "1px black solid";
          else if (j == this.GameData.Denominator - 1)
            style.borderRight = "1px black solid";

          if (coloredRibbon.includes(j)) style.backgroundColor = this.color;
          row.push(style);
        }
        this.ribbonStyle.push(row);
      }
    },
    setbtnStyle() {
      for (let i = 0; i < this.GameData.Option; ++i) {
        let style = {
          color: "transparent",
        };
        this.btnStyle.push(style);
        this.selected.push(false);
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
    handleClick(i) {
      if (this.btnStyle[i].color == "black") {
        this.btnStyle[i].color = "transparent";
        this.selected[i] = false;
      } else {
        this.btnStyle[i].color = "black";
        this.selected[i] = true;
      }
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
  border-right: 2px black dashed;
  border-top: 1px black solid;
  border-bottom: 1px black solid;
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
  border: 2px black solid;
}
</style>
