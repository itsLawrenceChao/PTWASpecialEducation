<template>
  <GenericBoard
    :data="Data"
    :ID="ID"
    :config="currentConfig"
    @reply-answer="handleReply"
  />
</template>

<script>
import GenericBoard from "@/components/components-utilitys/calculation-board/GenericBoard.vue";
// 引入各題型的 config 設定
import {
  multiplyConfig,
  addsubConfig,
  divisionConfig,
  decimalConfig,
} from "@/components/components-utilitys/calculation-board";

export default {
  name: "CalculationBoard",
  components: {
    GenericBoard,
  },
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
  emits: ["replyAnswer"],

  computed: {
    currentConfig() {
      const map = {
        multiply: multiplyConfig,
        addsub: addsubConfig,
        division: divisionConfig,
        decimal: decimalConfig,
      };

      const type = this.Data.type?.toLowerCase?.() ?? "";
      const configType = type === "add" || type === "sub" ? "addsub" : type;

      return map[configType] || addsubConfig;
    },
  },

  methods: {
    handleReply(result) {
      this.$emit("replyAnswer", result);
    },
  },
};
</script>
<style lang="scss" scoped>
.CalculationBoard {
  width: 100%;
  height: 100%;
}
</style>
