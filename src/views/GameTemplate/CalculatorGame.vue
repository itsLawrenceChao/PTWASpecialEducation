<template>
  <div class="outter">
    <div class="calculator">
      <div class="unit btn-group" style="flex-direction: row-reverse">
        <div v-for="item in Title" class="units">
          <button v-if="item != null" type="button">
            {{ item }}
          </button>
          <div v-if="item == null" class="space" />
        </div>
      </div>
      <div v-for="(carries, Row) in Carry" class="carry btn-group">
        <div v-for="(items, cnt) in carries" class="carrys">
          <button ref="Carry" :class="{ 'btn--line': CarryLine[Row][cnt] }">
            {{ items }}
            <q-menu anchor="top left" self="bottom left" class="q-menu">
              <div class="btns">
                <button v-close-popup @click="CarryInput(Row, cnt, 0)">
                  0
                </button>
                <button
                  v-for="index in 5"
                  v-close-popup
                  @click="CarryInput(Row, cnt, index)"
                >
                  {{ index }}
                </button>
                <button
                  v-for="index in 5"
                  v-close-popup
                  @click="CarryInput(Row, cnt, index + 5)"
                >
                  {{ index + 5 }}
                </button>
                <button v-close-popup @click="CarryInput(Row, cnt, '/')">
                  /
                </button>
                <button v-close-popup @click="CarryInput(Row, cnt, 'delete')">
                  <q-icon name="bi-trash" />
                </button>
              </div>
            </q-menu>
          </button>
          <button v-if="Num_list[0][cnt] == '.'">.</button>
        </div>
      </div>
      <hr />
      <div class="number-area">
        <div v-for="(items, Row) in Num_list" class="NumberRow btn-group">
          <button v-if="Row != 0">
            {{ Sy_list[Row] }}
            <q-menu
              v-if="SymbolEditable[Row]"
              anchor="top left"
              self="bottom left"
              class="q-menu"
            >
              <div class="btns">
                <button @click="SymbolInput(Row, '+')">+</button>
                <button @click="SymbolInput(Row, '-')">-</button>
              </div>
            </q-menu>
          </button>
          <div class="space" />
          <div class="NumbersContainer btn-group">
            <div
              v-for="(item, Col) in items"
              style="display: flex; justify-content: center"
            >
              <button v-if="Num_list[0][Col] == '.'">.</button>
              <button v-else :class="{ 'btn--line': ButtonLine[Row][Col] }">
                {{ item }}
                <q-menu anchor="top left" self="bottom left" class="q-menu">
                  <div class="btns">
                    <button
                      v-if="NumberEditable[Row][Col]"
                      @click="NumInput(Row, Col, 0)"
                    >
                      0
                    </button>
                    <template v-for="index in 5" :key="index">
                      <button
                        v-if="NumberEditable[Row][Col]"
                        @click="NumInput(Row, Col, index)"
                      >
                        {{ index }}
                      </button>
                    </template>
                    <template v-for="index in 5" :key="index">
                      <button
                        v-if="NumberEditable[Row][Col]"
                        @click="NumInput(Row, Col, index + 5)"
                      >
                        {{ index + 5 }}
                      </button>
                    </template>
                    <button @click="NumInput(Row, Col, '/')">/</button>
                    <button
                      v-if="NumberEditable[Row][Col]"
                      @click="NumInput(Row, Col, 'delete')"
                    >
                      <q-icon name="bi-trash" />
                    </button>
                  </div>
                </q-menu>
              </button>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div class="answer btn-group">
        <div v-for="(item, col) in Ans" class="AnswerContainer">
          <button
            :class="{
              'btn-wrong': WrongAnswerMarkup[col],
              'btn-normal': WrongAnswerMarkup[col] == false,
            }"
            class="answers"
          >
            {{ item }}
            <q-menu anchor="top left" self="bottom left" class="q-menu">
              <div class="btns">
                <button v-close-popup @click="AnsInput(col, 0)">0</button>
                <button
                  v-for="index in 5"
                  v-close-popup
                  @click="AnsInput(col, index)"
                >
                  {{ index }}
                </button>
                <button
                  v-for="index in 5"
                  v-close-popup
                  @click="AnsInput(col, index + 5)"
                >
                  {{ index + 5 }}
                </button>
                <button v-close-popup @click="AnsInput(col, 'delete')">
                  <q-icon name="bi-trash" />
                </button>
              </div>
            </q-menu>
          </button>
          <button v-if="Num_list[0][col - 1] == '.'">.</button>
        </div>
      </div>
      <div class="buttons">
        <button class="submit-btn" @click="CheckAnswer">送出答案</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Calculator",
  display: "calculator",
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
      Num_list: [],
      Sy_list: [],
      Ans: [],
      Carry: [],
      Title: [],
      ButtonLine: [],
      CarryLine: [],
      AnswerLine: [],
      NumberEditable: [],
      SymbolEditable: [],
      WrongAnswerMarkup: [],
      NumberRow: 2,
      NumberAmount: 8,
      DotPosition: 0,
      Data: {},
      CustomeUnit: undefined,
      UnitPreset: {
        UseUnit: "Volume",
        Units: {
          Number: {
            Title: ["個位", "十位", "百位", "千位", "萬位"],
            Total: 5,
          },
          Time: {
            Title: ["秒", null, "分", null, "時", null, "日"],
            Total: 4,
          },
          Weight: {
            Title: ["公克", null, null, "公斤", null, null, "公噸"],
            Total: 4,
          },
          Length: {
            Title: ["毫米", null, "公分", null, "公尺", null, "公里"],
            Total: 4,
          },
          Volume: {
            Title: ["毫升", null, null, "公升", null, null, "公秉"],
            Total: 3,
          },
        },
      },
    };
  },
  created() {
    this.Data = this.GameData;
    this.NumberAmount = this.Data.NumberAmount;
    this.DotPosition = this.Data.decimalPoint;
    this.CustomeUnit = this.Data.CustomeUnit;
    if (this.Data.CustomeUnit != undefined) {
      for (
        var unitIndex = 0;
        unitIndex < this.CustomeUnit.length;
        unitIndex++
      ) {
        this.Title.push(this.CustomeUnit[unitIndex]);
      }
    } else {
      const unitType = this.Data.Unit || this.UnitPreset.UseUnit;
      for (var titleIndex = 0; titleIndex < this.NumberAmount; titleIndex++) {
        this.Title.push(this.UnitPreset.Units[unitType].Title[titleIndex]);
      }
    }
    for (var ansIndex = 0; ansIndex <= this.NumberAmount; ansIndex++) {
      this.Ans.push("");
      this.AnswerLine.push(false);
      this.WrongAnswerMarkup.push(false);
    }

    for (var carryIndex = 0; carryIndex < this.Data.CarryAmount; carryIndex++) {
      let temp = [];
      let templine = [];
      for (var carryCol = 0; carryCol < this.NumberAmount; carryCol++) {
        temp.push("");
        templine.push(false);
      }
      this.Carry.push(temp);
      this.CarryLine.push(templine);
    }
    for (var rowIndex = 0; rowIndex < this.NumberRow; rowIndex++) {
      let temp = [];
      this.Sy_list.push("");
      this.SymbolEditable.push(true);
      let tempNumber = [];
      let tempeditable = [];
      for (var colIndex = 0; colIndex < this.NumberAmount; colIndex++) {
        temp.push("");
        tempNumber.push(false);
        tempeditable.push(true);
      }
      this.Num_list.push(temp);
      this.ButtonLine.push(tempNumber);
      this.NumberEditable.push(tempeditable);
    }
    this.presetCalculator();
    this.shiftNumber();
    // this.findeNumberAfterPoint();
  },
  methods: {
    shiftNumber() {
      for (var i in this.Num_list) {
        for (var j in this.Num_list[i]) {
          if (this.Num_list[i][j] == ".") {
            if (this.Num_list[i].length - 1 - j < this.DotPosition) {
              for (
                var x = 0;
                x < this.DotPosition - (this.Num_list[i].length - 1 - j);
                x++
              ) {
                this.Num_list[i].push("");
              }
            }
          }
        }
      }
    },
    CarryInput(Row, index, num) {
      if (num == "delete") {
        this.Carry[Row][index] = "";
      } else if (num == "/") {
        this.CarryLine[Row][index] = !this.CarryLine[Row][index];
      } else {
        this.Carry[Row][index] = num;
      }
    },
    NumInput(Row, Col, num) {
      if (num == "delete") {
        this.Num_list[Row][Col] = "";
      } else if (num == "/") {
        this.ButtonLine[Row][Col] = !this.ButtonLine[Row][Col];
      } else {
        this.Num_list[Row][Col] = num;
      }
    },
    AnsInput(index, num) {
      this.WrongAnswerMarkup[index] = false;
      if (num == "delete") {
        this.Ans[index] = "";
      } else if (num == "/") {
        this.AnswerLine[index] = !this.AnswerLine[index];
      } else {
        this.Ans[index] = num;
      }
    },
    presetCalculator() {
      for (var i in this.Data.Preset.Number) {
        let temp = this.Num_list[i].length - 1;
        if (
          this.Data.Preset.Symbol != undefined &&
          this.Data.Preset.Symbol != null &&
          this.Data.Preset.Symbol != ""
        ) {
          this.Sy_list[i] = this.Data.Preset.Symbol;
          this.SymbolEditable[i] = false;
        }
        for (var j = this.Data.Preset.Number[i].length - 1; j >= 0; j--) {
          this.Num_list[i][temp] = this.Data.Preset.Number[i][j];
          this.NumberEditable[i][temp] = false;
          temp--;
        }
      }
    },
    SymbolInput(index, num) {
      this.Sy_list[index] = num;
    },
    SetUnit: function (num) {
      if (
        !(this.NumberAmount == 8 && num == 1) &&
        !(this.NumberAmount == 2 && num == -1)
      ) {
        this.NumberAmount = this.NumberAmount + num;
        console.log(this.NumberAmount);
        this.Title = [];
        this.Num_list = [];
        this.Sy_list = [];
        this.Carry = [];
        this.Ans = [];
        this.ButtonLine = [];
        this.CarryLine = [];
        for (
          var newTitleIndex = 0;
          newTitleIndex < this.NumberAmount;
          newTitleIndex++
        ) {
          this.Title.push(
            this.UnitPreset.Units[this.UnitPreset.UseUnit].Title[newTitleIndex]
          );
        }
        for (
          var newAnsIndex = 0;
          newAnsIndex <= this.NumberAmount;
          newAnsIndex++
        ) {
          this.Carry.push([]);
          this.Ans.push([]);
        }
        for (var newRowIndex = 0; newRowIndex < this.NumberRow; newRowIndex++) {
          let temp = [];
          this.Sy_list.push([]);
          for (
            var newColIndex = 0;
            newColIndex < this.NumberAmount;
            newColIndex++
          ) {
            temp.push([]);
          }
          this.Num_list.push(temp);
        }
      }
    },
    CheckAnswer() {
      let AnswerCheck = true;
      for (var numIndex in this.Data.Answer.Number) {
        let temp = this.Num_list[numIndex].length - 1;
        for (
          var answerIndex = this.Data.Answer.Number[numIndex].length - 1;
          answerIndex >= 0;
          answerIndex--
        ) {
          if (
            this.Num_list[numIndex][temp] !=
            this.Data.Answer.Number[numIndex][answerIndex]
          ) {
            AnswerCheck = false;
            console.log("Number Wrong");
          }
          temp--;
        }
      }
      let temp = this.Ans.length - 1;
      for (
        var ansCheckIndex = this.Data.Answer.Answer.length - 1;
        ansCheckIndex >= 0;
        ansCheckIndex--
      ) {
        if (this.Ans[temp] != this.Data.Answer.Answer[ansCheckIndex]) {
          AnswerCheck = false;
          this.WrongAnswerMarkup[temp] = true;
        }
        temp--;
      }
      if (
        this.Data.Answer.Carry != undefined &&
        this.Data.Answer.Carry != null &&
        this.Data.Answer.Carry != []
      ) {
        for (var carryCheckIndex in this.Data.Answer.Carry) {
          let temp = this.Carry[carryCheckIndex].length - 1;
          for (
            var carryColIndex =
              this.Data.Answer.Carry[carryCheckIndex].length - 1;
            carryColIndex >= 0;
            carryColIndex--
          ) {
            if (
              this.Carry[carryCheckIndex][temp] !=
              this.Data.Answer.Carry[carryCheckIndex][carryColIndex]
            ) {
              AnswerCheck = false;
              console.log("Carry Wrong");
            }
            temp--;
          }
        }
      }
      if (AnswerCheck) {
        this.$emit("play-effect", "CorrectSound");
        this.$emit("add-record", [
          this.Data.Answer.Answer,
          this.Data.Answer.Answer,
          "正確",
        ]);
        this.$emit("next-question");
      } else {
        var wrongAnswer = 0;
        var digits = Math.ceil(
          Math.log(this.Data.Answer.Answer) / Math.log(10)
        );
        this.$emit("play-effect", "WrongSound");
        for (
          var wrongIndex = 0;
          wrongIndex < this.Ans.length - 1;
          ++wrongIndex
        ) {
          if (this.Ans[this.Ans.length - wrongIndex - 1] != null) {
            wrongAnswer +=
              this.Ans[this.Ans.length - wrongIndex - 1] *
              Math.pow(10, wrongIndex);
          } else {
            if (wrongIndex < digits) wrongAnswer = null;
            break;
          }
        }
      }
      if (wrongAnswer)
        this.$emit("add-record", [
          this.Data.Answer.Answer,
          wrongAnswer,
          "錯誤",
        ]);
      else
        this.$emit("add-record", [
          this.Data.Answer.Answer,
          "未填答完成",
          "錯誤",
        ]);
    },
    clear: function () {
      for (var carryRow in this.Carry) {
        for (var carryCol in this.Carry[carryRow]) {
          this.Carry[carryRow][carryCol] = "";
        }
      }
      for (var ansIndex in this.Ans) {
        this.Ans[ansIndex] = "";
        this.WrongAnswerMarkup[ansIndex] = false;
      }
      for (var numRow in this.Num_list) {
        for (var numCol in this.Num_list[numRow]) {
          this.Num_list[numRow][numCol] = "";
        }
      }
      for (var syIndex in this.Sy_list) {
        this.Sy_list[syIndex] = "";
      }
      this.presetCalculator();
    },
  },
};
</script>
<style lang="scss" scoped>
.outter {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 1rem;
}
.calculator {
  display: flex;
  flex-direction: column;
  .carrys {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 5px;
  }
  .btn-group {
    display: flex;
    flex-direction: row;
    justify-content: end;
    align-items: center;
    gap: 12px;
    margin: 5px 0;
    .btn--line {
      background: linear-gradient(
        120deg,
        transparent 49.5%,
        black 45.5%,
        black 51.5%,
        transparent 50%
      );
      background-color: $sub-color;
    }
  }
  .number-area button {
    background-color: $primary-color;
  }
  .carrys button {
    border: dashed 3px;
    background-color: white;
    color: $hightlight-color;
  }
  .answer {
    .btn-wrong {
      background-color: $error-color;
    }
    .btn-normal {
      background-color: $sub-color;
    }
    .AnswerContainer {
      display: flex;
      flex-direction: row;
      justify-content: center;
    }
  }
  .unit button {
    background-color: $accent-color;
    height: auto;
    border: none;
  }
  .submit-btn {
    background-color: $submit-color;
  }
}
.space {
  width: 50px;
}

.buttons {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 20px;
  button {
    height: 3rem;
    width: 13rem;
    background-color: $accent-color;
  }
}
hr {
  height: 2px;
  border-width: 0;
  color: $dark-color;
  background-color: $dark-color;
}
.btns {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 1rem;
  padding: 1rem;
  button {
    border: none;
    border-radius: 15px;
    height: 40px;
    width: 40px;
  }
}

button {
  border: none;
  border-radius: 10px;
  color: $dark-color;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  min-height: 60px;
  font-size: x-large;
  font-weight: bold;
}
</style>
