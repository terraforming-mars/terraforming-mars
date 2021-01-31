import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {PartyName} from '../../turmoil/parties/PartyName';
import {RemoveAnyPlants} from '../../deferredActions/RemoveAnyPlants';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class AerialLenses extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.AERIAL_LENSES,
      cost: 2,

      requirements: CardRequirements.builder((b) => b.party(PartyName.KELVINISTS)),
      metadata: {
        description: 'Requires that Kelvinists are ruling or that you have 2 delegates there. Remove up to 2 plants from any player. Increase your heat production 2 steps.',
        cardNumber: 'T01',
        renderData: CardRenderer.builder((b) => b.minus().plants(-2).any.production((pb) => pb.heat(2))),
        victoryPoints: -1,
      },
    });
  }

  public canPlay(player: Player): boolean {
    if (player.game.turmoil !== undefined) {
      return player.game.turmoil.canPlay(player, PartyName.KELVINISTS);
    }
    return false;
  }

  public play(player: Player) {
    player.addProduction(Resources.HEAT, 2);
    player.game.defer(new RemoveAnyPlants(player, 2));
    return undefined;
  }

  public getVictoryPoints() {
    return -1;
  }
}
