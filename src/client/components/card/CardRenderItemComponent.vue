<template>
  <div class="card-item-container">
    <div class="card-res-amount" v-if="item.showDigit">{{ amountAbs }}</div>
    <div :class="componentClasses" v-for="index in itemsToShow" v-html="itemHtmlContent" :key="index"/>
    <div class="card-over" v-if="item.over !== undefined">over {{item.over}}</div>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {CardRenderItemType} from '@/common/cards/render/CardRenderItemType';
import {AltSecondaryTag} from '@/common/cards/render/AltSecondaryTag';
import {Size} from '@/common/cards/render/Size';
import {Tag} from '@/common/cards/Tag';
import {ICardRenderItem, isICardRenderItem} from '@/common/cards/render/Types';
import {cardResourceCSS} from '../common/cardResources';

const props = defineProps<{
  item: ICardRenderItem;
}>();

function sized(clazz: string, size: string | undefined) {
  return size !== undefined ? `${clazz}--${size}` : clazz;
}

const resourceClass = computed<string>(() => {
  return (props.item.resource === undefined) ? '' : cardResourceCSS[props.item.resource];
});

const resourceSizeClass = computed<string>(() => {
  if (props.item.size !== undefined) {
    return 'card-resource-size--' + props.item.size;
  }
  return '';
});

const tagClass = computed<string>(() => {
  if (props.item.tag === undefined) {
    return '';
  }
  return 'card-tag-' + props.item.tag.toLowerCase().replaceAll(' ', '-');
});

