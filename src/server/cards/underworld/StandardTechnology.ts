import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {ICard} from '../ICard';

export class StandardTechnology extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.STANDARD_TECHNOLOGY_UNDERWORLD,
      type: CardType.ACTIVE,
      cost: 6,
      tags: [Tag.SCIENCE],

      metadata: {
        cardNumber: 'U00',
        renderData: CardRenderer.builder((b) => {
          b.effect('Standard projects you have already taken this geneeration cost 8 M€ less.', (eb) =>
            eb.text('REPEAT').plate('Standard projects').asterix().startEffect.megacredits(-6));
        }),
      },
    });
  }

  public data: {gens: Partial<Record<CardName, number>>} = {gens: {}};

  onStandardProject(player: IPlayer, project: ICard): void {
    this.data.gens[project.name] = player.game.generation;
  }

  public override getCardDiscount(player: IPlayer, card?: IProjectCard | undefined): number {
    if (card && this.data.gens[card.name] === player.game.generation) {
      return 8;
    }
    return 0;
  }
}
