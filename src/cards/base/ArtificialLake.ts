import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {ISpace} from '../../boards/ISpace';
import {SelectSpace} from '../../inputs/SelectSpace';
import {SpaceType} from '../../SpaceType';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {MAX_OCEAN_TILES, REDS_RULING_POLICY_COST} from '../../constants';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class ArtificialLake extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ARTIFICIAL_LAKE,
      tags: [Tags.BUILDING],
      cost: 15,

      metadata: {
        description: 'Requires -6 C or warmer. Place 1 ocean tile ON AN AREA NOT RESERVED FOR OCEAN.',
        cardNumber: '116',
        requirements: CardRequirements.builder((b) => b.temperature(-6)),
        renderData: CardRenderer.builder((b) => b.oceans(1).asterix()),
        victoryPoints: 1,
      },
    });
  }
  public canPlay(player: Player, game: Game): boolean {
    const meetsRequirements = super.canPlay(player);
    const oceansMaxed = game.board.getOceansOnBoard() === MAX_OCEAN_TILES;

    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !oceansMaxed) {
      return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST, player.game, true) && meetsRequirements;
    }

    return meetsRequirements;
  }
  public play(player: Player, game: Game) {
    if (game.board.getOceansOnBoard() >= MAX_OCEAN_TILES) return undefined;

    return new SelectSpace('Select a land space to place an ocean', game.board.getAvailableSpacesOnLand(player), (foundSpace: ISpace) => {
      game.addOceanTile(player, foundSpace.id, SpaceType.LAND);
      return undefined;
    });
  }
  public getVictoryPoints() {
    return 1;
  }
}
