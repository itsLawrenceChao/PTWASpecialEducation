<template>
  <div class="repeat-image-container" :style="gridStyle">
    <img
      v-for="index in count"
      :key="index"
      :src="imageUrl"
      :alt="Data.Alt"
      class="repeated-image"
    />
  </div>
</template>

<script>
import { getGameAssets } from "@/utilitys/get_assets.js";
export default {
  name: "RepeatImage",
  props: {
    Data: {
      type: Object,
      required: true,
    },
    ID: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      count: this.Data.Count,
      imageUrl: getGameAssets(this.ID, this.Data.Src),
      columns: 0,
    };
  },
  computed: {
    gridStyle() {
      const columns = this.calculateColumns();
      const effectiveColumns = Math.min(columns, this.count);
      return {
        gridTemplateColumns: `repeat(${effectiveColumns}, 1fr)`,
      };
    },
  },
  beforeMount() {
    try {
      this.columns = this.calculateColumns();
      console.log(this.columns);
    } catch (error) {
      console.warn("計算列數時發生錯誤：", error);
      this.columns = 6;
    }
  },
  methods: {
    calculateColumns() {
      if (this.Data.Columns) {
        return this.Data.Columns;
      }
      for (let i = 1; i <= 7; i++) {
        if (this.count / i <= 7) {
          return Math.ceil(this.count / i);
        }
      }
      return 7;
    },
  },
};
</script>

<style scoped lang="scss">
.repeat-image-container {
  display: grid;
  width: 100%;
  height: 100%;
  padding: $padding--small;
  box-sizing: border-box;
  gap: $gap--tiny;
  place-items: center;
}

.repeated-image {
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  object-fit: contain;
}
</style>
