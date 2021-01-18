import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {MAX_OXYGEN_LEVEL, MAX_OCEAN_TILES, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardRenderer} from '../render/CardRenderer';

export class TowingAComet extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.TOWING_A_COMET,
      tags: [Tags.SPACE],
      cost: 23,

      metadata: {
        cardNumber: '075',
        renderData: CardRenderer.builder((b) => {
          b.oxygen(1).oceans(1).br;
          b.plants(2);
        }),
        description: 'Gain 2 plants. Raise oxygen level 1 step and place an ocean tile.',
      },
    });
  }
  public canPlay(player: Player, game: Game): boolean {
    const oxygenStep = game.getOxygenLevel() < MAX_OXYGEN_LEVEL ? 1 : 0;
    const oceanStep = game.board.getOceansOnBoard() < MAX_OCEAN_TILES ? 1 : 0;
    const totalSteps = oxygenStep + oceanStep;

    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
      return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST * totalSteps, game, false, true);
    }

    return true;
  }
  public play(player: Player, game: Game) {
    game.defer(new PlaceOceanTile(player));
    player.plants += 2;
    return game.increaseOxygenLevel(player, 1);
  }
}
