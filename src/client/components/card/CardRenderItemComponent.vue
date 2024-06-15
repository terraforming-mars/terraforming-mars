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
      if (this.item.secondaryTag) {
        return 'card-resource--has-secondary-tag';
      }
      if (this.item.isSuperscript) {
        return 'card-resource--superscript';
      }
      return 'card-resource';
    },
    resourceClass(): string {
      if (this.item.resource === undefined) {
        return '';
      }
      return 'card-resource-' + this.item.resource.toLowerCase().replaceAll(' ', '-');
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
      case CardRenderItemType.WILD:
        classes.push(this.cardResource, 'card-resource-wild');
        if (this.item.cancelled === true) {
          classes.push('card-private-security');
        }
        break;
      case CardRenderItemType.DIVERSE_TAG:
        classes.push('card-resource-tag', 'card-resource-diverse');
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
        classes.push('card-resource-tag', 'card-no-tags');
        break;
      case CardRenderItemType.EMPTY_TAG:
        classes.push('card-resource-tag', 'card-tag-empty');
        break;
      case CardRenderItemType.CITY:
        classes.push('card-tile', `city-tile--${this.item.size}`);
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
      case CardRenderItemType.POLICY:
        classes.push('turmoil-policy-tile');
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
      case CardRenderItemType.NOMADS:
        classes.push(this.cardResource, 'card-resource-nomads');
        break;
      case CardRenderItemType.IDENTIFY:
        classes.push('card-identification');
        break;
      case CardRenderItemType.EXCAVATE:
        classes.push(this.item.isSuperscript ? 'card-excavation--superscript' : 'card-excavation');
        break;
      case CardRenderItemType.CORRUPTION:
        classes.push(this.cardResource, 'card-resource-corruption');
        break;
      case CardRenderItemType.RESOURCE:
        classes.push(this.cardResource, this.resourceClass);
        break;
      case CardRenderItemType.TAG:
        classes.push('card-resource-tag', this.tagClass);
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
      case CardRenderItemType.UNDERGROUND_SHELTERS:
        classes.push('card-underground-shelters');
        break;
      }

      if (this.item.secondaryTag === AltSecondaryTag.NO_PLANETARY_TAG) {
        classes.push('tag-clone');
      }

      const type = this.item.type;
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
          result = '<div class="card-x">x</div>';
        }
      }

      return result;
    },
  },
});
</script>
