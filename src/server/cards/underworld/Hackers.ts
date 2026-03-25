import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {CardName} from '../../../common/cards/CardName';
import {DecreaseAnyProduction} from '../../deferredActions/DecreaseAnyProduction';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';
import {Tag} from '../../../common/cards/Tag';

export class Hackers extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.HACKERS_UNDERWORLD,
      cost: 3,
      tags: [Tag.CRIME],

      requirements: {corruption: 2},
      victoryPoints: -1,

      behavior: {
        production: {megacredits: {underworld: {corruption: {}}}},
      },

      metadata: {
        cardNumber: 'UX01',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().megacredits(2, {all}).br;
            pb.plus().megacredits(1).slash().corruption();
          });
        }),
        description: 'Requires 2 corruption. Decrease any M€ production 2 steps. Increase your M€ production 1 step for every unit of corruption you have.',
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    player.game.defer(
      new DecreaseAnyProduction(player, Resource.MEGACREDITS, {count: 2, stealing: true}));
    return undefined;
  }
}
