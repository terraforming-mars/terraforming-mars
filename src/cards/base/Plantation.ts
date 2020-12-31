import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {CardName} from '../../CardName';
import {MAX_OXYGEN_LEVEL, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {AltSecondaryTag} from '../render/CardRenderItem';

export class Plantation implements IProjectCard {
    public cost = 15;
    public cardType = CardType.AUTOMATED;
    public tags = [Tags.PLANT];
    public name = CardName.PLANTATION;

    public canPlay(player: Player, game: Game): boolean {
      const meetsTagRequirements = player.getTagCount(Tags.SCIENCE) >= 2;
      const canPlaceTile = game.board.getAvailableSpacesOnLand(player).length > 0;
      const oxygenMaxed = game.getOxygenLevel() === MAX_OXYGEN_LEVEL;

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !oxygenMaxed) {
        return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST, game, false, false, false, true) && meetsTagRequirements && canPlaceTile;
      }

      return meetsTagRequirements && canPlaceTile;
    }

    public play(player: Player, game: Game) {
      return new SelectSpace('Select space for greenery tile', game.board.getAvailableSpacesForGreenery(player), (space: ISpace) => {
        return game.addGreenery(player, space.id);
      });
    }

    public metadata: CardMetadata = {
      cardNumber: '193',
      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 2)),
      renderData: CardRenderer.builder((b) => {
        b.greenery().secondaryTag(AltSecondaryTag.OXYGEN);
      }),
      description: 'Requires 2 Science tags. Place a greenery tile and raise oxygen 1 step.',
    }
}
