import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {BuildColony} from '../../deferredActions/BuildColony';

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
      game.defer(new BuildColony(player, game, true, 'Select colony for Space Port Colony'));
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
}
