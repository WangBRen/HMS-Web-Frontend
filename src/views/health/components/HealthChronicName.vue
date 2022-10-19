<template>
  <div>
    <a-select v-model="id" show-search :filterOption="filterOption" @change="setChroincName1">
      <a-select-option v-for="item in filterArr" :key="item.id">
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
        },
        formData: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            id: null,
            filterData: this.formData.targetArr,
            filterArr: null
        }
    },
    methods: {
        setChroincName1 () {
            const id = Number(this.id)
            console.log('全部', this.indexArr)
            console.log('filterData,要过滤', this.filterData)
            var filterArr = JSON.parse(JSON.stringify(this.filterArr))
            const filterData = this.filterData
            for (var i = 0; i < filterData.length; i++) {
              console.log('indexItemId', filterData[i])
              filterArr = filterArr.filter((item) => {
                // console.log('item', item.id)
                return item.id !== filterData[i].indexItemId
              })
            }
            for (var filter of filterData) {
              console.log('fliter', filter.indexItemId)
            }
            // for (var i = 0; i < this.filterData.length; i++) {
            //   console.log(this.filterData[i].id, '???', this.filterData[i].indexItemId)
            //   filterArr = this.indexArr.filter((item) => {
            //     // console.log('item.id', item.id, 'indexItemId', this.filterData[i].indexItemId)
            //     return item.id !== this.filterData[i].indexItemId
            //   })
            //   console.log('过滤后', filterArr)
            // }
            console.log('过滤后', filterArr)
            this.$emit('change1', { id: id })
        },
        filterOption (value, option) {
          return option.componentOptions.children[0].text.indexOf(value) >= 0
        }
    },
    mounted () {
      this.filterArr = this.indexArr
    }
}
</script>
