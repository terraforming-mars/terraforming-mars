
import {CardModel} from '../models/CardModel';

export const CardOrderMixin = {
  name: 'CardOrderMixin',
  methods: {
    getCardOrder: function(playerId: string) {
      try {
        const order = localStorage.getItem(`cardOrder${playerId}`);
        if (order === null) {
          return {};
        }
        return JSON.parse(order);
      } catch (err) {
        console.warn('unable to pull card order from local storage', err);
        return {};
      }
    },
    getOrdered: function(playerId: string, cards: Array<CardModel>): Array<CardModel> {
      const order = this.getCardOrder(playerId);
      const copy = cards.slice();
      copy.sort((a, b) => {
        return order[a.name] - order[b.name];
      });
      return copy;
    },
    updateCardOrder: function(playerId: string, order: {[x: string]: number}) {
      try {
        localStorage.setItem(`cardOrder${playerId}`, JSON.stringify(order));
      } catch (err) {
        console.warn('unable to update card order with local storage', err);
      }
    },
  },
};

