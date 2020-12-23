import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';
import {LogHelper} from '../../components/LogHelper';
import {Game} from '../../Game';

export class LunarExports implements IProjectCard {
    public cost = 19;
    public tags = [Tags.EARTH, Tags.SPACE];
    public name = CardName.LUNAR_EXPORTS;
    public cardType = CardType.AUTOMATED;

    public play(player: Player, game: Game) {
      return new OrOptions(
        new SelectOption('Increase your MC production by 5', 'Increase +MC', () => {
          player.addProduction(Resources.MEGACREDITS, 5);
          LogHelper.logGainProduction(game, player, Resources.MEGACREDITS, 5);
          return undefined;
        }),
        new SelectOption('Increase your plant production by 2', 'Increase +plants', () => {
          player.addProduction(Resources.PLANTS, 2);
          LogHelper.logGainProduction(game, player, Resources.PLANTS, 2);
          return undefined;
        }),
      );
    }
    public metadata: CardMetadata = {
      cardNumber: 'C21',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => {
          pb.plants(2).or(CardRenderItemSize.SMALL).megacredits(5);
        });
      }),
      description: 'Increase your plant production 2 steps, or your MC production 5 steps.',
    };
}
