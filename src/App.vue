<template>
  <div id="app">
    <div class="container">
      <h1 class="teal-text">ライフゲームシミュレータ</h1>
      <p>
        セルをタッチすると生と死が切り替わります
      </p>
      <div class="row">
        <div class="col s12 m8 input-field">
          <select v-on:change="changePreset()" v-model="preset" lazy>
            <option value="" disabled selected>[未選択]</option>
            <option value="breed">繁殖</option>
            <option value="spaceship">宇宙船</option>
            <option value="galaxy">銀河</option>
            <option value="random">ランダム</option>
          </select>
          <label>プリセット</label>
        </div>
        <div class="col s12 m4 input-field">
          <button class="btn red" @click="reset()"><i class="material-icons left">delete_forever</i>リセット</button>
        </div>
        <div class="col s12 input-field play-field">
          <button class="btn blue" @click="play()" :disabled="playID"><i class="material-icons left">play_arrow</i>再生</button>
          <button class="btn red" @click="stop()" :disabled="! playID"><i class="material-icons left">stop</i>停止</button>
          <button class="btn grey" @click="nextGeneration()"><i class="material-icons left">skip_next</i>1回進む</button>
        </div>
      </div>
      <div class="cellTable">
        <div v-for="i in 25" :key="'cellRow_'+i" class="cellRow">
          <div v-for="j in 25" :key="'cell_'+i+'_'+j" class="cellBox">
            <input type="checkbox" v-model="cell[i][j]" :id="'cell_'+i+'_'+j" class="cell">
            <label :id="'cellLabel_'+i+'_'+j" :for="'cell_'+i+'_'+j" class="cellLabel"></label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'app',
  data() {
    return {
      cell: Array.apply(null, Array(26)).map(() => Array(26).fill(false)),
      playID: null,
      preset: "",
    }
  },
  mounted() {
    let elems = document.querySelectorAll('select')
    // eslint-disable-next-line
    M.FormSelect.init(elems, {})
  },
  methods: {
    play() {
      if (this.playID !== null) return
      this.playID = setInterval(this.nextGeneration, 200)
    },
    stop() {
      if (this.playID === null) return
      clearInterval(this.playID)
      this.playID = null
    },
    nextGeneration() {
      let nextGenerationCell = Array.apply(null, Array(26)).map(() => Array(26).fill(false))
      for (let i = 1; i <= 25; i++) {
        for (let j = 1; j <= 25; j++) {
          let count = this.countAliveCells(i, j)
          if (this.cell[i][j] === false && count == 3) {
            // 誕生
            nextGenerationCell[i][j] = true
          } else if (this.cell[i][j] === true && (count <= 1 || count >= 4)) {
            // 死滅
            nextGenerationCell[i][j] = false
          } else {
            // 現状維持
            nextGenerationCell[i][j] = this.cell[i][j]
          }
        }
      }
      this.cell = nextGenerationCell
    },
    countAliveCells(i, j) {
      let count = 0
      for (let x_d = -1; x_d <= 1; x_d++) {
        for (let y_d = -1; y_d <= 1; y_d++) {
          let x = i + x_d
          let y = j + y_d
          if (x <= 0 || x > 25) continue
          if (y <= 0 || y > 25) continue
          if (x == i && y == j) continue
          if (this.cell[x][y] === true) count++
        }
      }
      return count
    },
    async changePreset() {
      this.reset()
      switch (this.preset) {
        case "breed":
          this.presetBreed()
          break
        case "spaceship":
          this.presetSpaceShip()
          break
        case "galaxy":
          this.presetGalaxy()
          break
        case "random":
          this.presetRandom()
          break
      }
      await this.$nextTick()
      this.preset = ""
    },
    reset() {
      this.cell = Array.apply(null, Array(26)).map(() => Array(26).fill(false))
    },
    presetBreed() {
      const alives = [
        [11, 15],
        [12, 13], [12, 15], [12, 16],
        [13, 13], [13, 15],
        [14, 13],
        [15, 11],
        [16, 9], [16, 11],
      ]
      alives.forEach(alive => {
        this.cell[alive[0]][alive[1]] = true
      })
    },
    presetSpaceShip() {
      const alives = [
        [2, 21], [2, 24],
        [3, 20],
        [4, 20], [4, 24],
        [5, 20], [5, 21], [5, 22], [5, 23],
        [12, 22],
        [13, 20], [13, 24],
        [14, 19],
        [15, 19], [15, 24],
        [16, 19], [16, 20], [16, 21], [16, 22], [16, 23],
      ]
      alives.forEach(alive => {
        this.cell[alive[0]][alive[1]] = true
      })
    },
    presetGalaxy() {
      const alives = [
        [8, 9], [8, 10], [8, 11], [8, 12], [8, 13], [8, 14], [8, 16], [8, 17],
        [9, 9], [9, 10], [9, 11], [9, 12], [9, 13], [9, 14], [9, 16], [9, 17],
        [10, 16], [10, 17],
        [11, 9], [11, 10], [11, 16], [11, 17],
        [12, 9], [12, 10], [12, 16], [12, 17],
        [13, 9], [13, 10], [13, 16], [13, 17],
        [14, 9], [14, 10],
        [15, 9], [15, 10], [15, 12], [15, 13], [15, 14], [15, 15], [15, 16], [15, 17],
        [16, 9], [16, 10], [16, 12], [16, 13], [16, 14], [16, 15], [16, 16], [16, 17],
      ]
      alives.forEach(alive => {
        this.cell[alive[0]][alive[1]] = true
      })
    },
    presetRandom() {
      for (let i = 1; i <= 25; i++) {
        for (let j = 1; j <= 25; j++) {
          if (Math.floor(Math.random() * Math.floor(2))) this.cell[i][j] = true
        }
      }
    }
  }
}
</script>
<style>
  #app {
    font-family: 'Noto Sans JP';
  }
  #app h1 {
    font-size: 2.5rem;
  }
  .cellTable {
    margin: auto;
    width: calc(25px * 25);
  }
  .cellRow {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
  }
  .cellBox {
    width: 25px;
    height: 25px;
  }
  .cellLabel {
    display: block;
    width: 25px;
    height: 25px;
    box-sizing: border-box;
    border: 0.5px solid grey;
  }
  .cell:checked + .cellLabel {
    background: black;
  }
  .cell {
    display: none;
  }
  .play-field button {
    margin-right: 1em;
  }
</style>

