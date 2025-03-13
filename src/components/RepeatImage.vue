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
      columns: this.Data.Columns || 8,
    };
  },
  computed: {
    gridStyle() {
      const effectiveColumns = Math.min(this.columns, this.count);
      return {
        gridTemplateColumns: `repeat(${effectiveColumns}, 1fr)`,
      };
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
