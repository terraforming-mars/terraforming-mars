<template>
  <div class="pathfinders_cont">

    <table class="track-numbers">
      <tr>
        <td>&nbsp;</td>
        <td v-for="idx in range" :key="idx">{{idx}}</td>
      </tr>
    </table>

    <div class="track track-background-venus" v-if="gameOptions.venusNextExtension">
      <div class="track-tag track-tag-venus"></div>
      <table class="track-venus">
        <PlanetaryTrack type='risingPlayer' v-if="gameOptions.venusNextExtension" :val="tracks.venus" :rewards="rewards.venus" :gameOptions="gameOptions" />
        <PlanetaryTrack type='everyone' v-if="gameOptions.venusNextExtension" :val="tracks.venus" :rewards="rewards.venus" :gameOptions="gameOptions" />
      </table>
    </div>

    <div class="track track-background-earth">
      <div class="track-tag track-tag-earth"></div>
      <table class="track-earth">
        <PlanetaryTrack type='risingPlayer' :val="tracks.earth" :rewards="rewards.earth" :gameOptions="gameOptions" />
        <PlanetaryTrack type='everyone' :val="tracks.earth" :rewards="rewards.earth" :gameOptions="gameOptions" />
      </table>
    </div>

    <div class="track track-background-mars">
      <div class="track-tag track-tag-mars"></div>
      <table class="track-mars">
        <PlanetaryTrack type='risingPlayer' :val="tracks.mars" :rewards="rewards.mars" :gameOptions="gameOptions" />
        <PlanetaryTrack type='everyone' :val="tracks.mars" :rewards="rewards.mars" :gameOptions="gameOptions" />
      </table>
    </div>

    <div class="track track-background-jovian">
      <div class="track-tag track-tag-jovian"></div>
      <table class="track-jovian">
        <PlanetaryTrack type='risingPlayer' :val="tracks.jovian" :rewards="rewards.jovian" :gameOptions="gameOptions" />
        <PlanetaryTrack type='everyone' :val="tracks.jovian" :rewards="rewards.jovian" :gameOptions="gameOptions" />
      </table>
    </div>

    <div class="track track-background-moon" v-if="gameOptions.moonExpansion">
      <div class="track-tag track-tag-moon"></div>
      <table class="track-moon">
        <PlanetaryTrack type='risingPlayer' v-if="gameOptions.moonExpansion" :val="tracks.moon" :rewards="rewards.moon" :gameOptions="gameOptions" />
        <PlanetaryTrack type='everyone' v-if="gameOptions.moonExpansion" :val="tracks.moon" :rewards="rewards.moon" :gameOptions="gameOptions" />
      </table>
    </div>

  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {GameOptionsModel} from '@/common/models/GameOptionsModel';
import {PathfindersModel} from '@/common/models/PathfindersModel';
import {Tag} from '@/common/cards/Tag';
import {range} from '@/common/utils/utils';
import PlanetaryTrack from '@/client/components/pathfinders/PlanetaryTrack.vue';
import {PlanetaryTracks as Tracks} from '@/common/pathfinders/PlanetaryTracks';

export default Vue.extend({
  name: 'PlanetaryTracks',
  props: {
    tracks: {
      type: Object as () => PathfindersModel,
    },
    gameOptions: {
      type: Object as () => GameOptionsModel,
    },
  },
  components: {
    PlanetaryTrack,
  },
  data() {
    return {
      venus: Tag.VENUS,
      earth: Tag.EARTH,
      mars: Tag.MARS,
      jovian: Tag.JOVIAN,
      moon: Tag.MOON,
      range: range(23),
      rewards: Tracks.initialize(),
    };
  },
});

</script>

