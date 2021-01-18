import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {BuildColony} from '../../deferredActions/BuildColony';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class PioneerSettlement implements IProjectCard {
    public cost = 13;
    public tags = [Tags.SPACE];
    public name = CardName.PIONEER_SETTLEMENT;
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
      let coloniesCount: number = 0;
      game.colonies.forEach((colony) => {
        coloniesCount += colony.colonies.filter((owner) => owner === player.id).length;
      });
      return coloniesCount < 2;
    }

    public play(player: Player, game: Game) {
      game.defer(new BuildColony(player, false, 'Select colony for Pioneer Settlement'));
      player.addProduction(Resources.MEGACREDITS, -2);
      return undefined;
    }

    public getVictoryPoints() {
      return 2;
    }

    public metadata: CardMetadata = {
      cardNumber: 'C29',
      requirements: CardRequirements.builder((b) => b.colonies(1).max()),
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => pb.megacredits(-2));
        b.nbsp.colonies(1);
      }),
      description: 'Requires that you have no more than 1 colony. Decrease your MC production 2 steps. Place a colony.',
      victoryPoints: 2,
    }
}
