<script lang="ts">
import Vue from 'vue';
import {PlayerModel} from '../models/PlayerModel';

export default Vue.extend({
  name: 'SelectPlayerRow',
  props: {
    player: {
      type: Object as () => PlayerModel | undefined,
    },
  },
  methods: {
  },
  data: function() {
    return {};
  },
  template: '<span>{{player === undefined ? "" : player.name}}</span>',
});
</script>

<style lang="less" scoped>
</style>
