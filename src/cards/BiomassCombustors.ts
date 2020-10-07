
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {Player} from '../Player';
import {Game} from '../Game';
import {CardType} from './CardType';
import { Resources } from '../Resources';
import { CardName } from '../CardName';

export class BiomassCombustors implements IProjectCard {
    public cost: number = 4;
    public cardType: CardType = CardType.AUTOMATED;
    public tags: Array<Tags> = [Tags.ENERGY, Tags.STEEL];
    public name: CardName = CardName.BIOMASS_COMBUSTORS;
    public canPlay(player: Player, game: Game): boolean {
          return game.getOxygenLevel() >= 6 - player.getRequirementsBonus(game) && game.someoneHasResourceProduction(Resources.PLANTS,1);
    }

    public play(player: Player, game: Game) {
      player.addProduction(Resources.ENERGY,2);
      game.addResourceProductionDecreaseInterrupt(player, Resources.PLANTS, 1);
      return undefined;
    }
    public getVictoryPoints() {
      return -1;
    }
}
