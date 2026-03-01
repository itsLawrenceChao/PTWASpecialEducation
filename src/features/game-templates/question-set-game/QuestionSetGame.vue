<template>
  <div class="question-set-game">
    <div v-if="gameData.TopContainer" class="question-set-game__top">
      <component
        :is="gameData.TopContainer.Name"
        :component-config="gameData.TopContainer.Data"
        :game-id="gameId"
      />
    </div>

    <div v-if="gameData.SlotComponent" class="question-set-game__slot Rect">
      <component
        :is="gameData.SlotComponent.Name"
        :game-id="gameId"
        :component-config="gameData.SlotComponent.Data"
      />
    </div>

    <transition :name="transitionName" mode="out-in">
      <div :key="currentQuestionIndex" class="question-set-game__question">
        <div class="question-set-game__prompt">
          <template
            v-if="questionType === 'fill' && currentQuestion.Prompt?.includes('$input$')"
          >
            <template
              v-for="(part, partIndex) in splitByToken(currentQuestion.Prompt, '$input$')"
              :key="`fill-${partIndex}`"
            >
              <span v-if="part !== '$input$'">{{ part }}</span>
              <input
                v-else
                v-model="answers[currentQuestionIndex]"
                :type="currentQuestion.InputMode === 'number' ? 'number' : 'text'"
                class="question-set-game__input"
                :placeholder="currentQuestion.Placeholder || ''"
              />
            </template>
          </template>

          <template
            v-else-if="questionType === 'dropdown' && currentQuestion.Prompt?.includes('$dropdown$')"
          >
            <template
              v-for="(part, partIndex) in splitByToken(currentQuestion.Prompt, '$dropdown$')"
              :key="`dropdown-${partIndex}`"
            >
              <span v-if="part !== '$dropdown$'">{{ part }}</span>
              <select
                v-else
                v-model.number="answers[currentQuestionIndex]"
                class="question-set-game__select"
              >
                <option :value="null" disabled>請選擇</option>
                <option
                  v-for="(option, optionIndex) in currentOptions"
                  :key="`dopt-${optionIndex}`"
                  :value="optionIndex"
                >
                  {{ option }}
                </option>
              </select>
            </template>
          </template>

          <template v-else>
            <span>{{ currentQuestion.Prompt }}</span>
            <template v-if="questionType === 'fill'">
              <input
                v-model="answers[currentQuestionIndex]"
                :type="currentQuestion.InputMode === 'number' ? 'number' : 'text'"
                class="question-set-game__input"
                :placeholder="currentQuestion.Placeholder || ''"
              />
            </template>
            <template v-else-if="questionType === 'dropdown'">
              <select
                v-model.number="answers[currentQuestionIndex]"
                class="question-set-game__select"
              >
                <option :value="null" disabled>請選擇</option>
                <option
                  v-for="(option, optionIndex) in currentOptions"
                  :key="`dopt-inline-${optionIndex}`"
                  :value="optionIndex"
                >
                  {{ option }}
                </option>
              </select>
            </template>
          </template>
        </div>

        <div
          v-if="questionType === 'single' || questionType === 'multi'"
          class="question-set-game__options"
        >
          <button
            v-for="(option, optionIndex) in currentOptions"
            :key="`opt-${optionIndex}`"
            type="button"
            class="question-set-game__option"
            :class="{ 'question-set-game__option--selected': isOptionSelected(optionIndex) }"
            @click="selectOption(optionIndex)"
          >
            {{ option }}
          </button>
        </div>
      </div>
    </transition>

    <button v-if="nextable" class="question-set-game__next" @click="nextQuestion">
      下一題
    </button>
  </div>
</template>

<script>
import { getComponents } from "@/lib/get-components.js";
import { subComponentsVerifyAnswer as emitter } from "@/lib/mitt.js";

