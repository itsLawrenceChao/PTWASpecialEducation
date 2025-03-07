<template>
  <table class="NumberBoard">
    <tr class="EachRow">
      <td v-for="unit in Unit" class="UnitEachBlanket">{{ unit }}</td>
    </tr>
    <tr class="EachRow">
      <td
        v-for="(number, index) in numbers"
        class="EachBlanket"
        :class="{ clickable: isInput }"
        @click="isInput ? incrementDigit(index) : null"
      >
        {{ number }}
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  name: "NumberBoard",
  props: {
    Data: {
      type: Object,
      required: true,
    },
  },
  emits: ["replyAnswer"],
  data() {
    return {
      numbers: [],
      Unit: null,
      isInput: this.Data.isInput || false,
    };
  },
  created() {
    this.Unit = this.Data.Unit;
    this.numbers = this.Data.Number;
    if (typeof this.Data.Number === "number") {
      this.numbers = this.Data.Number.toString().split("");
    }
    if (this.Data.Unit.length != this.numbers.length) {
      if (this.Data.Unit.length > this.numbers.length) {
        let diff = this.Data.Unit.length - this.numbers.length;
        for (let i = 0; i < diff; i++) {
          this.numbers.unshift(" ");
        }
      } else {
        let diff = this.numbers.length - this.Data.Unit.length;
        for (let i = 0; i < diff; i++) {
          this.Unit.unshift(" ");
        }
      }
    }

    if (this.isInput) {
      for (var i in this.numbers) {
        this.numbers[i] = "0";
      }
    }
  },
  methods: {
    incrementDigit(index) {
      if (!this.isInput) return;

      this.numbers[index] = (
        (parseInt(this.numbers[index]) + 1) %
        10
      ).toString();
      this.checkAnswer();
    },
    checkAnswer() {
      if (!this.isInput) return;

      let check = true;
      const correctAnswer = this.Data.Number.toString().split("");
      for (var i = correctAnswer.length - 1; i >= 0; i--) {
        if (correctAnswer[i] !== this.numbers[i]) {
          check = false;
          break;
        }
      }
      this.$emit("replyAnswer", check);
    },
  },
};
</script>

<style scoped lang="scss">
.NumberBoard {
  height: auto;
  border: solid;
  border-color: blue;
  display: inline-block; // 使用 inline-block 讓表格根據內容自動調整大小
  max-width: fit-content;
  margin: 0 auto;
}

.EachRow {
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-around;
  font-family: "YuanQuan";

  td {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    border: solid;
  }
}

.UnitEachBlanket {
  font-size: 1.5em;
  text-align: center;
  writing-mode: vertical-rl; /* 直排，從右到左 */
  text-orientation: upright; /* 保持字體直立 */
  letter-spacing: 0.2em;
}

.EachBlanket {
  font-size: 1.5em; // 增大字體大小
  text-align: center;

  &.clickable {
    cursor: pointer;
    user-select: none;

    &:hover {
      background-color: #f0f0f0;
    }
  }
}
</style>
