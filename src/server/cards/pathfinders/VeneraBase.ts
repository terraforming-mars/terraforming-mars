import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {Tag} from '../../../common/cards/Tag';
import {PartyName} from '../../../common/turmoil/PartyName';
import {SpaceName} from '../../SpaceName';
import {ActionCard} from '../ActionCard';

export class VeneraBase extends ActionCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.VENERA_BASE,
      cost: 21,
      tags: [Tag.VENUS, Tag.VENUS, Tag.CITY],

      requirements: {party: PartyName.UNITY},
      victoryPoints: {tag: Tag.VENUS, per: 2},

      behavior: {
        production: {megacredits: 3},
        city: {space: SpaceName.VENERA_BASE},
      },

      action: {
        addResourcesToAnyCard: {type: CardResource.FLOATER, tag: Tag.VENUS, count: 1, mustHaveCard: true},
      },

      metadata: {
        cardNumber: 'Pf67',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 floater to ANY Venus card', (ab) => ab.empty().startAction.resource(CardResource.FLOATER, {secondaryTag: Tag.VENUS}).asterix());
          b.br;
          b.production((pb) => pb.megacredits(3)).nbsp.city({secondaryTag: Tag.SPACE}).asterix();
          b.br;
          b.vpText('1 VP per 2 Venus tags you have.');
        }),
        description: 'Requires Unity is ruling or that you have 2 delegates there. Raise your M€ production 3 steps and place a city tile ON THE RESERVED AREA.',
      },
    });
  }
}
