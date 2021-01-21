import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class ProductiveOutpost implements IProjectCard {
    public cost = 0;
    public tags = [];
    public name = CardName.PRODUCTIVE_OUTPOST;
    public cardType = CardType.AUTOMATED;

    public play(player: Player, game: Game) {
      game.colonies.forEach((colony) => {
        colony.colonies.filter((owner) => owner === player.id).forEach((owner) => {
          // Not using GiveColonyBonus deferred action because it's only for the active player
          game.defer(new DeferredAction(player, () => colony.giveColonyBonus(game.getPlayerById(owner))));
        });
      });
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: 'C30',
      renderData: CardRenderer.builder((b) => {
        b.text('Gain all your colony bonuses.', CardRenderItemSize.SMALL, true);
      }),
    }
}
