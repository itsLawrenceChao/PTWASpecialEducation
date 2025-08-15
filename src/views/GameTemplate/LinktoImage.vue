<template>
  <div class="OutterContainer container">
    <div class="title">
      <a>{{ GameData.Question }}</a>
    </div>
    <div class="game-area">
      <div class="main-stage">
        <v-stage
          ref="stage"
          :config="stageConfig"
          @pointermove="Drawing"
          @pointerup="EndDrawing"
        >
          <v-layer ref="RectContainer">
            <v-rect
              v-for="(item, index) in rects"
              :key="index"
              :config="item"
              @pointerdown="StartDrawing(index)"
            />
            <v-text
              v-for="(item, index) in Texts"
              :key="index"
              :config="item"
              @pointerdown="StartDrawing(index)"
            />
            <v-group
              v-for="(item, index) in FractionTexts"
              :key="`fraction-${index}`"
              :config="{ x: item.x, y: item.y }"
              @pointerdown="StartDrawing(item.rectIndex)"
            >
              <KonvaFractionText
                :numerator="item.numerator"
                :denominator="item.denominator"
                :x="0"
                :y="0"
                :fontSize="item.fontSize"
                :color="item.color"
                :align="item.align"
              />
            </v-group>
          </v-layer>
          <v-layer ref="layer">
            <v-image :config="ImageConfig" />
            <v-circle
              v-for="(item, index) in ImageMountPoint"
              :key="index"
              :config="item"
            />
          </v-layer>
          <v-layer ref="LineLayer">
            <v-line v-for="line in lines" :key="line.id" :config="line" />
          </v-layer>
        </v-stage>
      </div>
      <!-- <div class="Functions">
        <button @click="CheckAllAnswer">送出答案</button>
      </div> -->
    </div>
  </div>
</template>

<script>
import { getGameAssets } from "@/utilitys/get_assets.js";
import { subComponentsVerifyAnswer as emitter } from "@/utilitys/mitt.js";
import KonvaFractionText from "@/components/KonvaFractionText.vue";

