import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {MAX_OCEAN_TILES, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardRenderer} from '../render/CardRenderer';

export class BlackPolarDust extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.BLACK_POLAR_DUST,
      cost: 15,
      hasRequirements: false,

      metadata: {
        cardNumber: '022',
        description: 'Place an ocean tile. Decrease your MC production 2 steps and increase your heat production 3 steps.',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().megacredits(2).br;
            pb.plus().heat(3);
          }).oceans(1);
        }),
      },
    });
  }
  public canPlay(player: Player, game: Game): boolean {
    const meetsMcProdRequirement = player.getProduction(Resources.MEGACREDITS) >= -3;
    const oceansMaxed = game.board.getOceansOnBoard() === MAX_OCEAN_TILES;

    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !oceansMaxed) {
      return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST) && meetsMcProdRequirement;
    }

    return meetsMcProdRequirement;
  }
  public play(player: Player, game: Game) {
    player.addProduction(Resources.MEGACREDITS, -2);
    player.addProduction(Resources.HEAT, 3);
    game.defer(new PlaceOceanTile(player, game));
    return undefined;
  }
}
