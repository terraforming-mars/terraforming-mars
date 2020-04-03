import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import { Resources } from '../Resources';
import { CardName } from '../CardName';

export class AsteroidMiningConsortium implements IProjectCard {
    public cost: number = 13;
    public tags: Array<Tags> = [Tags.JOVIAN];
    public cardType: CardType = CardType.AUTOMATED;
    public name: CardName = CardName.ASTEROID_MINING_CONSORTIUM;
    public canPlay(player: Player, game: Game): boolean {
      const othersHaveTitaniumProduction = game.getPlayers().length === 0 || 
        game.getPlayers().filter(p => p.id !== player.id && p.getProduction(Resources.TITANIUM) > 0).length === 0  ?  false : true; 
      return player.getProduction(Resources.TITANIUM) >= 1 || othersHaveTitaniumProduction;
    }
    public play(player: Player, game: Game) {
      game.addResourceProductionDecreaseInterrupt(player, Resources.TITANIUM, 1);
      player.setProduction(Resources.TITANIUM);
      return undefined;
    }
    public getVictoryPoints() {
      return 1;
    }
}
