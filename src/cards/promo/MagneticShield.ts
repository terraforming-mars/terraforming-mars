import { IProjectCard } from '../IProjectCard';
import { CardName } from '../../CardName';
import { CardType } from '../CardType';
import { Tags } from '../Tags';
import { Player } from '../../Player';
import { Game } from '../../Game';
import { PartyHooks } from '../../turmoil/parties/PartyHooks';
import { PartyName } from '../../turmoil/parties/PartyName';
import { REDS_RULING_POLICY_COST } from '../../constants';

export class MagneticShield implements IProjectCard {
    public name: CardName = CardName.MAGNETIC_SHIELD;
    public cost: number = 26;
    public tags: Array<Tags> = [Tags.SPACE];
    public cardType: CardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game) {
        const hasEnergyTags = player.getTagCount(Tags.ENERGY) >= 2;
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
          return player.canAfford(this.cost + REDS_RULING_POLICY_COST * 4, game, false, true) && hasEnergyTags;
        }
  
        return hasEnergyTags;
    }

    public play(player: Player, game: Game) {
        player.increaseTerraformRatingSteps(4, game);
        return undefined;
    }
}