const componentClassArray = computed<Array<string>>(() => {
  let cardResource = 'card-resource';
  if (props.item.secondaryTag) {
    cardResource = 'card-resource--has-secondary-tag';
  } else if (props.item.isSuperscript) {
    cardResource = 'card-resource--superscript';
  }

  switch (props.item.type) {
  case CardRenderItemType.TEMPERATURE:
    return ['card-global-requirement', 'card-temperature-global-requirement'];
  case CardRenderItemType.OXYGEN:
    if (props.item.size !== undefined && props.item.size !== Size.MEDIUM) {
      return ['card-global-requirement', 'card-oxygen-global-requirement', `card-oxygen--${props.item.size}`];
    } else {
      return ['card-global-requirement', 'card-oxygen-global-requirement'];
    }
  case CardRenderItemType.OCEANS:
    if (props.item.size !== undefined && props.item.size !== Size.MEDIUM) {
      return ['card-global-requirement', 'card-ocean-global-requirement', `card-ocean--${props.item.size}`];
    } else {
      return ['card-global-requirement', 'card-ocean-global-requirement'];
    }
  case CardRenderItemType.VENUS:
    if (props.item.size !== undefined && props.item.size !== Size.MEDIUM) {
      return ['card-global-requirement', 'card-venus-global-requirement', `card-venus--${props.item.size}`];
    } else {
      return ['card-global-requirement', 'card-venus-global-requirement'];
    }
  case CardRenderItemType.TR:
    if (props.item.size !== undefined && props.item.size !== Size.MEDIUM) {
      return ['card-tile', 'card-tr', `card-tr--${props.item.size}`];
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
    if (props.item.size !== undefined && props.item.size !== Size.MEDIUM) {
      return [cardResource, 'card-resource-money', `card-money--${props.item.size}`];
    } else {
      return [cardResource, 'card-resource-money'];
    }
  case CardRenderItemType.CARDS:
    return [cardResource, 'card-card'];
  case CardRenderItemType.WILD:
    if (props.item.cancelled === true) {
      return [cardResource, 'card-resource-wild', 'card-private-security'];
    } else {
      return [cardResource, 'card-resource-wild'];
    }
  case CardRenderItemType.ONE:
    return [cardResource, 'card-resource-one'];
  case CardRenderItemType.DIVERSE_TAG:
    return ['card-resource-tag', 'card-resource-diverse'];
  case CardRenderItemType.TRADE:
    if (props.item.size === Size.SMALL) {
      return ['card-resource-trade', 'card-resource-colony--S'];
    } else {
      return ['card-resource-trade'];
    }
  case CardRenderItemType.COLONIES:
    if (props.item.size === Size.SMALL) {
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
    return ['card-influence', `card-influence--size-${props.item.size}`];
  case CardRenderItemType.NO_TAGS:
    return ['card-resource-tag', 'card-no-tags'];
  case CardRenderItemType.EMPTY_TAG:
    return ['card-resource-tag', 'card-tag-empty'];
  case CardRenderItemType.CITY:
    return ['card-tile', `city-tile--${props.item.size}`];
  case CardRenderItemType.GREENERY:
    if (props.item.secondaryTag === AltSecondaryTag.OXYGEN) {
      return ['card-tile', `greenery-tile-oxygen--${props.item.size}`];
    } else {
      return ['card-tile', `greenery-tile--${props.item.size}`];
    }
  case CardRenderItemType.EMPTY_TILE:
    if (props.item.size !== undefined) {
      return ['card-tile-ares', `board-space-tile--empty-tile--${props.item.size}`];
    } else {
      return ['card-tile-ares'];
    }
  case CardRenderItemType.EMPTY_TILE_GOLDEN:
    return ['card-tile-ares', 'board-space-tile--adjacency-tile'];
  case CardRenderItemType.EMPTY_TILE_SPECIAL:
    if (props.item.size !== undefined) {
      return ['card-tile', `special-tile--${props.item.size}`];
    } else {
      return ['card-tile', 'special-tile'];
    }
  case CardRenderItemType.CITY_OR_SPECIAL_TILE:
    return ['card-tile', 'city-or-special-tile'];
  case CardRenderItemType.COMMUNITY:
    return [cardResource, 'card-resource-community'];
  case CardRenderItemType.MOON_HABITAT:
    if (props.item.secondaryTag === AltSecondaryTag.MOON_HABITAT_RATE) {
      return [sized('card-tile-lunar-habitat-rate', props.item.size)];
    } else {
      return [sized('card-tile-lunar-habitat', props.item.size)];
    }
  case CardRenderItemType.GLOBAL_EVENT:
    return ['turmoil-global-event'];
  case CardRenderItemType.POLICY:
    return ['turmoil-policy-tile'];
  case CardRenderItemType.ARROW_OPG:
    return ['card-arrow-opg'];
  case CardRenderItemType.REDS:
    return ['card-reds'];
  case CardRenderItemType.REDS_DEACTIVATED:
    return ['card-reds-deactivated'];
  case CardRenderItemType.ADJACENCY_BONUS:
    return ['card-adjacency-bonus'];
  case CardRenderItemType.HAZARD_TILE:
    if (props.item.size !== undefined && props.item.size !== Size.MEDIUM) {
      return [`card-hazard-tile--${props.item.size}`];
    } else {
      return ['card-hazard-tile'];
    }
  case CardRenderItemType.MOON_HABITAT_RATE:
    if (props.item.size !== undefined) {
      return ['card-habitat-rate', `card-habitat-rate--${props.item.size}`];
    } else {
      return ['card-habitat-rate'];
    }
  case CardRenderItemType.MOON_MINE:
    if (props.item.secondaryTag === AltSecondaryTag.MOON_MINING_RATE) {
      return [sized('card-tile-lunar-mine-rate', props.item.size)];
    } else {
      return [sized('card-tile-lunar-mine', props.item.size)];
    }
  case CardRenderItemType.MOON_MINING_RATE:
    if (props.item.size !== undefined) {
      return ['card-mining-rate', `card-mining-rate--${props.item.size}`];
    } else {
      return ['card-mining-rate'];
    }
  case CardRenderItemType.MOON_ROAD:
    if (props.item.secondaryTag === AltSecondaryTag.MOON_LOGISTICS_RATE) {
      return [sized('card-tile-lunar-road-rate', props.item.size)];
    } else {
      return [sized('card-tile-lunar-road', props.item.size)];
    }
  case CardRenderItemType.MOON_LOGISTICS_RATE:
    if (props.item.size !== undefined) {
      return ['card-logistics-rate', `card-logistics-rate--${props.item.size}`];
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
    return [props.item.isSuperscript ? 'card-excavation--superscript' : 'card-excavation'];
  case CardRenderItemType.CORRUPTION:
    return [cardResource, 'card-resource-corruption'];
  case CardRenderItemType.RESOURCE:
    return [cardResource, resourceClass.value, resourceSizeClass.value];
  case CardRenderItemType.TAG:
    return ['card-resource-tag', tagClass.value];
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
});

const componentClasses = computed<ReadonlyArray<string>>(() => {
  const classes: Array<string> = [];
  if (props.item.isSuperscript) {
    classes.push('card-superscript');
  }

  classes.push(...componentClassArray.value);

  if (props.item.secondaryTag === AltSecondaryTag.NO_PLANETARY_TAG) {
    classes.push('tag-clone');
  }

  if (props.item.anyPlayer === true) {
    const type = props.item.type;
    if (type === CardRenderItemType.DELEGATES) {
      classes.push('card-delegate-red');
    } else if (type === CardRenderItemType.CHAIRMAN) {
      classes.push('card-chairman-red');
    } else {
      classes.push('red-outline');
    }
  }

  if (props.item.isPlate) {
    classes.push('card-plate');
    if (props.item.size === Size.SMALL) {
      classes.push('card-plate--narrow');
    }
  }

  if (props.item.text !== undefined) {
    classes.push(`card-text-size--${props.item.size}`);
    if (props.item.isUppercase) {
      classes.push('card-text-uppercase');
    }
    if (props.item.isBold) {
      classes.push('card-text-bold');
    } else {
      classes.push('card-text-normal');
    }
  }
  return classes;
});

const amountAbs = computed<number>(() => {
  if (props.item.amountInside) return 1;
  return Math.abs(props.item.amount);
});

const itemsToShow = computed<number>(() => {
  if (props.item.showDigit) return 1;
  return amountAbs.value;
});

const itemHtmlContent = computed<string>(() => {
  let result = '';
  if (isICardRenderItem(props.item)) {
    if (props.item.innerText) {
      result += props.item.innerText;
    } else if (props.item.amountInside) {
      if (props.item.amount !== 0) {
        result += props.item.amount.toString();
      }

      if (props.item.clone) {
        result += '<div style="-webkit-filter: greyscale(100%);filter: grayscale(100%)">\uD83E\uDE90</div>';
      }
    }
  }

  const previouslyRendered: Array<Tag | AltSecondaryTag> = [
    AltSecondaryTag.OXYGEN,
    AltSecondaryTag.MOON_HABITAT_RATE,
    AltSecondaryTag.MOON_MINING_RATE,
    AltSecondaryTag.MOON_LOGISTICS_RATE,
  ];
  const secondaryTag = props.item.secondaryTag;
  if (secondaryTag !== undefined && !previouslyRendered.includes(secondaryTag)) {
    result += '<div class="card-icon card-tag-' + secondaryTag + '"></div>';
  }
  if (props.item.isPlate || props.item.text !== undefined) {
    result += props.item.text || 'n/a';
  }
  if (props.item.type === CardRenderItemType.MULTIPLIER_WHITE) {
    result = 'X';
  } else if (props.item.type === CardRenderItemType.IGNORE_GLOBAL_REQUIREMENTS) {
    result += '<div class="card-project-requirements">';
    result += '<div class="card-x">x</div>';
    result += '<div class="card-requirements">Global Requirements</div>';
    result += '</div>';
  }
  if (props.item.type === CardRenderItemType.SELF_REPLICATING) {
    result = '<div class="card-resource card-card"><div class="cards-count">2</div><div class="card-icon card-icon-space">\u2734</div><div class="card-icon card-icon-building">\u2617</div></div>';
  }
  if (props.item.type === CardRenderItemType.COLONY_TILE) {
    result = '<span class="card-colony-tile">colony</span>';
  }
  if (props.item.type === CardRenderItemType.PRELUDE) {
    result = '<div class="card-prelude-container"><span class="card-prelude-icon">prel</span></div>';
  }
  if (props.item.type === CardRenderItemType.CORPORATION) {
    result = '<div class="card-corporation-icon"></div>';
  }
  if (props.item.type === CardRenderItemType.FIRST_PLAYER) {
    result = '<div class="card-first-player-icon"></div>';
  }
  if (props.item.type === CardRenderItemType.RULING_PARTY) {
    result = '<div class="card-party-icon"></div>';
  }
  if (props.item.type === CardRenderItemType.AWARD) {
    result = '<span class="card-award-icon">award</span>';
  }
  if (props.item.type === CardRenderItemType.MILESTONE) {
    result = '<span class="card-award-icon">milestone</span>';
  }
  if (props.item.type === CardRenderItemType.VP) {
    result = '<div class="card-resource points-big card-vp-questionmark">?</div>';
  }
  if (props.item.type === CardRenderItemType.MEGACREDITS && props.item.amount === undefined) {
    result = '?';
  }
  if (props.item.cancelled === true) {
    switch (props.item.type) {
    case CardRenderItemType.TR:
    case CardRenderItemType.WILD:
    case CardRenderItemType.UNDERGROUND_RESOURCES:
    case CardRenderItemType.TRADE:
      result = '<div class="card-x">x</div>';
    }
  }

  return result;
});
</script>
