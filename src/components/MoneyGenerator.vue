<template>
  <div
    ref="Container"
    class="Container"
    :style="{
      width: containerSize.width + 'px',
      height: containerSize.height + 'px',
    }"
  >
    <div
      v-if="paperMoneyGroups['1000'].length > 0"
      :key="containerRef"
      class="MoneyContainer papaer-money"
    >
      <MoneyDisplay
        v-for="(item, index) in paperMoneyGroups['1000']"
        :key="`1000-${index}`"
        :Data="{ denomination: item }"
      />
    </div>
    <div
      v-if="paperMoneyGroups['500'].length > 0"
      :key="containerRef"
      class="MoneyContainer papaer-money"
    >
      <MoneyDisplay
        v-for="(item, index) in paperMoneyGroups['500']"
        :key="`500-${index}`"
        :Data="{ denomination: item }"
      />
    </div>
    <div
      v-if="paperMoneyGroups['100'].length > 0"
      :key="containerRef"
      class="MoneyContainer papaer-money"
    >
      <MoneyDisplay
        v-for="(item, index) in paperMoneyGroups['100']"
        :key="`100-${index}`"
        :Data="{ denomination: item }"
      />
    </div>
    <div
      v-for="(item, rowIndex) in coinContainer"
      :key="'row-' + rowIndex"
      class="CoinContainer"
    >
      <div
        v-for="(coin, coinIndex) in item"
        :key="'coin-' + coinIndex"
        class="PerCoin"
      >
        <MoneyDisplay v-if="coin !== ''" :Data="{ denomination: coin }" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, nextTick } from "vue";
import MoneyDisplay from "./MoneyDisplay.vue";

const props = defineProps({
  Data: {
    type: Object,
    required: true,
  },
  ID: {
    type: String,
    required: true,
  },
});

const paperMoneyGroups = ref({
  1000: [],
  500: [],
  100: [],
});
const coinContainer = ref([]);
const Data = ref(props.Data);
const containerSize = ref(false);
const containerRef = ref(0);
const Container = ref(null);

const processCoins = (amount, denomination) => {
  let remaining = amount;
  while (remaining > 0) {
    let TempContainer = [];
    const count = Math.min(remaining, 10);
    for (let i = 0; i < count; i++) {
      TempContainer.push(denomination);
    }
    while (TempContainer.length < 10) {
      TempContainer.push("");
    }
    coinContainer.value.push(TempContainer);
    remaining -= count;
  }
};

const processPaperMoney = (amount, denomination) => {
  for (let i = 0; i < amount; i++) {
    paperMoneyGroups.value[denomination].push(denomination);
  }
};

const loadData = () => {
  // 處理紙鈔
  if (Data.value.Thousands) {
    processPaperMoney(Data.value.Thousands, "1000");
  }
  if (Data.value.FiveHundreds) {
    processPaperMoney(Data.value.FiveHundreds, "500");
  }
  if (Data.value.Hundreds) {
    processPaperMoney(Data.value.Hundreds, "100");
  }

  // 處理硬幣
  const coinTypes = {
    Fifties: "50",
    Tens: "10",
    Fives: "5",
    Ones: "1",
  };

  Object.entries(coinTypes).forEach(([key, value]) => {
    if (Data.value[key]) {
      processCoins(Data.value[key], value);
    }
  });
};
function updateContainerSize() {
  if (Container.value) {
    const { width, height } = Container.value.getBoundingClientRect();
    containerSize.value = { width, height };
  }
}
onMounted(() => {
  Container.value.focus();
  loadData();
  updateContainerSize();
  window.addEventListener("resize", updateContainerSize);
  // Use nextTick to ensure the container size is updated before initializing the image
  nextTick(() => {
    containerRef.value += 1;
  });
});
</script>
<style scoped lang="scss">
/* Your component styles here */
.Container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* grid-template-columns: 1fr;
    grid-template-rows: repeat(4,1fr); */
  gap: 8px;
}
.papaer-money {
  img {
    height: 70px;
  }
}
.MoneyContainer {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(auto-fill, 1fr);
  gap: 10px;
}
.CoinContainer {
  display: flex;
  flex-direction: row;
  width: 100%;
  max-height: 40px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .PerCoin {
    display: flex;
    justify-content: end;
    align-items: end;
  }
}
</style>
