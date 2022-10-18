<template>
  <div>
    <a-modal v-model="visible" title="Basic Modal" @ok="handleOk">
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-modal>
  </div>
</template>

<script>
export default {
  props: {
  },
  data () {
    return {
      visible: false
    }
  },
  methods: {

  }
}
</script>

<style>

</style>
