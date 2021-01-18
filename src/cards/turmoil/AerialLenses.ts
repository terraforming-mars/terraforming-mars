import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {Game} from '../../Game';
import {PartyName} from '../../turmoil/parties/PartyName';
import {RemoveAnyPlants} from '../../deferredActions/RemoveAnyPlants';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class AerialLenses implements IProjectCard {
  public cost = 2;
  public tags = [];
  public name = CardName.AERIAL_LENSES;
  public cardType = CardType.AUTOMATED;

  public canPlay(player: Player, game: Game): boolean {
    if (game.turmoil !== undefined) {
      return game.turmoil.canPlay(player, PartyName.KELVINISTS);
    }
    return false;
  }

  public play(player: Player, game: Game) {
    player.addProduction(Resources.HEAT, 2);
    game.defer(new RemoveAnyPlants(player, 2));
    return undefined;
  }

  public getVictoryPoints() {
    return -1;
  }

  public metadata: CardMetadata = {
    description: 'Requires that Kelvinists are ruling or that you have 2 delegates there. Remove up to 2 plants from any player. Increase your heat production 2 steps.',
    cardNumber: 'T01',
    requirements: CardRequirements.builder((b) => b.party(PartyName.KELVINISTS)),
    renderData: CardRenderer.builder((b) => b.minus().plants(-2).any.production((pb) => pb.heat(2))),
    victoryPoints: -1,
  };
}
