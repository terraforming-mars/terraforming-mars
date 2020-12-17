import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class IoMiningIndustries implements IProjectCard {
    public cost = 41;
    public tags = [Tags.JOVIAN, Tags.SPACE];
    public name = CardName.IO_MINING_INDUSTRIES;
    public cardType = CardType.AUTOMATED;

    public getVictoryPoints(player: Player) {
      return player.getTagCount(Tags.JOVIAN, false, false);
    }
    public play(player: Player) {
      player.addProduction(Resources.TITANIUM, 2);
      player.addProduction(Resources.MEGACREDITS, 2);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '092',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.titanium(2).megacredits(2)).br;
        b.text('1 VP per Jovian tag you have.', CardRenderItemSize.TINY, true);
      }),
      description: 'Increase your titanium production 2 steps and your MC production 2 steps.',
      victoryPoints: CardRenderDynamicVictoryPoints.jovians(1, 1),
    };
}
