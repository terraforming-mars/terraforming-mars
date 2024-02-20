<template>
  <div class="card-item-container">
    <div class="card-res-amount" v-if="item.showDigit">{{ amountAbs }}</div>
    <div :class="componentClasses" v-for="index in itemsToShow" v-html="itemHtmlContent" :key="index"/>
    <div class="card-over" v-if="this.item.over !== undefined">over {{this.item.over}}</div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
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
    sized(clazz: string, size: string | undefined) {
      return size !== undefined ? `${clazz}--${size}` : clazz;
    },
  },
  computed: {
    cardResource(): string {
      return this.item.secondaryTag !== undefined ? 'card-resource--has-secondary-tag' : 'card-resource';
    },
    componentClasses(): ReadonlyArray<string> {
      let classes = [];
      switch (this.item.type) {
      case CardRenderItemType.TEMPERATURE:
        classes.push('card-global-requirement', 'card-temperature-global-requirement');
        break;
      case CardRenderItemType.OXYGEN:
        classes.push('card-global-requirement', 'card-oxygen-global-requirement');
        break;
      case CardRenderItemType.OCEANS:
        classes.push('card-global-requirement', 'card-ocean-global-requirement');
        if (this.item.size !== undefined && this.item.size !== Size.MEDIUM) {
          classes.push(`card-ocean--${this.item.size}`);
        }
        break;
      case CardRenderItemType.VENUS:
        classes.push('card-global-requirement', 'card-venus-global-requirement');
        break;
      case CardRenderItemType.TR:
        classes.push('card-tile', 'card-tr');
        if (this.item.size !== undefined && this.item.size !== Size.MEDIUM) {
          classes.push(`card-tr--${this.item.size}`);
        }
        break;
      case CardRenderItemType.TITANIUM:
        classes.push(this.cardResource, 'card-resource-titanium');
        break;
      case CardRenderItemType.STEEL:
        classes.push(this.cardResource, 'card-resource-steel');
        break;
      case CardRenderItemType.HEAT:
        classes.push(this.cardResource, 'card-resource-heat');
        break;
      case CardRenderItemType.ENERGY:
        classes.push(this.cardResource, 'card-resource-energy');
        break;
      case CardRenderItemType.PLANTS:
        classes.push(this.cardResource, 'card-resource-plant');
        break;
      case CardRenderItemType.MEGACREDITS:
        classes.push(this.cardResource, 'card-resource-money');
        if (this.item.size !== undefined && this.item.size !== Size.MEDIUM) {
          classes.push(`card-money--${this.item.size}`);
        }
        break;
      case CardRenderItemType.CARDS:
        classes.push(this.cardResource, 'card-card');
        break;
      case CardRenderItemType.FLOATERS:
        classes.push(this.cardResource, 'card-resource-floater');
        break;
      case CardRenderItemType.ASTEROIDS:
        classes.push(this.cardResource, 'card-resource-asteroid');
        break;
      case CardRenderItemType.MICROBES:
        classes.push(this.cardResource, 'card-resource-microbe');
        break;
      case CardRenderItemType.ANIMALS:
        classes.push(this.cardResource, 'card-resource-animal');
        break;
      case CardRenderItemType.WILD:
        classes.push(this.cardResource, 'card-resource-wild');
        if (this.item.cancelled === true) {
          classes.push('card-private-security');
        }
        break;
      case CardRenderItemType.PRESERVATION:
        classes.push(this.cardResource, 'card-resource-preservation');
        break;
      case CardRenderItemType.FIGHTER:
        classes.push(this.cardResource, 'card-resource-fighter');
        break;
      case CardRenderItemType.CAMPS:
        classes.push(this.cardResource, 'card-resource-camp');
        break;
      case CardRenderItemType.DIVERSE_TAG:
        classes.push(this.cardResource, 'card-resource-diverse');
        break;
      case CardRenderItemType.SCIENCE:
        classes.push(this.cardResource, 'card-resource-science');
        break;
      case CardRenderItemType.TRADE:
        classes.push('card-resource-trade');
        if (this.item.size === Size.SMALL) {
          classes.push('card-resource-colony--S');
        }
        break;
      case CardRenderItemType.COLONIES:
        classes.push('card-resource-colony');
        // TODO (chosta): think about an abstraction for item size
        if (this.item.size === Size.SMALL) {
          classes.push('card-resource-colony--S');
        }
        break;
      case CardRenderItemType.TRADE_DISCOUNT:
      case CardRenderItemType.MULTIPLIER_WHITE:
        classes.push(this.cardResource, 'card-resource-trade-discount');
        break;
      case CardRenderItemType.TRADE_FLEET:
        classes.push('card-resource-trade-fleet');
        break;
      case CardRenderItemType.SYNDICATE_FLEET:
        classes.push(this.cardResource, 'card-resource-syndicate-fleet');
        break;
      case CardRenderItemType.CHAIRMAN:
        classes.push('card-chairman');
        break;
      case CardRenderItemType.PARTY_LEADERS:
        classes.push('card-party-leader');
        break;
      case CardRenderItemType.DELEGATES:
        classes.push('card-delegate');
        break;
      case CardRenderItemType.INFLUENCE:
        classes.push('card-influence', `card-influence--size-${this.item.size}`);
        break;
      case CardRenderItemType.NO_TAGS:
        classes.push('card-resource-tag', 'card-community-services');
        break;
      case CardRenderItemType.EMPTY_TAG:
        classes.push('card-resource-tag', 'card-tag-empty');
        break;
      case CardRenderItemType.CITY:
        if (this.item.isPlayed !== true) {
          classes.push('card-tile', `city-tile--${this.item.size}`);
        }
        break;
      case CardRenderItemType.GREENERY:
        classes.push('card-tile');
        if (this.item.secondaryTag === AltSecondaryTag.OXYGEN) {
          classes.push(`greenery-tile-oxygen--${this.item.size}`);
        } else {
          classes.push(`greenery-tile--${this.item.size}`);
        }
        break;
      case CardRenderItemType.EMPTY_TILE:
        classes.push('card-tile-ares');
        if (this.item.size !== undefined) {
          classes.push(`board-space-tile--empty-tile--${this.item.size}`);
        }
        break;
      case CardRenderItemType.EMPTY_TILE_GOLDEN:
        classes.push('card-tile-ares', 'board-space-tile--adjacency-tile');
        break;
      case CardRenderItemType.EMPTY_TILE_SPECIAL:
        classes.push('card-tile');
        if (this.item.size !== undefined) {
          classes.push(`special-tile--${this.item.size}`);
        } else {
          classes.push('special-tile');
        }
        break;
      case CardRenderItemType.CITY_OR_SPECIAL_TILE:
        classes.push('card-tile', 'city-or-special-tile');
        break;
      case CardRenderItemType.COMMUNITY:
        classes.push(this.cardResource, 'card-resource-community');
        break;
      case CardRenderItemType.DISEASE:
        classes.push(this.cardResource, 'card-resource-disease');
        break;
      case CardRenderItemType.DATA_RESOURCE:
        classes.push(this.cardResource, 'card-resource-data');
        break;
      case CardRenderItemType.RESOURCE_CUBE:
        classes.push(this.cardResource, 'card-resource-cube');
        break;
      case CardRenderItemType.VENUSIAN_HABITAT:
        classes.push(this.cardResource, 'card-resource-venusian-habitat');
        break;
      case CardRenderItemType.SPECIALIZED_ROBOT:
        classes.push(this.cardResource, 'card-resource-specialized-robot');
        break;
      case CardRenderItemType.SEED:
        classes.push(this.cardResource, 'card-resource-seed');
        break;
      case CardRenderItemType.ORBITAL:
        classes.push(this.cardResource, 'card-resource-orbital');
        break;
      case CardRenderItemType.AGENDA:
        classes.push(this.cardResource, 'card-resource-agenda');
        break;
      case CardRenderItemType.MOON_HABITAT:
        if (this.item.secondaryTag === AltSecondaryTag.MOON_HABITAT_RATE) {
          classes.push(this.sized('card-tile-lunar-habitat-rate', this.item.size));
        } else {
          classes.push(this.sized('card-tile-lunar-habitat', this.item.size));
        }
        break;
      case CardRenderItemType.GLOBAL_EVENT:
        classes.push('turmoil-global-event');
        break;

      // CEOs:
      case CardRenderItemType.ARROW_OPG:
        classes.push('card-arrow-opg');
        break;
      case CardRenderItemType.REDS:
        classes.push('card-reds');
        break;
      case CardRenderItemType.REDS_DEACTIVATED:
        classes.push('card-reds-deactivated');
        break;
      case CardRenderItemType.ADJACENCY_BONUS:
        classes.push('card-adjacency-bonus');
        break;
      case CardRenderItemType.HAZARD_TILE:
        if (this.item.size !== undefined && this.item.size !== Size.MEDIUM) {
          classes.push(`card-hazard-tile--${this.item.size}`);
        } else {
          classes.push('card-hazard-tile');
        }
        break;
      case CardRenderItemType.CLONE_TROOPER:
        classes.push(this.cardResource, 'card-resource-clone-trooper');
        break;
      case CardRenderItemType.MOON_HABITAT_RATE:
        classes.push('card-colony-rate');
        if (this.item.size !== undefined) {
          classes.push(`card-colony-rate--${this.item.size}`);
        }
        break;
      case CardRenderItemType.MOON_MINE:
        if (this.item.secondaryTag === AltSecondaryTag.MOON_MINING_RATE) {
          classes.push(this.sized('card-tile-lunar-mine-rate', this.item.size));
        } else {
          classes.push(this.sized('card-tile-lunar-mine', this.item.size));
        }
        break;
      case CardRenderItemType.MOON_MINING_RATE:
        classes.push('card-mining-rate');
        if (this.item.size !== undefined) classes.push(`card-mining-rate--${this.item.size}`);
        break;
      case CardRenderItemType.MOON_ROAD:
        if (this.item.secondaryTag === AltSecondaryTag.MOON_LOGISTICS_RATE) {
          classes.push(this.sized('card-tile-lunar-road-rate', this.item.size));
        } else {
          classes.push(this.sized('card-tile-lunar-road', this.item.size));
        }
        break;
      case CardRenderItemType.MOON_LOGISTICS_RATE:
        classes.push('card-logistics-rate');
        if (this.item.size !== undefined) classes.push(`card-logistics-rate--${this.item.size}`);
        break;
      case CardRenderItemType.PLANETARY_TRACK:
        classes.push('card-planetary-track');
        break;
      case CardRenderItemType.CATHEDRAL:
        classes.push(this.cardResource, 'card-resource-cathedral');
        break;
      case CardRenderItemType.GRAPHENE:
        classes.push(this.cardResource, 'card-resource-graphene');
        break;
      case CardRenderItemType.NOMADS:
        classes.push(this.cardResource, 'card-resource-nomads');
        break;
      case CardRenderItemType.HYDROELECTRIC_RESOURCE:
        classes.push(this.cardResource, 'card-resource-hydroelectric-resource');
        break;
      case CardRenderItemType.IDENTIFY:
        classes.push('card-identification');
        break;
      case CardRenderItemType.EXCAVATE:
        classes.push('card-excavation');
        break;
      case CardRenderItemType.CORRUPTION:
        classes.push(this.cardResource, 'card-resource-corruption');
        break;
      case CardRenderItemType.TOOL:
        classes.push(this.cardResource, 'card-resource-tool');
        break;
      case CardRenderItemType.WARE:
        classes.push(this.cardResource, 'card-resource-ware');
        break;
      case CardRenderItemType.SCOOP:
        classes.push(this.cardResource, 'card-resource-scoop');
        break;
      case CardRenderItemType.JOURNALISM:
        classes.push(this.cardResource, 'card-resource-journalism');
        break;
      case CardRenderItemType.ACTIVIST:
        classes.push(this.cardResource, 'card-resource-activist');
        break;
      case CardRenderItemType.SUPPLY_CHAIN:
        classes.push(this.cardResource, 'card-resource-supply-chain');
        break;
      case CardRenderItemType.NEUTRAL_DELEGATE:
        classes.push('card-neutral-delegate');
        break;
      case CardRenderItemType.UNDERGROUND_RESOURCES:
        classes.push('card-underground-resources');
        break;
      case CardRenderItemType.CORRUPTION_SHIELD:
        classes.push('card-corruption-shield');
        break;
      case CardRenderItemType.GEOSCAN_ICON:
        classes.push('card-geoscan-icon');
        break;
      }

      if (this.item.secondaryTag === AltSecondaryTag.NO_PLANETARY_TAG) {
        classes.push('tag-clone');
      }

      const type = this.item.type;
      // round tags
      if (this.item.isPlayed) {
        // override resource behavior
        if (RESOURCE_AND_TAG_TYPES.includes(type)) {
          classes = classes.filter((c) => c !== this.cardResource);
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
        if (this.item.size === Size.SMALL) {
          classes.push('card-plate--narrow');
        }
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
      return classes;
    },
    amountAbs(): number {
      if (this.item.amountInside) return 1;
      return Math.abs(this.item.amount);
    },
    itemsToShow(): number {
      if (this.item.showDigit) return 1;
      return this.amountAbs;
    },
    // Oooh this is begging to be a template or something.
    itemHtmlContent(): string {
      let result = '';
      // in case of symbols inside
      if (isICardRenderItem(this.item)) {
        if (this.item.innerText) {
          result += this.item.innerText;
        } else if (this.item.amountInside) {
          if (this.item.amount !== 0) {
            result += this.item.amount.toString();
          }

          if (this.item.clone) {
            result += '<div style="-webkit-filter: greyscale(100%);filter: grayscale(100%)">🪐</div>';
          }
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
      } else if (this.item.type === CardRenderItemType.IGNORE_GLOBAL_REQUIREMENTS) {
        result += '<div class="card-project-requirements">';
        result += '<div class="card-x">x</div>';
        result += '<div class="card-requirements">Global Requirements</div>';
        result += '</div>';
      }
      if (this.item.type === CardRenderItemType.SELF_REPLICATING) {
        result = '<div class="card-resource card-card"><div class="cards-count">2</div><div class="card-icon card-icon-space">✴</div><div class="card-icon card-icon-building">☗</div></div>';
      }
      if (this.item.type === CardRenderItemType.COLONY_TILE) {
        result = '<span class="card-colony-tile">colony</span>';
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
      if (this.item.type === CardRenderItemType.MILESTONE) {
        result = '<span class="card-award-icon">milestone</span>';
      }
      if (this.item.type === CardRenderItemType.VP) {
        result = '<div class="card-resource points-big card-vp-questionmark">?</div>';
      }
      if (this.item.type === CardRenderItemType.MEGACREDITS && this.item.amount === undefined) {
        result = '?';
      }
      if (this.item.type === CardRenderItemType.MOON) {
        return '<div class="card-tag-moon-on-card"></div>';
      }
      if (this.item.type === CardRenderItemType.RESOURCE_CUBE) {
        return '<div class="board-cube--bronze"></div>';
      }
      // TODO(chosta): abstract once another case of cancel (X) on top of an item is needed
      if (this.item.cancelled === true) {
        switch (this.item.type) {
        case CardRenderItemType.TR:
        case CardRenderItemType.WILD:
        case CardRenderItemType.UNDERGROUND_RESOURCES:
          result = '<div class="card-x">x</div>';
        }
      }

      return result;
    },
  },
});
</script>
