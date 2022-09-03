import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {CardRequirements} from '../CardRequirements';
import {Resources} from '../../../common/Resources';
import {max} from '../Options';

export class FlatMarsTheory extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.FLAT_MARS_THEORY,
      cost: 8,
      tags: [Tag.EARTH],
      requirements: CardRequirements.builder((b) => b.tag(Tag.SCIENCE, 1, {max})),

      metadata: {
        cardNumber: 'Pf39',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1)).slash().text('GENERATION');
        }),
        description: 'Requires maximum 1 science tag. Increase your M€ production 1 step for every generation played so far.',
      },
    });
  }

  public override bespokePlay(player: Player) {
    const generation = player.game.generation;
    player.production.add(Resources.MEGACREDITS, generation, {log: true});
    return undefined;
  }
}
