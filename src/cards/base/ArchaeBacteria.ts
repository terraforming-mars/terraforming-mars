import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {GlobalParameter} from '../../GlobalParameter';

export class ArchaeBacteria extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ARCHAEBACTERIA,
      tags: [Tags.MICROBE],
      cost: 6,

      metadata: {
        description: 'It must be -18 C or colder. Increase your Plant production 1 step.',
        cardNumber: '042',
        requirements: CardRequirements.builder((b) => b.temperature(-18).max()),
        renderData: CardRenderer.builder((b) => b.production((pb) => pb.plants(1))),
      },
    });
  }
  public canPlay(player: Player, game: Game): boolean {
    return game.checkMaxRequirements(player, GlobalParameter.TEMPERATURE, -18);
  }
  public play(player: Player) {
    player.addProduction(Resources.PLANTS);
    return undefined;
  }
}
