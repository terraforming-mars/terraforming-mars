import Vue from 'vue';
import {SpaceBonus} from '../SpaceBonus';

export const Bonus = Vue.component('bonus', {
  props: {
    bonus: {
      type: Array as () => Array<SpaceBonus>,
    },
  },
  data: function() {
    return {};
  },
  render: function(createElement) {
    const bonuses = [];
    let idx = 0;

    const build_css_class = (idx: number, bonus: SpaceBonus):string => {
      let ret = 'board-space-bonus board-space-bonus--';
      if (bonus === SpaceBonus.TITANIUM) {
        ret += 'titanium';
      } else if (bonus === SpaceBonus.STEEL) {
        ret += 'steel';
      } else if (bonus === SpaceBonus.PLANT) {
        ret += 'plant';
      } else if (bonus === SpaceBonus.DRAW_CARD) {
        ret += 'card';
      } else if (bonus === SpaceBonus.HEAT) {
        ret += 'heat';
      } else if (bonus === SpaceBonus.OCEAN) {
        ret += 'bonusocean';
      }
      ret += ' board-space-bonus-pos--' + idx.toString();
      return ret;
    };

    for (const bonus of this.bonus) {
      idx += 1;
      bonuses.push(
        createElement('i', {'class': build_css_class(idx, bonus)}),
      );
    }
    return createElement('div', {'class': 'board-space-bonuses'}, bonuses);
  },
});
