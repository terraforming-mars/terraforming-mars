import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import { Resources } from "../Resources";
import { CardName } from '../CardName';
import { MAX_OCEAN_TILES, REDS_RULING_POLICY_COST } from '../constants';
import { PartyHooks } from '../turmoil/parties/PartyHooks';
import { PartyName } from '../turmoil/parties/PartyName';

export class BlackPolarDust implements IProjectCard {
    public cost: number = 15;
    public tags: Array<Tags> = [];
    public name: CardName = CardName.BLACK_POLAR_DUST;
    public cardType: CardType = CardType.AUTOMATED;
    public hasRequirements = false;
    public canPlay(player: Player, game: Game): boolean {
      const meetsMcProdRequirement = player.getProduction(Resources.MEGACREDITS) >= -3;
      const oceansMaxed = game.board.getOceansOnBoard() === MAX_OCEAN_TILES;

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !oceansMaxed) {
        return player.canAfford(this.cost + REDS_RULING_POLICY_COST) && meetsMcProdRequirement;
      }

      return meetsMcProdRequirement;
    }
    public play(player: Player, game: Game) {
      player.setProduction(Resources.MEGACREDITS,-2);
      player.setProduction(Resources.HEAT,3);
      game.addOceanInterrupt(player);
      return undefined;
    }
}
