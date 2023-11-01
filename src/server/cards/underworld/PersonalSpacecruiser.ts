import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {Card} from '../Card';
import {CardResource} from '../../../common/CardResource';

export class PersonalSpacecruiser extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.PERSONAL_SPACECRUISER,
      cost: 15,
      tags: [Tag.SPACE],
      resourceType: CardResource.FIGHTER,

      behavior: {
        addResources: 1,
        underworld: {corruption: 1},
      },

      metadata: {
        cardNumber: 'U51',
        renderData: CardRenderer.builder((b) => {
          b.effect('During the production phase, if there is at least 1 fighter resource on this card, ' +
            'gain 2 M€ for each corruption resource you have.',
          (eb) => eb.fighter().startEffect.megacredits(2).slash().corruption().asterix).br;
          b.fighter(1).corruption(1).br;
        }),
        description: 'Put 1 fighter resource on this card. Gain 1 corruption.',
      },
    });
  }
  public onProductionPhase(player: IPlayer) {
    if (this.resourceCount > 0) {
      player.megaCredits += (2 * player.underworldData.corruption);
    }
    return undefined;
  }
}

