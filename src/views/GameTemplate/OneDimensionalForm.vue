<template>
  <div ref="container" class="container">
    <div v-if="GameData.FormTitle" class="title">
      <component
        :is="GameData.FormTitle.Type"
        :Data="GameData.FormTitle.Data"
        :ID="ID"
      />
    </div>
    <div :key="updateKey" class="form">
      <div v-for="(column, index) in GameData.Form" :key="index" class="column">
        <div v-if="column.Title" class="title">
          <component
            :is="column.Title.Type"
            :Data="column.Title.Data"
            :ID="ID"
          />
        </div>
        <div class="formElements" :style="formStyle[index]">
          <div
            v-for="(element, elementIndex) in formData[index]"
            :key="elementIndex"
            :style="getDragStyle(index, elementIndex)"
            @mousedown="handleStart($event, index, elementIndex)"
            @mousemove="handleMove"
            @mouseup="handleEnd"
            @touchstart.prevent="handleStart($event, index, elementIndex)"
            @touchmove.prevent="handleMove"
            @touchend="handleEnd"
          >
            <component
              :is="element.Type"
              :Data="element.Data"
              :ID="ID"
              @copy.prevent
            />
          </div>
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
    ImageContainer: defineAsyncComponent(() =>
      import("@/components/ImageContainer.vue")
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
      updateKey: 0,
      formData: [],
      formStyle: [],
      selectedElement: null,
      isDragging: false,
      dragPosition: { x: 0, y: 0 },
      startPosition: { x: 0, y: 0 },
    };
  },

  mounted() {
    this.setFormContent();
    this.setFormStyle();
  },

  methods: {
    setFormContent() {
      for (let column in this.GameData.Form) {
        let columnData = [];
        for (let row in this.GameData.Form[column].Elements) {
          columnData = columnData.concat(
            this.GameData.Form[column].Elements[row]
          );
        }
        this.formData.push(columnData);
      }
      console.log(this.formData);
    },
    setFormStyle() {
      let rowHeight = this.setRowHeight();
      for (let column in this.GameData.Form) {
        let columnAmount = this.GameData.Form[column].Elements[0].length;
        let formStyle = {
          gridTemplateColumns:
            "repeat(" + columnAmount + ", fit-content(100%))",
          gridAutoRows: rowHeight + "%",
        };
        this.formStyle.push(formStyle);
      }
    },
    setRowHeight() {
      let maxRow = 0;
      for (let column in this.GameData.Form) {
        if (this.GameData.Form[column].Elements.length > maxRow) {
          maxRow = this.GameData.Form[column].Elements.length;
        }
      }
      return 100 / maxRow;
    },
    handleStart(event, columnIndex, elementIndex) {
      if (this.formData[columnIndex][elementIndex].Draggable) {
        event.preventDefault();
        this.isDragging = true;
        this.selectedElement = { columnIndex, elementIndex };

        let pos;
        if (event.type === "touchstart") {
          pos = event.touches[0];
        } else {
          pos = event;
        }
        this.startPosition = { x: pos.clientX, y: pos.clientY };
        this.dragPosition = { x: 0, y: 0 };
      }
    },

    handleMove(event) {
      if (!this.isDragging) return;

      let pos;
      if (event.type === "touchmove") {
        pos = event.touches[0];
      } else {
        pos = event;
      }
      this.dragPosition = {
        x: pos.clientX - this.startPosition.x,
        y: pos.clientY - this.startPosition.y,
      };
    },

    handleEnd() {
      this.isDragging = false;
      this.selectedElement = null;
      this.dragPosition = { x: 0, y: 0 };
    },

    getDragStyle(columnIndex, elementIndex) {
      if (
        this.selectedElement?.columnIndex === columnIndex &&
        this.selectedElement?.elementIndex === elementIndex
      ) {
        return {
          transform: `translate(${this.dragPosition.x}px, ${this.dragPosition.y}px)`,
          transition: this.isDragging ? "none" : "transform 0.3s",
          zIndex: this.isDragging ? "1" : "auto",
        };
      }
      return {};
    },
  },
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
  padding-left: 5px;
  padding-right: 5px;
  display: block;
  justify-items: center;
}
.title {
  padding: 5px;
  background-color: lightblue;
}
.formElements {
  font-size: 2rem;
  display: grid;
  gap: 5px;
  height: 80%;
  width: fit-content;
}
</style>
