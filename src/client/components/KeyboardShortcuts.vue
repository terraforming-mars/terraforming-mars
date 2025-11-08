  <template>
    <PopupPanel @close="$emit('close')">
      <template v-slot:header>
        <h2>Keyboard Shortcuts</h2>
      </template>
      A - Main Board<br/>
      S - Players Overview Table<br/>
      D - Cards in Hand<br/>
      F - Colonies<br/>
      <template v-if="preferences().experimental_ui">
        <br/>
        1-9 - Scroll through the player board.
      </template>
      <br/>
      ? - Show this help<br/>
      ESC - close this help<br/>
      <br/>More coming.
  </PopupPanel>
</template>
<script lang="ts">
import Vue from 'vue';
import PopupPanel from './common/PopupPanel.vue';
import {getPreferences} from '../utils/PreferencesManager';

export default Vue.extend({
  name: 'KeyboardShortcuts',
  components: {
    PopupPanel,
  },
  computed: {
    preferences(): typeof getPreferences {
      return getPreferences;
    },
  },
});
</script>
