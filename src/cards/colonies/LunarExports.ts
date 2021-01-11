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
import {LogHelper} from '../../LogHelper';

export class LunarExports implements IProjectCard {
    public cost = 19;
    public tags = [Tags.EARTH, Tags.SPACE];
    public name = CardName.LUNAR_EXPORTS;
    public cardType = CardType.AUTOMATED;

    public play(player: Player) {
      return new OrOptions(
        new SelectOption('Increase your MC production by 5', 'Increase +MC', () => {
          player.addProduction(Resources.MEGACREDITS, 5);
          LogHelper.logGainProduction(player, Resources.MEGACREDITS, 5);
          return undefined;
        }),
        new SelectOption('Increase your plant production by 2', 'Increase +plants', () => {
          player.addProduction(Resources.PLANTS, 2);
          LogHelper.logGainProduction(player, Resources.PLANTS, 2);
          return undefined;
        }),
      );
    }
    public metadata: CardMetadata = {
      cardNumber: 'C21',
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => {
          pb.plants(2).or(CardRenderItemSize.SMALL).megacredits(5);
        });
      }),
      description: 'Increase your plant production 2 steps, or your MC production 5 steps.',
    };
}
