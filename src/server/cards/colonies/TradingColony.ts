import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {BuildColony} from '../../deferredActions/BuildColony';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Size} from '../../../common/cards/render/Size';

export class TradingColony extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 18,
      tags: [Tag.SPACE],
      name: CardName.TRADING_COLONY,
      cardType: CardType.ACTIVE,

      metadata: {
        cardNumber: 'C47',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you trade, you may first increase that Colony Tile track 1 step.', (eb) => {
            eb.trade().startEffect.text('+1', Size.LARGE);
          }).br;
          b.colonies(1);
        }),
        description: 'Place a colony.',
      },
    });
  }

  public override canPlay(player: Player): boolean {
    return player.colonies.getPlayableColonies().length > 0;
  }

  public play(player: Player) {
    player.game.defer(new BuildColony(player, {title: 'Select colony for Trading Colony'}));
    player.colonies.tradeOffset++;
    return undefined;
  }

  public onDiscard(player: Player): void {
    player.colonies.tradeOffset--;
  }
}
