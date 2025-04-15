<template>
  <table class="number-board">
    <tr class="number-board__row">
      <td
        v-for="unit in Unit"
        class="number-board__cell number-board__cell--unit"
      >
        {{ unit }}
      </td>
    </tr>
    <tr class="number-board__row">
      <td
        v-for="(number, index) in numbers"
        class="number-board__cell"
        :class="{ 'number-board__cell--clickable': isInput }"
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
.number-board {
  width: 100%;
  height: 100%;
  display: table;
  border: solid;
  border-color: blue;
  table-layout: fixed;
  border-collapse: collapse;
  max-width: 350px;

  &__row {
    width: 100%;
    display: table-row;
    font-family: "YuanQuan";
    box-sizing: border-box;
  }

  &__cell {
    display: table-cell;
    text-align: center;
    vertical-align: middle;
    border: solid;
    box-sizing: border-box;
    font-size: 1.2em;

    &--unit {
      font-size: 1.5em;
      text-align: center;
      min-height: 2em;
      overflow: hidden;
      word-break: break-all;
      writing-mode: vertical-rl;
      text-orientation: upright;
    }

    &--clickable {
      cursor: pointer;
      user-select: none;

      &:hover {
        background-color: #f0f0f0;
      }
    }
  }
}
</style>
