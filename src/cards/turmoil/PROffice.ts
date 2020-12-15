import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PartyName} from '../../turmoil/parties/PartyName';
import {Resources} from '../../Resources';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class PROffice implements IProjectCard {
    public cost = 7;
    public tags = [Tags.EARTH];
    public name = CardName.PR_OFFICE;
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
      if (game.turmoil !== undefined) {
        const meetsPartyRequirements = game.turmoil.canPlay(player, PartyName.UNITY);
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
          return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST) && meetsPartyRequirements;
        }

        return meetsPartyRequirements;
      }
      return false;
    }

    public play(player: Player, game: Game) {
      player.increaseTerraformRating(game);
      const amount = player.getTagCount(Tags.EARTH) + 1;
      player.setResource(Resources.MEGACREDITS, amount);
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: 'T09',
      requirements: CardRequirements.builder((b) => b.party(PartyName.UNITY)),
      renderData: CardRenderer.builder((b) => {
        b.tr(1).br;
        b.megacredits(1).slash().earth().played;
      }),
      description: 'Requires that Unity are ruling or that you have 2 delegates there. Gain 1 TR. Gain 1 MC for each Earth tag you have, including this.',
    }
}
