import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class ImmigrationShuttles implements IProjectCard {
    public cost = 31;
    public tags = [Tags.EARTH, Tags.SPACE];
    public name = CardName.IMMIGRATION_SHUTTLES;
    public cardType = CardType.AUTOMATED;

    public getVictoryPoints(_player: Player, game: Game) {
      return Math.floor(game.getCitiesInPlay() / 3);
    }
    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, 5);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '198',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.megacredits(5)).br;
        b.text('1 VP for every 3rd City in play', CardRenderItemSize.TINY, true);
      }),
      description: 'Increase your MC production 5 steps.',
      victoryPoints: CardRenderDynamicVictoryPoints.cities(1, 3, true),
    }
}
