import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {SpaceType} from '../../SpaceType';
import {Tags} from '../Tags';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {MAX_OXYGEN_LEVEL, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardRenderer} from '../render/CardRenderer';
import {AltSecondaryTag} from '../render/CardRenderItem';
import {Units} from '../../Units';

export class ProtectedValley extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.PROTECTED_VALLEY,
      tags: [Tags.PLANT, Tags.BUILDING],
      cost: 23,
      productionDelta: Units.of({megacredits: 2}),

      metadata: {
        cardNumber: '174',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(2)).nbsp;
          b.greenery().secondaryTag(AltSecondaryTag.OXYGEN).asterix();
        }),
        description: 'Increase your MC production 2 steps. Place on a greenery tile ON AN AREA RESERVED FOR OCEAN, disregarding normal placement restrictions, and increase oxygen 1 step.',
      },
    });
  }

  public canPlay(player: Player, game: Game): boolean {
    const oxygenMaxed = game.getOxygenLevel() === MAX_OXYGEN_LEVEL;

    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !oxygenMaxed) {
      return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST, game, true, false, false, true);
    }

    return true;
  }

  public play(player: Player, game: Game) {
    return new SelectSpace(
      'Select space reserved for ocean to place greenery tile',
      game.board.getAvailableSpacesForOcean(player),
      (space: ISpace) => {
        player.addProduction(Resources.MEGACREDITS, 2);
        return game.addGreenery(player, space.id, SpaceType.OCEAN);
      },
    );
  }
}
