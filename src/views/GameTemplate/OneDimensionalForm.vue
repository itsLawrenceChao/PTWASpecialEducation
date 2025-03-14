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
            :draggable="element.Draggable"
            @dragstart="handleDragStart($event, element, index, elementIndex)"
            @dragend="handleDragEnd($event)"
            @dragover.prevent
            @drop="handleDrop($event, index, elementIndex)"
          >
            <component :is="element.Type" :Data="element.Data" :ID="ID" />
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
    handleDragStart(event, element, columnIndex, elementIndex) {
      event.dataTransfer.effectAllowed = "move";
      const dragElement = event.target;
      event.dataTransfer.setDragImage(dragElement, 0, 0);
      dragElement.classList.add("dragging");
      event.dataTransfer.setData(
        "text/plain",
        JSON.stringify({
          element,
          columnIndex,
          elementIndex,
        })
      );
    },

    handleDragEnd(event) {
      event.target.classList.remove("dragging");
    },
    handleDrop(event, targetColumnIndex, targetElementIndex) {
      const data = JSON.parse(event.dataTransfer.getData("text/plain"));
      const {
        columnIndex: sourceColumnIndex,
        elementIndex: sourceElementIndex,
      } = data;
      const temp = this.formData[targetColumnIndex][targetElementIndex];
      this.formData[targetColumnIndex][targetElementIndex] =
        this.formData[sourceColumnIndex][sourceElementIndex];
      this.formData[sourceColumnIndex][sourceElementIndex] = temp;
      this.updateKey++;
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
