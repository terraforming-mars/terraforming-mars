import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {CardName} from '../../CardName';
import {MAX_OXYGEN_LEVEL, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class Plantation extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.PLANTATION,
      tags: [Tags.PLANT],
      cost: 15,

      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 2)),
      metadata: {
        cardNumber: '193',
        renderData: CardRenderer.builder((b) => {
          b.greenery();
        }),
        description: 'Requires 2 Science tags. Place a greenery tile and raise oxygen 1 step.',
      },
    });
  }

  public canPlay(player: Player): boolean {
    const meetsTagRequirements = super.canPlay(player);
    const canPlaceTile = player.game.board.getAvailableSpacesOnLand(player).length > 0;
    const oxygenMaxed = player.game.getOxygenLevel() === MAX_OXYGEN_LEVEL;

    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS) && !oxygenMaxed) {
      return player.canAfford(player.getCardCost(this) + REDS_RULING_POLICY_COST, false, false, false, true) && meetsTagRequirements && canPlaceTile;
    }

    return meetsTagRequirements && canPlaceTile;
  }

  public play(player: Player) {
    return new SelectSpace('Select space for greenery tile', player.game.board.getAvailableSpacesForGreenery(player), (space: ISpace) => {
      return player.game.addGreenery(player, space.id);
    });
  }
}
