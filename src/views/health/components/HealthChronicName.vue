<template>
  <div>
    <a-select v-model="id" show-search :filterOption="filterOption" @change="setChroincName">
      <a-select-option v-for="item in indexArr" :key="item.id">
        {{ item.name }} - <span style="font-size: 11px; color: #999">({{ item.category }})</span>
      </a-select-option>
    </a-select>
  </div>
</template>
<script>
export default {
    props: {
        indexArr: {
            type: Array,
            required: true
        }
    },
    data () {
        return {
            id: null
        }
    },
    methods: {
        setChroincName () {
            const id = Number(this.id)
            // console.log('id', id)
            this.$emit('change', { id: id })
        },
        filterOption (value, option) {
          return option.componentOptions.children[0].text.indexOf(value) >= 0
        }
    }
}
</script>
