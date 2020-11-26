<template>
    <div class="remote-js-content">
        <remote-js :src="src"></remote-js>
    </div>
</template>
<script>
  export default {
    name: 'remoteJs',
    components: {
      'remote-js': {
        render (h) {
          return h('script', {
            attrs: { type: 'text/javascript', src: this.src }
          })
        }
      }
    },
    props: {
      src: {
        type: String,
        required: true
      }
    },
    data () {
      return {}
    }
  }
</script>

<style lang='less' scoped>
</style>