export default {
  name: "LinktoImageGame",
  components: {
    KonvaFractionText,
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
      stageConfig: {
        width: 700,
        height: 500,
      },
      rects: [],
      lines: [], // 取代 Lines
      currentLineId: null, // 取代 currentLine 直接存物件
      linksByRect: new Map(), // rectIndex -> lineId
      linksByPoint: new Map(), // pointIndex -> lineId
      Texts: [],
      FractionTexts: [],
      ImageConfig: {},
      ImageMountPoint: [],
      MinGap: 10,
      Pair: [],
      FontSize: 20,
      SelectionHeight: 50,
      RectCornerRaduis: 15,
      randomColorlist: [
        "F6BD60",
        "F7EDE2",
        "F5CAC3",
        "84A59D",
        "F28482",
        "F5CAC3",
        "F7EDE2",
        "F6BD60",
        "84A59D",
        "F28482",
      ],
    };
  },
  created() {
    let BGImage = new window.Image();
    BGImage.src = getGameAssets(this.ID, this.GameData.BGSrc);

    // 當圖片載入完成後再進行縮放和定位計算
    BGImage.onload = () => {
      let StageHeight = this.stageConfig.height - this.SelectionHeight * 2;

      let imgWidth = BGImage.width;
      let imgHeight = BGImage.height;

      // 計算寬高比
      let ration = imgWidth / imgHeight;

      // 計算適合的寬度和高度，使其不超過stage的寬高
      let NewImageWidth, NewImageHeight;

      if (this.stageConfig.width / StageHeight > ration) {
        // 如果stage更寬，根據高度來縮放
        NewImageHeight = StageHeight - 30;
        NewImageWidth = NewImageHeight * ration;
      } else {
        // 如果stage更高，根據寬度來縮放
        NewImageWidth = this.stageConfig.width - 30;
        NewImageHeight = NewImageWidth / ration;
      }

      // 計算圖片的位置，使其居中顯示
      let NewX = (this.stageConfig.width - NewImageWidth) / 2;
      let NewY = (StageHeight - NewImageHeight) / 2;
      console.log(NewX, NewY);
      // 設定ImageConfig
      this.ImageConfig = {
        image: BGImage,
        width: NewImageWidth,
        height: NewImageHeight,
        x: NewX,
        y: NewY + this.SelectionHeight,
      };

      console.log(this.ImageConfig.x, this.ImageConfig.y);
      this.GameData.MountPoint.forEach((item) => {
        this.ImageMountPoint.push({
          x: item.x + NewX,
          y: item.y + NewY + this.SelectionHeight,
          radius: 10,
          fill: "orange",
        });
      });
    };

    this.configRect();
    this.configPoint();
    emitter.on("submitAnswer", this.CheckAllAnswer);
  },
  mounted() {
    // Stage border
    // this.InitAnswer();
    let layer = this.$refs.layer.getNode();
    layer.moveToBottom();
    layer.draw();
    let RectContainer = this.$refs.RectContainer.getNode();
    RectContainer.moveToTop();
    RectContainer.draw();
  },
  beforeUnmount() {
    emitter.off("submitAnswer", this.CheckAllAnswer);
  },
  methods: {
    StartDrawing(rectIndex) {
      // 若該 rect 已連過線，先刪除舊線
      const oldId = this.linksByRect.get(rectIndex);
      if (oldId) this.removeLine(oldId);

      const start = this.rects[rectIndex];
      const id = crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now() + Math.random());

      const line = {
        id,
        rectIndex,
        pointIndex: null, // 還沒接到點
        points: [
          start.x + start.width / 2,
          start.y + start.height / 2,
          start.x + start.width / 2,
          start.y + start.height / 2,
        ],
        stroke: "black",
        strokeWidth: 10,
        lineCap: "round",
        lineJoin: "round",
      };

      this.lines.push(line);
      this.currentLineId = id;
    },
    Drawing() {
      if (!this.currentLineId) return;
      const line = this.lines.find((l) => l.id === this.currentLineId);
      if (!line) return;
      const { x, y } = this.$refs.stage.getNode().getPointerPosition();
      line.points.splice(2, 2, x, y);
      this.$refs.LineLayer.getNode().batchDraw();
    },
    EndDrawing() {
      if (!this.currentLineId) return;
      const { x, y } = this.$refs.stage.getNode().getPointerPosition();
      const pointIndex = this.WhichMountPoint(x, y);
      const line = this.lines.find((l) => l.id === this.currentLineId);

      if (pointIndex === -1) {
        // 沒接到點 -> 移除暫存線
        this.removeLine(this.currentLineId);
      } else {
        // 若該點已有線，先刪除舊線
        const oldId = this.linksByPoint.get(pointIndex);
        if (oldId) this.removeLine(oldId);

        // 完成線
        line.points.splice(
          2,
          2,
          this.ImageMountPoint[pointIndex].x,
          this.ImageMountPoint[pointIndex].y
        );
        line.pointIndex = pointIndex;

        this.linksByRect.set(line.rectIndex, line.id);
        this.linksByPoint.set(pointIndex, line.id);
      }

      this.currentLineId = null;
      this.$refs.LineLayer.getNode().batchDraw();
    },
    removeLine(id) {
      const idx = this.lines.findIndex((l) => l.id === id);
      if (idx === -1) return;
      const line = this.lines[idx];
      if (line.pointIndex !== null) this.linksByPoint.delete(line.pointIndex);
      this.linksByRect.delete(line.rectIndex);
      this.lines.splice(idx, 1);
    },
    WhichMountPoint(x, y) {
      for (let i = 0; i < this.ImageMountPoint.length; i++) {
        if (
          Math.pow(x - this.ImageMountPoint[i].x, 2) +
            Math.pow(y - this.ImageMountPoint[i].y, 2) <
          Math.pow(this.ImageMountPoint[i].radius, 2)
        ) {
          return i;
        }
      }
      return -1;
    },
    CheckPairedBefore(x, y) {
      // 檢查起點是否已經有連線
      for (let i in this.LinkedRecord) {
        if (this.LinkedRecord[i][0] == x) {
          return true;
        }
      }
      // 檢查終點是否已經有連線
      for (let i in this.LinkedRecord) {
        if (this.LinkedRecord[i][1] == y) {
          return true;
        }
      }
      return false;
    },
    MarkWrongLine(start, end) {
      let WrongLine = {
        points: [
          this.rects[start].x + this.rects[start].width / 2,
          this.rects[start].y + this.rects[start].height / 2,
          this.ImageMountPoint[end].x,
          this.ImageMountPoint[end].y,
        ],
        stroke: "red",
        strokeWidth: 10,
        lineCap: "round",
        lineJoin: "round",
      };
      for (let i in this.Lines) {
        if (
          this.Lines[i].points[0] == WrongLine.points[0] &&
          this.Lines[i].points[1] == WrongLine.points[1]
        ) {
          this.Lines[i] = WrongLine;
        }
      }
    },
    CheckAllAnswer() {
      const answerSet = new Set(this.Pair.map(([p, r]) => `${p}-${r}`));

      let wrong = [];
      for (const l of this.lines) {
        if (l.pointIndex === null) continue; // 忽略未接完的線
        const key = `${l.pointIndex}-${l.rectIndex}`;
        if (!answerSet.has(key)) wrong.push(l.id);
      }

      // 標紅錯線
      for (const id of wrong) {
        const line = this.lines.find((l) => l.id === id);
        if (line) {
          line.stroke = "red";
        }
      }
      this.$refs.LineLayer.getNode().batchDraw();

      const pass =
        wrong.length === 0 &&
        this.lines.filter((l) => l.pointIndex !== null).length ===
          this.Pair.length;

      this.$emit("play-effect", pass ? "CorrectSound" : "WrongSound");
      this.$emit("add-record", ["不支援", "不支援", pass ? "正確" : "錯誤"]);
      if (pass) this.$emit("next-question");

      return { WrongAmount: wrong.length, WrongAnsIndexs: wrong, Pass: pass };
    },
    Pop() {
      if (this.LinkedRecord.length > 0) {
        this.LinkedRecord.pop();
        this.Lines.pop();
        this.$refs.LineLayer.getNode().batchDraw();
      }
    },
    ClearAll() {
      this.LinkedRecord = [];
      this.Lines = [];
      this.$refs.LineLayer.getNode().batchDraw();
    },
    parseLatexFraction(latexString) {
      // 解析 LaTeX 格式的分數，例如 "\\frac{1}{4}" -> {numerator: "1", denominator: "4"}
      const match = latexString.match(/\\frac\{([^}]+)\}\{([^}]+)\}/);
      if (match) {
        return {
          numerator: match[1],
          denominator: match[2],
        };
      }
      return null;
    },
    addText({ x, y, width, text, rectIndex }) {
      // 檢查是否為 LaTeX 分數格式
      const fractionData = this.parseLatexFraction(text);
      if (fractionData) {
        // 如果是分數，添加到 FractionTexts
        this.FractionTexts.push({
          x: x + width / 2, // 居中顯示
          y: y - 10, // 垂直居中
          numerator: fractionData.numerator,
          denominator: fractionData.denominator,
          fontSize: Math.max(this.FontSize - 4, 12), // 稍微小一點的字體
          color: "#111827",
          align: "center",
          rectIndex: rectIndex,
        });
      } else {
        // 如果是普通文字，添加到 Texts
        this.Texts.push({
          x: x,
          y: y,
          text: text,
          align: "center",
          width: width,
          fontSize: this.FontSize,
        });
      }
    },
    addRect(x, y, width, height) {
      this.rects.push({
        x: x,
        y: y,
        width: width,
        height: height,
        cornerRadius: this.RectCornerRaduis,
        fill: this.randomColor(),
      });
    },
    randomColor() {
      return ` #${
        this.randomColorlist[
          Math.floor(Math.random() * (this.randomColorlist.length - 1))
        ]
      }`;
    },
    configRect() {
      //Config Rect
      if (this.GameData.Selections.length <= 4) {
        // 小於等於4，一行排列
        let RectWidth =
          (this.stageConfig.width -
            (this.GameData.Selections.length + 1) * this.MinGap) /
          this.GameData.Selections.length;

        this.GameData.Selections.forEach((item, index) => {
          this.addRect(
            this.MinGap + index * (RectWidth + this.MinGap),
            0,
            RectWidth,
            this.SelectionHeight
          );
          this.addText({
            x: this.MinGap + index * (RectWidth + this.MinGap),
            y: (this.SelectionHeight - this.FontSize) / 2,
            text: item,
            width: RectWidth,
            rectIndex: index,
          });
        });
      } else {
        let RectWidth =
          (this.stageConfig.width -
            (this.GameData.Selections.length / 2 + 1) * this.MinGap) /
          (this.GameData.Selections.length / 2);
        this.GameData.Selections.forEach((item, index) => {
          if (index % 2 == 0) {
            this.addRect(
              this.MinGap + parseInt(index / 2) * (RectWidth + this.MinGap),
              0,
              RectWidth,
              this.SelectionHeight
            );
            this.addText({
              x: this.MinGap + parseInt(index / 2) * (RectWidth + this.MinGap),
              y: (this.SelectionHeight - this.FontSize) / 2,
              width: RectWidth,
              text: item,
              rectIndex: index,
            });
          } else {
            this.addRect(
              this.MinGap + parseInt(index / 2) * (RectWidth + this.MinGap),
              this.stageConfig.height - this.SelectionHeight,
              RectWidth,
              this.SelectionHeight
            );
            this.addText({
              x: this.MinGap + parseInt(index / 2) * (RectWidth + this.MinGap),
              y: this.stageConfig.height - this.SelectionHeight / 2 - 10,
              text: item,
              width: RectWidth,
              rectIndex: index,
            });
          }
        });
      }
    },
    configPoint() {
      this.Pair = [];
      for (let i in this.GameData.MountPoint) {
        for (let j in this.GameData.Selections) {
          if (typeof this.GameData.MountPoint[i].Connect2 == "string") {
            if (
              this.GameData.MountPoint[i].Connect2 ==
              this.GameData.Selections[j]
            ) {
              this.Pair.push([i, j]);
            }
          } else {
            for (let k in this.GameData.MountPoint[i].Connect2) {
              if (
                this.GameData.MountPoint[i].Connect2[k] ==
                this.GameData.Selections[j]
              ) {
                this.Pair.push([i, j]);
              }
            }
          }
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
.OutterContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $gap--small;
  .game-area {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }
}

.title {
  @extend .container-basic;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $primary-color;
  padding: $gap--small;
  width: 100%;
  a {
    font-size: $text-medium;
    font-weight: $text-bold;
  }
}

.main-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.Functions {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1rem;
  button {
    width: 100%;
    min-width: 200px;
    height: 3rem;
    border: none;
    background-color: $submit-color;
    border-radius: 15px;
    scale: 1;
    transition: 0.5s;
  }
  button:hover {
    scale: 1.1;
    transition: 0.5s;
  }
}
</style>
