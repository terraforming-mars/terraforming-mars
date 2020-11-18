import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {CardName} from '../CardName';
import {CardMetadata} from './CardMetadata';
import {CardRenderer} from './render/CardRenderer';
import {CardRenderItemSize} from './render/CardRenderItemSize';

export class AdvancedAlloys implements IProjectCard {
  public cost = 9;
  public tags = [Tags.SCIENCE];
  public name = CardName.ADVANCED_ALLOYS;
  public cardType = CardType.ACTIVE;

  public play(player: Player) {
    player.increaseTitaniumValue();
    player.increaseSteelValue();
    return undefined;
  }

  public onDiscard(player: Player): void {
    player.decreaseTitaniumValue();
    player.decreaseSteelValue();
  }

  public metadata: CardMetadata = {
    cardNumber: '071',
    renderData: CardRenderer.builder((b) => b.effectBox((be) => be.titanium(1).startEffect.plus(CardRenderItemSize.SMALL).megacredits(1).description('Each titanium you have is worth 1 MC extra')).br.effectBox((be) => be.steel(1).startEffect.plus(CardRenderItemSize.SMALL).megacredits(1).description('Each steel you have is worth 1 MC extra'))),
  };
}
