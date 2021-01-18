import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {RemoveAnyPlants} from '../../deferredActions/RemoveAnyPlants';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class ImpactorSwarm implements IProjectCard {
    public cost = 11;
    public tags = [Tags.SPACE];
    public name = CardName.IMPACTOR_SWARM;
    public cardType = CardType.EVENT;

    public canPlay(player: Player): boolean {
      return player.getTagCount(Tags.JOVIAN) >= 2;
    }

    public play(player: Player, game: Game) {
      game.defer(new RemoveAnyPlants(player, 2));
      player.heat += 12;
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'C16',
      requirements: CardRequirements.builder((b) => b.tag(Tags.JOVIAN, 2)),
      renderData: CardRenderer.builder((b) => {
        b.heat(12).digit.br;
        b.minus().plants(2).any;
      }),
      description: 'Requires 2 Jovian tags. Gain 12 heat. Remove up to 2 plants from any player.',
    }
}
