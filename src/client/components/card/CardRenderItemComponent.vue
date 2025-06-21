<template>
  <div class="card-item-container">
    <div class="card-res-amount" v-if="item.showDigit">{{ amountAbs }}</div>
    <div :class="componentClasses" v-for="index in itemsToShow" v-html="itemHtmlContent" :key="index"/>
    <div class="card-over" v-if="item.over !== undefined">over {{item.over}}</div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {CardRenderItemType} from '@/common/cards/render/CardRenderItemType';
import {AltSecondaryTag} from '@/common/cards/render/AltSecondaryTag';
import {Size} from '@/common/cards/render/Size';
import {Tag} from '@/common/cards/Tag';
import {ICardRenderItem, isICardRenderItem} from '@/common/cards/render/Types';
import {CardResource} from '@/common/CardResource';

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
    resourceClass(): string {
      if (this.item.resource === undefined) {
        return '';
      }
      if (this.item.resource === CardResource.RESOURCE_CUBE) {
        return 'card-resource-cube';
      }
      return 'card-resource-' + this.item.resource.toLowerCase().replaceAll(' ', '-');
    },
    resourceSizeClass(): string {
      if (this.item.size !== undefined) {
        return 'card-resource-size--' + this.item.size;
      }
      return '';
    },
    tagClass(): string {
      if (this.item.tag === undefined) {
        return '';
      }
      return 'card-tag-' + this.item.tag.toLowerCase().replaceAll(' ', '-');
    },
    componentClasses(): ReadonlyArray<string> {
      const classes: Array<string> = [];
      if (this.item.isSuperscript) {
        classes.push('card-superscript');
      }

      classes.push(...this.componentClassArray);

      if (this.item.secondaryTag === AltSecondaryTag.NO_PLANETARY_TAG) {
        classes.push('tag-clone');
      }

      // act upon any player
      if (this.item.anyPlayer === true) {
        const type = this.item.type;
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
    componentClassArray(): Array<string> {
      let cardResource = 'card-resource';
      if (this.item.secondaryTag) {
        cardResource = 'card-resource--has-secondary-tag';
      } else if (this.item.isSuperscript) {
        cardResource = 'card-resource--superscript';
      }

      switch (this.item.type) {
      case CardRenderItemType.TEMPERATURE:
        return ['card-global-requirement', 'card-temperature-global-requirement'];
      case CardRenderItemType.OXYGEN:
        return ['card-global-requirement', 'card-oxygen-global-requirement'];
      case CardRenderItemType.OCEANS:
        if (this.item.size !== undefined && this.item.size !== Size.MEDIUM) {
          return ['card-global-requirement', 'card-ocean-global-requirement', `card-ocean--${this.item.size}`];
        } else {
          return ['card-global-requirement', 'card-ocean-global-requirement'];
        }
      case CardRenderItemType.VENUS:
        return ['card-global-requirement', 'card-venus-global-requirement'];
      case CardRenderItemType.TR:
        if (this.item.size !== undefined && this.item.size !== Size.MEDIUM) {
          return ['card-tile', 'card-tr', `card-tr--${this.item.size}`];
        } else {
          return ['card-tile', 'card-tr'];
        }
      case CardRenderItemType.TITANIUM:
        return [cardResource, 'card-resource-titanium'];
      case CardRenderItemType.STEEL:
        return [cardResource, 'card-resource-steel'];
      case CardRenderItemType.HEAT:
        return [cardResource, 'card-resource-heat'];
      case CardRenderItemType.ENERGY:
        return [cardResource, 'card-resource-energy'];
      case CardRenderItemType.PLANTS:
        return [cardResource, 'card-resource-plant'];
      case CardRenderItemType.MEGACREDITS:
        if (this.item.size !== undefined && this.item.size !== Size.MEDIUM) {
          return [cardResource, 'card-resource-money', `card-money--${this.item.size}`];
        } else {
          return [cardResource, 'card-resource-money'];
        }
      case CardRenderItemType.CARDS:
        return [cardResource, 'card-card'];
      case CardRenderItemType.WILD:
        if (this.item.cancelled === true) {
          return [cardResource, 'card-resource-wild', 'card-private-security'];
        } else {
          return [cardResource, 'card-resource-wild'];
        }
      case CardRenderItemType.ONE:
        return [cardResource, 'card-resource-one'];
      case CardRenderItemType.DIVERSE_TAG:
        return ['card-resource-tag', 'card-resource-diverse'];
      case CardRenderItemType.TRADE:
        if (this.item.size === Size.SMALL) {
          return ['card-resource-trade', 'card-resource-colony--S'];
        } else {
          return ['card-resource-trade'];
        }
      case CardRenderItemType.COLONIES:
        // TODO (chosta): think about an abstraction for item size
        if (this.item.size === Size.SMALL) {
          return ['card-resource-colony', 'card-resource-colony--S'];
        } else {
          return ['card-resource-colony'];
        }
      case CardRenderItemType.TRADE_DISCOUNT:
      case CardRenderItemType.MULTIPLIER_WHITE:
        return [cardResource, 'card-resource-trade-discount'];
      case CardRenderItemType.TRADE_FLEET:
        return ['card-resource-trade-fleet'];
      case CardRenderItemType.CHAIRMAN:
        return ['card-chairman'];
      case CardRenderItemType.PARTY_LEADERS:
        return ['card-party-leader'];
      case CardRenderItemType.DELEGATES:
        return ['card-delegate'];
      case CardRenderItemType.INFLUENCE:
        return ['card-influence', `card-influence--size-${this.item.size}`];
      case CardRenderItemType.NO_TAGS:
        return ['card-resource-tag', 'card-no-tags'];
      case CardRenderItemType.EMPTY_TAG:
        return ['card-resource-tag', 'card-tag-empty'];
      case CardRenderItemType.CITY:
        return ['card-tile', `city-tile--${this.item.size}`];
      case CardRenderItemType.GREENERY:
        if (this.item.secondaryTag === AltSecondaryTag.OXYGEN) {
          return ['card-tile', `greenery-tile-oxygen--${this.item.size}`];
        } else {
          return ['card-tile', `greenery-tile--${this.item.size}`];
        }
      case CardRenderItemType.EMPTY_TILE:
        if (this.item.size !== undefined) {
          return ['card-tile-ares', `board-space-tile--empty-tile--${this.item.size}`];
        } else {
          return ['card-tile-ares'];
        }
      case CardRenderItemType.EMPTY_TILE_GOLDEN:
        return ['card-tile-ares', 'board-space-tile--adjacency-tile'];
      case CardRenderItemType.EMPTY_TILE_SPECIAL:
        if (this.item.size !== undefined) {
          return ['card-tile', `special-tile--${this.item.size}`];
        } else {
          return ['card-tile', 'special-tile'];
        }
      case CardRenderItemType.CITY_OR_SPECIAL_TILE:
        return ['card-tile', 'city-or-special-tile'];
      case CardRenderItemType.COMMUNITY:
        return [cardResource, 'card-resource-community'];
      case CardRenderItemType.MOON_HABITAT:
        if (this.item.secondaryTag === AltSecondaryTag.MOON_HABITAT_RATE) {
          return [this.sized('card-tile-lunar-habitat-rate', this.item.size)];
        } else {
          return [this.sized('card-tile-lunar-habitat', this.item.size)];
        }
      case CardRenderItemType.GLOBAL_EVENT:
        return ['turmoil-global-event'];
      case CardRenderItemType.POLICY:
        return ['turmoil-policy-tile'];

      // CEOs:
      case CardRenderItemType.ARROW_OPG:
        return ['card-arrow-opg'];
      case CardRenderItemType.REDS:
        return ['card-reds'];
      case CardRenderItemType.REDS_DEACTIVATED:
        return ['card-reds-deactivated'];
      case CardRenderItemType.ADJACENCY_BONUS:
        return ['card-adjacency-bonus'];
      case CardRenderItemType.HAZARD_TILE:
        if (this.item.size !== undefined && this.item.size !== Size.MEDIUM) {
          return [`card-hazard-tile--${this.item.size}`];
        } else {
          return ['card-hazard-tile'];
        }
      case CardRenderItemType.MOON_HABITAT_RATE:
        if (this.item.size !== undefined) {
          return ['card-habitat-rate', `card-habitat-rate--${this.item.size}`];
        } else {
          return ['card-habitat-rate'];
        }
      case CardRenderItemType.MOON_MINE:
        if (this.item.secondaryTag === AltSecondaryTag.MOON_MINING_RATE) {
          return [this.sized('card-tile-lunar-mine-rate', this.item.size)];
        } else {
          return [this.sized('card-tile-lunar-mine', this.item.size)];
        }
      case CardRenderItemType.MOON_MINING_RATE:
        if (this.item.size !== undefined) {
          return ['card-mining-rate', `card-mining-rate--${this.item.size}`];
        } else {
          return ['card-mining-rate'];
        }
      case CardRenderItemType.MOON_ROAD:
        if (this.item.secondaryTag === AltSecondaryTag.MOON_LOGISTICS_RATE) {
          return [this.sized('card-tile-lunar-road-rate', this.item.size)];
        } else {
          return [this.sized('card-tile-lunar-road', this.item.size)];
        }
      case CardRenderItemType.MOON_LOGISTICS_RATE:
        if (this.item.size !== undefined) {
          return ['card-logistics-rate', `card-logistics-rate--${this.item.size}`];
        } else {
          return ['card-logistics-rate'];
        }
      case CardRenderItemType.PLANETARY_TRACK:
        return ['card-planetary-track'];
      case CardRenderItemType.CATHEDRAL:
        return [cardResource, 'card-resource-cathedral'];
      case CardRenderItemType.NOMADS:
        return [cardResource, 'card-resource-nomads'];
      case CardRenderItemType.IDENTIFY:
        return ['card-identification'];
      case CardRenderItemType.EXCAVATE:
        return [this.item.isSuperscript ? 'card-excavation--superscript' : 'card-excavation'];
      case CardRenderItemType.CORRUPTION:
        return [cardResource, 'card-resource-corruption'];
      case CardRenderItemType.RESOURCE:
        return [cardResource, this.resourceClass, this.resourceSizeClass];
      case CardRenderItemType.TAG:
        return ['card-resource-tag', this.tagClass];
      case CardRenderItemType.NEUTRAL_DELEGATE:
        return ['card-neutral-delegate'];
      case CardRenderItemType.UNDERGROUND_RESOURCES:
        return ['card-underground-resources'];
      case CardRenderItemType.CORRUPTION_SHIELD:
        return ['card-corruption-shield'];
      case CardRenderItemType.GEOSCAN_ICON:
        return ['card-geoscan-icon'];
      case CardRenderItemType.UNDERGROUND_SHELTERS:
        return ['card-underground-shelters'];
      default:
        return [];
      }
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
      if (this.item.type === CardRenderItemType.MULTIPLIER_WHITE) {
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
      // TODO(chosta): abstract once another case of cancel (X) on top of an item is needed
      if (this.item.cancelled === true) {
        switch (this.item.type) {
        case CardRenderItemType.TR:
        case CardRenderItemType.WILD:
        case CardRenderItemType.UNDERGROUND_RESOURCES:
        case CardRenderItemType.TRADE:
          result = '<div class="card-x">x</div>';
        }
      }

      return result;
    },
  },
});
</script>
