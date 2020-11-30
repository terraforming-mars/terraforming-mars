import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class AsteroidMining implements IProjectCard {
  public cost = 30;
  public tags = [Tags.JOVIAN, Tags.SPACE];
  public cardType = CardType.AUTOMATED;
  public name = CardName.ASTEROID_MINING;

  public play(player: Player) {
    player.addProduction(Resources.TITANIUM, 2);
    return undefined;
  }
  public getVictoryPoints() {
    return 2;
  }

  public metadata: CardMetadata = {
    description: 'Increase your titanium production 2 steps.',
    cardNumber: '040',
    renderData: CardRenderer.builder((b) => b.productionBox((pb) => pb.titanium(2))),
    victoryPoints: 2,
  };
}
