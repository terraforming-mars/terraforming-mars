import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PartyName} from '../../turmoil/parties/PartyName';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {REDS_RULING_POLICY_COST, MAX_OXYGEN_LEVEL} from '../../constants';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {AltSecondaryTag} from '../render/CardRenderItem';

export class WildlifeDome implements IProjectCard {
    public cost = 15;
    public tags = [Tags.ANIMAL, Tags.PLANT, Tags.BUILDING];
    public name = CardName.WILDLIFE_DOME;
    public cardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game): boolean {
      if (game.turmoil !== undefined) {
        const canPlaceTile = game.board.getAvailableSpacesForGreenery(player).length > 0;
        const meetsPartyRequirements = game.turmoil.canPlay(player, PartyName.GREENS);
        const oxygenMaxed = game.getOxygenLevel() === MAX_OXYGEN_LEVEL;

        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !oxygenMaxed) {
          return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST, game, true, false, false, true) && meetsPartyRequirements && canPlaceTile;
        }

        return meetsPartyRequirements && canPlaceTile;
      }
      return false;
    }

    public play(player: Player, game: Game) {
      return new SelectSpace('Select space for greenery tile', game.board.getAvailableSpacesForGreenery(player), (space: ISpace) => {
        return game.addGreenery(player, space.id);
      });
    }
    public metadata: CardMetadata = {
      cardNumber: 'T15',
      requirements: CardRequirements.builder((b) => b.party(PartyName.GREENS)),
      renderData: CardRenderer.builder((b) => {
        b.greenery().secondaryTag(AltSecondaryTag.OXYGEN);
      }),
      description: 'Requires that Greens are ruling or that you have 2 delegates there. Place a greenery tile and raise oxygen 1 step.',
    }
}
