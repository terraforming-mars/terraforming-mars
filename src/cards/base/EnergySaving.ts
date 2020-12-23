
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderItemSize} from '../render/CardRenderItemSize';
import {CardRenderer} from '../render/CardRenderer';

export class EnergySaving implements IProjectCard {
    public cardType = CardType.AUTOMATED;
    public cost = 15;
    public tags = [Tags.ENERGY];
    public name = CardName.ENERGY_SAVING;

    public play(player: Player, game: Game) {
      player.addProduction(Resources.ENERGY, game.getCitiesInPlay());
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '189',
      description: 'Increase your Energy production 1 step for each City tile in play.',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.energy(1).slash().city(CardRenderItemSize.SMALL).any);
      }),
    };
}