export default {
  name: "QuestionSetGame",
  components: {
    TextOnly: getComponents("TextOnly"),
    ImageContainer: getComponents("ImageContainer"),
    DragImages: getComponents("DragImages"),
  },
  props: {
    gameData: {
      type: Object,
      required: true,
    },
    gameId: {
      type: String,
      required: true,
    },
  },
  emits: ["play-effect", "add-record", "next-question"],
  data() {
    return {
      answers: [],
      currentQuestionIndex: 0,
      transitionName: "slide-right",
      nextable: false,
    };
  },
  computed: {
    questions() {
      return Array.isArray(this.gameData.Questions) ? this.gameData.Questions : [];
    },
    currentQuestion() {
      return this.questions[this.currentQuestionIndex] || {};
    },
    questionType() {
      const explicitType = this.currentQuestion.Type;
      if (explicitType) return explicitType;
      if (Array.isArray(this.currentQuestion.Answer)) return "multi";
      if (Array.isArray(this.currentQuestion.Options)) return "single";
      return "fill";
    },
    currentOptions() {
      if (Array.isArray(this.currentQuestion.Options)) return this.currentQuestion.Options;
      if (Array.isArray(this.currentQuestion.Selection)) {
        return this.currentQuestion.Selection.map((item) => item?.Text ?? String(item));
      }
      return [];
    },
  },
  created() {
    this.answers = this.questions.map((question) => {
      if ((question.Type || "") === "multi" || Array.isArray(question.Answer)) return [];
      return null;
    });
    emitter.on("submitAnswer", this.submitCurrentAnswer);
  },
  mounted() {
    const container = document.getElementsByClassName("Container")[0];
    if (container && !this.gameData.SlotComponent) {
      container.style.gridTemplateColumns = "1fr";
    }
  },
  beforeUnmount() {
    emitter.off("submitAnswer", this.submitCurrentAnswer);
  },
  methods: {
    splitByToken(text, token) {
      return String(text || "").split(new RegExp(`(${token.replace(/[$]/g, "\\$")})`, "g"));
    },
    normalizeText(value) {
      return String(value ?? "").trim();
    },
    isOptionSelected(optionIndex) {
      const answer = this.answers[this.currentQuestionIndex];
      if (this.questionType === "multi") {
        return Array.isArray(answer) && answer.includes(optionIndex);
      }
      return answer === optionIndex;
    },
    selectOption(optionIndex) {
      if (this.questionType === "multi") {
        const current = Array.isArray(this.answers[this.currentQuestionIndex])
          ? [...this.answers[this.currentQuestionIndex]]
          : [];
        const target = current.indexOf(optionIndex);
        if (target >= 0) current.splice(target, 1);
        else current.push(optionIndex);
        this.answers.splice(this.currentQuestionIndex, 1, current);
        return;
      }
      this.answers.splice(this.currentQuestionIndex, 1, optionIndex);
    },
    compareFill(userAnswer, expectedAnswer) {
      if (typeof expectedAnswer === "number") {
        return Number(userAnswer) === Number(expectedAnswer);
      }
      return this.normalizeText(userAnswer) === this.normalizeText(expectedAnswer);
    },
    isCorrectAnswer(userAnswer, expectedAnswer) {
      if (this.questionType === "multi") {
        if (!Array.isArray(userAnswer) || !Array.isArray(expectedAnswer)) return false;
        const userSorted = [...userAnswer].sort((a, b) => a - b);
        const expectedSorted = [...expectedAnswer].sort((a, b) => a - b);
        if (userSorted.length !== expectedSorted.length) return false;
        return userSorted.every((value, index) => value === expectedSorted[index]);
      }

      if (this.questionType === "fill") {
        if (Array.isArray(expectedAnswer)) {
          return expectedAnswer.some((candidate) => this.compareFill(userAnswer, candidate));
        }
        return this.compareFill(userAnswer, expectedAnswer);
      }

      return Number(userAnswer) === Number(expectedAnswer);
    },
    submitCurrentAnswer() {
      const expectedAnswer = this.currentQuestion.Answer;
      const userAnswer = this.answers[this.currentQuestionIndex];
      const pass = this.isCorrectAnswer(userAnswer, expectedAnswer);

      this.$emit("play-effect", pass ? "CorrectSound" : "WrongSound");
      this.$emit("add-record", [
        `第 ${this.currentQuestionIndex + 1} 題`,
        `回答：${JSON.stringify(userAnswer)}`,
        pass ? "正確" : "錯誤",
      ]);

      if (!pass) return;

      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.nextable = true;
      } else {
        this.nextable = false;
        this.$emit("next-question");
      }
    },
    nextQuestion() {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.transitionName = "slide-left";
        this.currentQuestionIndex += 1;
      }
      this.nextable = false;
    },
  },
};
</script>

<style scoped lang="scss">
.question-set-game {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  height: 100%;
}

.question-set-game__top {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem;
}

.Rect {
  border: solid 1px;
  margin: 0 1rem;
  border-radius: 15px;
}

.question-set-game__slot {
  padding: $gap--tiny;
  display: flex;
  height: 60%;
}

.question-set-game__question {
  width: 100%;
  border-radius: 15px;
  border: solid 3px #aaa;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.question-set-game__prompt {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: x-large;
  flex-wrap: wrap;
}

.question-set-game__input,
.question-set-game__select {
  min-width: 120px;
  font-size: 1.1rem;
  padding: 6px 8px;
}

.question-set-game__options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.question-set-game__option {
  background-color: white;
  border: 2px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 80px;
  text-align: center;

  &:hover {
    background-color: #e9e9e9;
  }
}

.question-set-game__option--selected {
  border-color: $hyperlink-color;
  background-color: $success-color;
  color: white;
}

.question-set-game__next {
  width: 13rem;
  height: 4rem;
  border-radius: 15px;
  background-color: $submit-color;
  transition: 0.5s;
  font-size: 1.5rem;
  align-self: flex-end;
  margin: 0 1rem;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.5s ease;
  width: 100%;
}

.slide-left-enter,
.slide-right-leave-to {
  transform: translateX(100%);
}

.slide-left-leave-to,
.slide-right-enter {
  transform: translateX(-100%);
}

.slide-left-enter-to,
.slide-left-leave,
.slide-right-enter-to,
.slide-right-leave {
  transform: translateX(0%);
}
</style>
