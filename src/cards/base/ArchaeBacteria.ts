import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {GlobalParameter} from '../../GlobalParameter';

export class ArchaeBacteria implements IProjectCard {
  public cost = 6;
  public tags = [Tags.MICROBE];
  public name = CardName.ARCHAEBACTERIA;
  public cardType = CardType.AUTOMATED;
  public canPlay(player: Player, game: Game): boolean {
    return game.checkMaxRequirements(player, GlobalParameter.TEMPERATURE, -18);
  }
  public play(player: Player) {
    player.addProduction(Resources.PLANTS);
    return undefined;
  }

  public metadata: CardMetadata = {
    description: 'It must be -18 C or colder. Increase your Plant production 1 step.',
    cardNumber: '042',
    requirements: CardRequirements.builder((b) => b.temperature(-18).max()),
    renderData: CardRenderer.builder((b) => b.productionBox((pb) => pb.plants(1))),
  };
}
