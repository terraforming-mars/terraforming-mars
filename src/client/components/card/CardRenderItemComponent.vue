<template>
  <div class="card-item-container">
    <div class="card-res-amount" v-if="item.showDigit">{{ getAmountAbs() }}</div>
    <div :class="getComponentClasses()" v-for="index in itemsToShow()" v-html="itemHtmlContent()" :key="index"/>
    <div class="card-over" v-if="this.item.over !== undefined">over {{this.item.over}}</div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {generateClassString} from '@/common/utils/utils';
import {CardRenderItemType} from '@/common/cards/render/CardRenderItemType';
import {AltSecondaryTag} from '@/common/cards/render/AltSecondaryTag';
import {Size} from '@/common/cards/render/Size';
import {Tag} from '@/common/cards/Tag';
import {ICardRenderItem, isICardRenderItem} from '@/common/cards/render/Types';

// microbe, animal and plant tag could be used both as a resource and played tag
const RESOURCE_AND_TAG_TYPES = [
  CardRenderItemType.ANIMALS,
  CardRenderItemType.PLANTS,
  CardRenderItemType.MICROBES,
  CardRenderItemType.SCIENCE,
  CardRenderItemType.CITY];

export default Vue.extend({
  name: 'CardRenderItemComponent',
  props: {
    item: {
      type: Object as () => ICardRenderItem,
    },
  },
  methods: {
    getComponentClasses(): string {
      let classes: Array<string> = [];

      const type: CardRenderItemType = this.item.type;
      if (type === CardRenderItemType.TEMPERATURE) {
        classes.push('card-global-requirement');
        classes.push('card-temperature-global-requirement');
      } else if (type === CardRenderItemType.OXYGEN) {
        classes.push('card-global-requirement');
        classes.push('card-oxygen-global-requirement');
      } else if (type === CardRenderItemType.OCEANS) {
        classes.push('card-global-requirement');
        classes.push('card-ocean-global-requirement');
        if (this.item.size !== undefined && this.item.size !== Size.MEDIUM) {
          classes.push(`card-ocean--${this.item.size}`);
        }
      } else if (type === CardRenderItemType.VENUS) {
        classes.push('card-global-requirement');
        classes.push('card-venus-global-requirement');
      } else if (type === CardRenderItemType.TR) {
        classes.push('card-tile');
        classes.push('card-tr');
        if (this.item.size !== undefined && this.item.size !== Size.MEDIUM) {
          classes.push(`card-tr--${this.item.size}`);
        }
      } else if (type === CardRenderItemType.TITANIUM) {
        classes.push('card-resource');
        classes.push('card-resource-titanium');
      } else if (type === CardRenderItemType.STEEL) {
        classes.push('card-resource');
        classes.push('card-resource-steel');
      } else if (type === CardRenderItemType.HEAT) {
        classes.push('card-resource');
        classes.push('card-resource-heat');
      } else if (type === CardRenderItemType.ENERGY) {
        classes.push('card-resource');
        classes.push('card-resource-energy');
      } else if (type === CardRenderItemType.PLANTS) {
        classes.push('card-resource');
        classes.push('card-resource-plant');
      } else if (type === CardRenderItemType.MEGACREDITS) {
        classes.push('card-resource');
        classes.push('card-resource-money');
        if (this.item.size !== undefined && this.item.size !== Size.MEDIUM) {
          classes.push(`card-money--${this.item.size}`);
        }
      } else if (type === CardRenderItemType.CARDS) {
        classes.push('card-resource');
        classes.push('card-card');
      } else if (type === CardRenderItemType.FLOATERS) {
        classes.push('card-resource');
        classes.push('card-resource-floater');
      } else if (type === CardRenderItemType.ASTEROIDS) {
        classes.push('card-resource');
        classes.push('card-resource-asteroid');
      } else if (type === CardRenderItemType.MICROBES) {
        classes.push('card-resource');
        classes.push('card-resource-microbe');
      } else if (type === CardRenderItemType.ANIMALS) {
        classes.push('card-resource');
        classes.push('card-resource-animal');
      } else if (type === CardRenderItemType.WILD) {
        classes.push('card-resource');
        classes.push('card-resource-wild');
        if (this.item.cancelled === true) classes.push('card-private-security');
      } else if (type === CardRenderItemType.PRESERVATION) {
        classes.push('card-resource');
        classes.push('card-resource-preservation');
      } else if (type === CardRenderItemType.FIGHTER) {
        classes.push('card-resource');
        classes.push('card-resource-fighter');
      } else if (type === CardRenderItemType.CAMPS) {
        classes.push('card-resource');
        classes.push('card-resource-camp');
      } else if (type === CardRenderItemType.DIVERSE_TAG) {
        classes.push('card-resource');
        classes.push('card-resource-diverse');
      } else if (type === CardRenderItemType.SCIENCE) {
        classes.push('card-resource');
        classes.push('card-resource-science');
      } else if (type === CardRenderItemType.TRADE) {
        classes.push('card-resource-trade');
        if (this.item.size === Size.SMALL) {
          classes.push('card-resource-colony--S');
        }
      } else if (type === CardRenderItemType.COLONIES) {
        classes.push('card-resource-colony');
        // TODO (chosta): think about an abstraction for item size
        if (this.item.size === Size.SMALL) {
          classes.push('card-resource-colony--S');
        }
      } else if (type === CardRenderItemType.TRADE_DISCOUNT || type === CardRenderItemType.MULTIPLIER_WHITE) {
        classes.push('card-resource');
        classes.push('card-resource-trade-discount');
      } else if (type === CardRenderItemType.TRADE_FLEET) {
        classes.push('card-resource-trade-fleet');
      } else if (type === CardRenderItemType.SYNDICATE_FLEET) {
        classes.push('card-resource');
        classes.push('card-resource-syndicate-fleet');
      } else if (type === CardRenderItemType.CHAIRMAN) {
        classes.push('card-chairman');
      } else if (type === CardRenderItemType.PARTY_LEADERS) {
        classes.push('card-party-leader');
      } else if (type === CardRenderItemType.DELEGATES) {
        classes.push('card-delegate');
      } else if (type === CardRenderItemType.INFLUENCE) {
        classes.push('card-influence');
        classes.push(`card-influence--size-${this.item.size}`);
      } else if (type === CardRenderItemType.NO_TAGS) {
        classes.push('card-resource-tag');
        classes.push('card-community-services');
      } else if (type === CardRenderItemType.CITY) {
        classes.push('card-tile');
        classes.push(`city-tile--${this.item.size}`);
      } else if (type === CardRenderItemType.GREENERY) {
        classes.push('card-tile');
        if (this.item.secondaryTag === AltSecondaryTag.OXYGEN) {
          classes.push(`greenery-tile-oxygen--${this.item.size}`);
        } else {
          classes.push(`greenery-tile--${this.item.size}`);
        }
      } else if (type === CardRenderItemType.EMPTY_TILE) {
        classes.push('card-tile-ares');
        if (this.item.size !== undefined) {
          classes.push(`board-space-tile--empty-tile--${this.item.size}`);
        }
      } else if (type === CardRenderItemType.EMPTY_TILE_GOLDEN) {
        classes.push('card-tile-ares');
        classes.push('board-space-tile--adjacency-tile');
      } else if (type === CardRenderItemType.EMPTY_TILE_SPECIAL) {
        classes.push('card-tile');
        if (this.item.size !== undefined) {
          classes.push(`special-tile--${this.item.size}`);
        } else {
          classes.push('special-tile');
        }
      } else if (type === CardRenderItemType.COMMUNITY) {
        classes.push('card-resource');
        classes.push('card-resource-community');
      } else if (type === CardRenderItemType.DISEASE) {
        classes.push('card-resource');
        classes.push('card-resource-disease');
      } else if (type === CardRenderItemType.DATA_RESOURCE) {
        classes.push('card-resource');
        classes.push('card-resource-data');
      } else if (type === CardRenderItemType.RESOURCE_CUBE) {
        classes.push('card-resource');
        classes.push('card-resource-cube');
      } else if (type === CardRenderItemType.VENUSIAN_HABITAT) {
        classes.push('card-resource');
        classes.push('card-resource-venusian-habitat');
      } else if (type === CardRenderItemType.SPECIALIZED_ROBOT) {
        classes.push('card-resource');
        classes.push('card-resource-specialized-robot');
      } else if (type === CardRenderItemType.SEED) {
        classes.push('card-resource');
        classes.push('card-resource-seed');
      } else if (type === CardRenderItemType.ORBITAL) {
        classes.push('card-resource');
        classes.push('card-resource-orbital');
      } else if (type === CardRenderItemType.AGENDA) {
        classes.push('card-resource');
        classes.push('card-resource-agenda');
      } else if (this.item.type === CardRenderItemType.MOON_HABITAT) {
        if (this.item.secondaryTag === AltSecondaryTag.MOON_HABITAT_RATE) {
          classes.push(sized('card-tile-lunar-colony-rate', this.item.size));
        } else {
          classes.push(sized('card-tile-lunar-colony', this.item.size));
        }
      } else if (type === CardRenderItemType.GLOBAL_EVENT) {
        classes.push('turmoil-global-event');
      }

      function sized(clazz: string, size: string | undefined) {
        return size !== undefined ? `${clazz}--${size}` : clazz;
      }

      if (this.item.type === CardRenderItemType.MOON_HABITAT_RATE) {
        classes.push('card-colony-rate');
        if (this.item.size !== undefined) classes.push(`card-colony-rate--${this.item.size}`);
      }
      if (this.item.type === CardRenderItemType.MOON_MINE) {
        if (this.item.secondaryTag === AltSecondaryTag.MOON_MINING_RATE) {
          classes.push(sized('card-tile-lunar-mine-rate', this.item.size));
        } else {
          classes.push(sized('card-tile-lunar-mine', this.item.size));
        }
      }
      if (this.item.type === CardRenderItemType.MOON_MINING_RATE) {
        classes.push('card-mining-rate');
        if (this.item.size !== undefined) classes.push(`card-mining-rate--${this.item.size}`);
      }
      if (this.item.type === CardRenderItemType.MOON_ROAD) {
        if (this.item.secondaryTag === AltSecondaryTag.MOON_LOGISTICS_RATE) {
          classes.push(sized('card-tile-lunar-road-rate', this.item.size));
        } else {
          classes.push(sized('card-tile-lunar-road', this.item.size));
        }
      }
      if (this.item.type === CardRenderItemType.MOON_LOGISTICS_RATE) {
        classes.push('card-logistics-rate');
        if (this.item.size !== undefined) classes.push(`card-logistics-rate--${this.item.size}`);
      }
      if (this.item.type === CardRenderItemType.PLANETARY_TRACK) {
        classes.push('card-planetary-track');
      }

      if (this.item.secondaryTag === AltSecondaryTag.NO_PLANETARY_TAG) {
        classes.push('tag-clone');
      }
      // round tags
      if (this.item.isPlayed) {
        // override resource behavior
        if (RESOURCE_AND_TAG_TYPES.includes(type)) {
          classes = classes.filter((c) => c !== 'card-resource');
        }
        classes.push('card-resource-tag');
        if (type === CardRenderItemType.EVENT) {
          classes.push('card-tag-event');
        } else if (type === CardRenderItemType.SPACE) {
          classes.push('card-tag-space');
        } else if (type === CardRenderItemType.SCIENCE) {
          classes.push('card-tag-science');
        } else if (type === CardRenderItemType.JOVIAN) {
          classes.push('card-tag-jovian');
        } else if (type === CardRenderItemType.VENUS) {
          classes.push('card-tag-venus');
        } else if (type === CardRenderItemType.EARTH) {
          classes.push('card-tag-earth');
        } else if (type === CardRenderItemType.BUILDING) {
          classes.push('card-tag-building');
        } else if (type === CardRenderItemType.CITY) {
          classes.push('card-tag tag-city');
        } else if (this.item.type === CardRenderItemType.MARS) {
          classes.push('card-tag tag-mars');
        }
      }

      // act upon any player
      if (this.item.anyPlayer === true) {
        if (type === CardRenderItemType.DELEGATES) {
          classes.push('card-delegate-red');
        } else if (type === CardRenderItemType.CHAIRMAN) {
          classes.push('card-chairman-red');
        } else {
          classes.push('red-outline');
        }
      }

      // golden background
      if (this.item.isPlate) {
        classes.push('card-plate');
      }

      // size and text
      if (this.item.text !== undefined) {
        classes.push(`card-text-size--${this.item.size}`);
        if (this.item.isUppercase) {
          classes.push('card-text-uppercase');
        }
        if (this.item.isBold) {
          classes.push('card-text-bold');
        } else {
          classes.push('card-text-normal');
        }
      }

      return generateClassString(classes);
    },
    getAmountAbs(): number {
      if (this.item.amountInside) return 1;
      return Math.abs(this.item.amount);
    },
    itemsToShow(): number {
      if (this.item.showDigit) return 1;
      return this.getAmountAbs();
    },
    // Oooh this is begging to be a template or something.
    itemHtmlContent(): string {
      let result = '';
      // in case of symbols inside
      if (isICardRenderItem(this.item) && this.item.amountInside) {
        if (this.item.amount !== 0) {
          result += this.item.amount.toString();
        }
        if (this.item.multiplier) {
          result += 'X';
        }
      }

      const previouslyRendered: Array<Tag | AltSecondaryTag> = [
        AltSecondaryTag.OXYGEN,
        AltSecondaryTag.MOON_HABITAT_RATE,
        AltSecondaryTag.MOON_MINING_RATE,
        AltSecondaryTag.MOON_LOGISTICS_RATE,
      ];
      // Oxygen is handled specially separately.
      const secondaryTag = this.item.secondaryTag;
      if (secondaryTag !== undefined && !previouslyRendered.includes(secondaryTag)) {
        result += '<div class="card-icon card-tag-' + secondaryTag + '"></div>';
      }
      if (this.item.isPlate || this.item.text !== undefined) {
        result += this.item.text || 'n/a';
      }
      if (this.item.type === CardRenderItemType.NO_TAGS || this.item.type === CardRenderItemType.MULTIPLIER_WHITE) {
        result = 'X';
      } else if (this.item.type === CardRenderItemType.PROJECT_REQUIREMENTS || this.item.type === CardRenderItemType.IGNORE_GLOBAL_REQUIREMENTS) {
        result += '<div class="card-project-requirements">';
        result += '<div class="card-x">x</div>';
        result += '<div class="card-requirements">Global Requirements</div>';
        result += '</div>';
      }
      if (this.item.type === CardRenderItemType.SELF_REPLICATING) {
        result = '<div class="card-resource card-card"><div class="cards-count">2</div><div class="card-icon card-icon-space">✴</div><div class="card-icon card-icon-building">☗</div></div>';
      }
      if (this.item.type === CardRenderItemType.PLACE_COLONY) {
        result = '<span class="card-place-colony">colony</span>';
      }
      if (this.item.type === CardRenderItemType.PRELUDE) {
        result = '<div class="card-prelude-container"><span class="card-prelude-icon">prel</span></div>';
      }
      if (this.item.type === CardRenderItemType.CORPORATION) {
        result = '<div class="card-corporation-icon"></div>';
      }
      if (this.item.type === CardRenderItemType.FIRST_PLAYER) {
        result = '<div class="card-first-player-icon"></div>';
      }
      if (this.item.type === CardRenderItemType.RULING_PARTY) {
        result = '<div class="card-party-icon"></div>';
      }
      if (this.item.type === CardRenderItemType.AWARD) {
        result = '<span class="card-award-icon">award</span>';
      }
      if (this.item.type === CardRenderItemType.VP) {
        result = '<div class="card-resource points-big card-vp-questionmark">?</div>';
      }
      // TODO(chosta): find a reasonable way to represent "?" (alphanumeric maybe)
      // This is assocaited with the card Playwrights.
      if (this.item.type === CardRenderItemType.MEGACREDITS && this.item.amount === 1000) {
        result = '?';
      }
      if (this.item.type === CardRenderItemType.MOON) {
        return '<div class="card-tag-moon-on-card"></div>';
      }
      if (this.item.type === CardRenderItemType.RESOURCE_CUBE) {
        return '<div class="board-cube--bronze"></div>';
      }
      // TODO(chosta): abstract once another case of cancel (X) on top of an item is needed
      if (this.item.type === CardRenderItemType.TR && this.item.cancelled === true) {
        result = '<div class="card-x">x</div>';
      }
      if (this.item.type === CardRenderItemType.WILD && this.item.cancelled === true) {
        result = '<div class="card-x">✕</div>';
      }

      return result;
    },
  },
});

</script>

