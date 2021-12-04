<template>
  <div class="pathfinders_cont">

    <div class="track track-background-venus" v-if="gameOptions.venusNextExtension">
      <div class="track-line"></div>
      <table class="table-track track-venus">
        <PlanetaryTrack type='risingPlayer' :val="tracks.venus" :rewards="rewards.venus" :gameOptions="gameOptions" />
        <PlanetaryTrack trackName="venus" type='middle' :val="tracks.venus" :rewards="rewards.venus" :gameOptions="gameOptions" />
        <PlanetaryTrack type='everyone' :val="tracks.venus" :rewards="rewards.venus" :gameOptions="gameOptions" />
      </table>
    </div>

    <div class="track track-background-earth">
      <div class="track-line"></div>
      <table class="table-track track-earth">
        <PlanetaryTrack type='risingPlayer' :val="tracks.earth" :rewards="rewards.earth" :gameOptions="gameOptions" />
        <PlanetaryTrack trackName="earth" type='middle' :val="tracks.earth" :rewards="rewards.earth" :gameOptions="gameOptions" />
        <PlanetaryTrack type='everyone' :val="tracks.earth" :rewards="rewards.earth" :gameOptions="gameOptions" />
      </table>
    </div>

    <div class="track track-background-mars">
      <div class="track-line"></div>
      <table class="table-track track-mars">
        <PlanetaryTrack type='risingPlayer' :val="tracks.mars" :rewards="rewards.mars" :gameOptions="gameOptions" />
        <PlanetaryTrack trackName="mars" type='middle' :val="tracks.mars" :rewards="rewards.mars" :gameOptions="gameOptions" />
        <PlanetaryTrack type='everyone' :val="tracks.mars" :rewards="rewards.mars" :gameOptions="gameOptions" />
      </table>
    </div>

    <div class="track track-background-jovian">
      <div class="track-line"></div>
      <table class="table-track track-jovian">
        <PlanetaryTrack type='risingPlayer' :val="tracks.jovian" :rewards="rewards.jovian" :gameOptions="gameOptions" />
        <PlanetaryTrack trackName="jovian" type='middle' :val="tracks.jovian" :rewards="rewards.jovian" :gameOptions="gameOptions" />
        <PlanetaryTrack type='everyone' :val="tracks.jovian" :rewards="rewards.jovian" :gameOptions="gameOptions" />
      </table>
    </div>

    <div class="track track-background-moon" v-if="gameOptions.moonExpansion">
      <div class="track-line"></div>
      <table class="table-track track-moon">
        <PlanetaryTrack type='risingPlayer' v-if="gameOptions.moonExpansion" :val="tracks.moon" :rewards="rewards.moon" :gameOptions="gameOptions" />
        <PlanetaryTrack trackName="moon" type='middle' v-if="gameOptions.moonExpansion" :val="tracks.moon" :rewards="rewards.moon" :gameOptions="gameOptions" />
        <PlanetaryTrack type='everyone' v-if="gameOptions.moonExpansion" :val="tracks.moon" :rewards="rewards.moon" :gameOptions="gameOptions" />
      </table>
    </div>

  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {GameOptionsModel} from '@/models/GameOptionsModel';
import {PathfindersModel} from '@/models/PathfindersModel';
import {Tags} from '@/cards/Tags';
import {range} from '@/utils/utils';
import PlanetaryTrack from '@/client/components/pathfinders/PlanetaryTrack.vue';
import {PlanetaryTracks as Tracks} from '@/pathfinders/PlanetaryTracks';

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
      venus: Tags.VENUS,
      earth: Tags.EARTH,
      mars: Tags.MARS,
      jovian: Tags.JOVIAN,
      moon: Tags.MOON,
      range: range(23),
      rewards: Tracks.initialize(),
    };
  },
});

</script>

