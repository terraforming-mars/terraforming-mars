import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {LogHelper} from '../../LogHelper';
import {Resources} from '../../Resources';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class Greenhouses implements IProjectCard {
    public cost = 6;
    public tags = [Tags.PLANT, Tags.BUILDING];
    public name = CardName.GREENHOUSES;
    public cardType = CardType.AUTOMATED;

    public play(player: Player, game: Game) {
      const qty = game.getCitiesInPlay();
      player.plants += qty;
      LogHelper.logGainStandardResource(game, player, Resources.PLANTS, qty);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '096',
      renderData: CardRenderer.builder((b) => {
        b.plants(1).slash().city(CardRenderItemSize.SMALL).any;
      }),
      description: 'Gain 1 plant for each city tile in play.',
    };
}
