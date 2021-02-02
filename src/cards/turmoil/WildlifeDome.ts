import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {PartyName} from '../../turmoil/parties/PartyName';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {REDS_RULING_POLICY_COST, MAX_OXYGEN_LEVEL} from '../../constants';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class WildlifeDome implements IProjectCard {
    public cost = 15;
    public tags = [Tags.ANIMAL, Tags.PLANT, Tags.BUILDING];
    public name = CardName.WILDLIFE_DOME;
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player): boolean {
      if (player.game.turmoil !== undefined) {
        const canPlaceTile = player.game.board.getAvailableSpacesForGreenery(player).length > 0;
        const meetsPartyRequirements = player.game.turmoil.canPlay(player, PartyName.GREENS);
        const oxygenMaxed = player.game.getOxygenLevel() === MAX_OXYGEN_LEVEL;

        if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS) && !oxygenMaxed) {
          return player.canAfford(player.getCardCost(this) + REDS_RULING_POLICY_COST, true, false, false, true) && meetsPartyRequirements && canPlaceTile;
        }

        return meetsPartyRequirements && canPlaceTile;
      }
      return false;
    }

    public play(player: Player) {
      return new SelectSpace('Select space for greenery tile', player.game.board.getAvailableSpacesForGreenery(player), (space: ISpace) => {
        return player.game.addGreenery(player, space.id);
      });
    }
    public requirements = CardRequirements.builder((b) => b.party(PartyName.GREENS));

    public metadata: CardMetadata = {
      cardNumber: 'T15',
      renderData: CardRenderer.builder((b) => {
        b.greenery();
      }),
      description: 'Requires that Greens are ruling or that you have 2 delegates there. Place a greenery tile and raise oxygen 1 step.',
    }
}
