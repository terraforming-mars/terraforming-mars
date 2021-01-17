import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {BuildColony} from '../../deferredActions/BuildColony';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class SpacePortColony implements IProjectCard {
    public cost = 27;
    public tags = [Tags.SPACE];
    public name = CardName.SPACE_PORT_COLONY;
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
      let coloniesCount: number = 0;
      game.colonies.forEach((colony) => {
        coloniesCount += colony.colonies.filter((owner) => owner === player.id).length;
      });
      return coloniesCount > 0;
    }

    public play(player: Player, game: Game) {
      game.defer(new BuildColony(player, true, 'Select colony for Space Port Colony'));
      player.increaseFleetSize();
      return undefined;
    }

    public getVictoryPoints(_player: Player, game: Game) {
      let coloniesCount: number = 0;
      game.colonies.forEach((colony) => {
        coloniesCount += colony.colonies.length;
      });
      return Math.floor(coloniesCount / 2);
    }

    public metadata: CardMetadata = {
      cardNumber: 'C39',
      requirements: CardRequirements.builder((b) => b.colonies()),
      renderData: CardRenderer.builder((b) => {
        b.colonies(1).asterix().nbsp.tradeFleet().br;
        b.vpText('1VP per 2 colonies in play.');
      }),
      description: 'Requires a colony. Place a colony. MAY BE PLACED ON A COLONY TILE WHERE YOU ALREADY HAVE A COLONY. Gain 1 Trade Fleet.',
      victoryPoints: CardRenderDynamicVictoryPoints.colonies(1, 2, true),
    }
}
