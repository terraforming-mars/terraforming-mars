import {CardName} from '../../CardName';
import {ShiftAresGlobalParametersDeferred} from '../../deferredActions/ShiftAresGlobalParametersDeferred';
import {Game} from '../../Game';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class ButterflyEffect implements IProjectCard {
    public cost = 8;
    public tags = [];
    public cardType = CardType.EVENT;
    public name = CardName.BUTTERFLY_EFFECT;
    public play(player: Player, game: Game) {
      player.increaseTerraformRating(game);
      game.defer(new ShiftAresGlobalParametersDeferred(game, player));
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'A03',
      description: 'Effect: Gain 1 TR. Move each individual hazard marker up to 1 step up or down',
      renderData: CardRenderer.builder((b) => {
        b.tr(1).br;
        b.plate('All hazard markers').colon().text('-1 / 0 / +1', CardRenderItemSize.SMALL);
      }),
    };
}
