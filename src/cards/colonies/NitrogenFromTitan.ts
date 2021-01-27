import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {ResourceType} from '../../ResourceType';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class NitrogenFromTitan implements IProjectCard {
    public cost = 25;
    public tags = [Tags.JOVIAN, Tags.SPACE];
    public name = CardName.NITROGEN_FROM_TITAN;
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player) : boolean {
      if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS)) {
        return player.canAfford(player.getCardCost(this) + REDS_RULING_POLICY_COST * 2, false, true);
      }

      return true;
    }

    public play(player: Player) {
      player.increaseTerraformRatingSteps(2);
      player.game.defer(new AddResourcesToCard(player, ResourceType.FLOATER, {count: 2, restrictedTag: Tags.JOVIAN}));
      return undefined;
    }
    public getVictoryPoints() {
      return 1;
    }
    public metadata: CardMetadata = {
      cardNumber: 'C28',
      renderData: CardRenderer.builder((b) => {
        b.tr(2).floaters(2).secondaryTag(Tags.JOVIAN);
      }),
      description: 'Raise your TR 2 steps. Add 2 floaters to a JOVIAN CARD.',
      victoryPoints: 1,
    }
}

