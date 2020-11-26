<template>
  <div class="remote-css-content">
    <remote-css :href="href"></remote-css>
  </div>
</template>
<script>
  export default {
    name: 'remoteCss',
    components: {
      'remote-css': {
        render (h) {
          return h('link', {
            attrs: { type: 'text/css', rel: 'stylesheet', href: this.href }
          })
        }
      }
    },
    props: {
      href: {
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
