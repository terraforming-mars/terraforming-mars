import Vue from 'vue';
import {TagCount} from '../TagCount';
import {ITagCount} from '../../ITagCount';
import {PlayerModel} from '../../models/PlayerModel';
import {Tags} from '../../cards/Tags';
import {SpecialTags} from '../../cards/SpecialTags';
import {isTagsViewConcise} from './OverviewSettings';

export const PlayerTags = Vue.component('player-tags', {
  props: {
    player: {
      type: Object as () => PlayerModel,
    },
    isActivePlayer: {
      type: Boolean,
    },
    hideZeroTags: {
      type: Boolean,
    },
  },
  components: {
    'tag-count': TagCount,
  },

  methods: {
    showColonyCount: function(): boolean {
      return this.player.gameOptions.coloniesExtension;
    },
    showInfluence: function(): boolean {
      return this.player.turmoil !== undefined;
    },
    showVenus: function(): boolean {
      return this.player.gameOptions.venusNextExtension;
    },
    showMoon: function(): boolean {
      return this.player.gameOptions.moonExpansion;
    },
    getTagsPlaceholders: function() {
      const tags: {[x: string]: Tags | SpecialTags} = {...Tags, ...SpecialTags};
      if (this.showColonyCount() === false) {
        delete tags.COLONY_COUNT;
      }
      if (this.showInfluence() === false) {
        delete tags.INFLUENCE;
      }
      if (this.showVenus() === false) {
        delete tags.VENUS;
      }
      if (this.showMoon() === false) {
        delete tags.MOON;
      }
      return tags;
    },
    getCardCount: function(): number {
      if (this.player.cardsInHandNbr) {
        return this.player.cardsInHandNbr;
      }
      return 0;
    },
    getTR: function(): number {
      return this.player.terraformRating;
    },
    getVpCount: function(): number {
      return this.player.victoryPointsBreakdown.total;
    },
    hideVpCount: function(): boolean {
      return !this.player.gameOptions.showOtherPlayersVP && !this.isActivePlayer;
    },
    showShortTags: function(): boolean {
      if (this.hideZeroTags === true) return true;
      return isTagsViewConcise(this.$root);
    },
    getTagCount(tagName: Tags | SpecialTags): number {
      if (tagName === SpecialTags.COLONY_COUNT && this.showColonyCount()) {
        return this.player.coloniesCount || 0;
      }
      if (tagName === SpecialTags.INFLUENCE && this.showInfluence()) {
        return this.player.influence || 0;
      }
      if (tagName === SpecialTags.CITY_COUNT) {
        return this.player.citiesCount || 0;
      }
      if (tagName === SpecialTags.NONE) {
        return this.player.noTagsCount || 0;
      }
      const basicTagFound = this.player.tags.find(
        (tag: ITagCount) => tag.tag === tagName,
      );

      if (basicTagFound !== undefined) {
        return basicTagFound.count;
      }

      return 0;
    },
  },
  template: `
        <div class="player-tags">
            <div class="player-tags-main">
                <tag-count :tag="'vp'" :count="getVpCount()" :size="'big'" :type="'main'" :hideCount="hideVpCount()" />
                <tag-count :tag="'tr'" :count="getTR()" :size="'big'" :type="'main'"/>
                <tag-count :tag="'cards'" :count="getCardCount()" :size="'big'" :type="'main'"/>
            </div>
            <div class="player-tags-secondary">
                <template v-if="showShortTags()">
                    <tag-count v-for="tag in player.tags" :key="tag.tag" :tag="tag.tag" :count="tag.count" :size="'big'" :type="'secondary'"/>
                </template>
                <template v-else>
                    <tag-count v-for="tagName in getTagsPlaceholders()" :key="tagName" :tag="tagName" :count="getTagCount(tagName)" :size="'big'" :type="'secondary'"/>
                </template>
            </div>
        </div>
    `,
});
