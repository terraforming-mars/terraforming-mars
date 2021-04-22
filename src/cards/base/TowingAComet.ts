import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
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
  public canPlay(player: Player): boolean {
    const oxygenStep = player.game.getOxygenLevel() < MAX_OXYGEN_LEVEL ? 1 : 0;
    const oceanStep = player.game.board.getOceansOnBoard() < MAX_OCEAN_TILES ? 1 : 0;
    const totalSteps = oxygenStep + oceanStep;

    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS)) {
      return player.canAfford(player.getCardCost(this) + REDS_RULING_POLICY_COST * totalSteps, {titanium: true});
    }

    return true;
  }
  public play(player: Player) {
    player.game.defer(new PlaceOceanTile(player));
    player.plants += 2;
    return player.game.increaseOxygenLevel(player, 1);
  }
}
