import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {Cards} from '../Cards';
import {MoonExpansion} from '../../moon/MoonExpansion';

export class LunaProjectOffice implements IProjectCard {
  public cost = 4;
  public tags = [Tags.SCIENCE];
  public cardType = CardType.AUTOMATED;
  public name = CardName.LUNA_PROJECT_OFFICE;
  public resourceCount = 0;

  public canPlay(player: Player): boolean {
    return player.getTagCount(Tags.SCIENCE) >= 2;
  }

  public static consume(player: Player): boolean {
    return MoonExpansion.ifMoon(player.game, () => {
      const card = player.playedCards.find(Cards.byCardName(CardName.LUNA_PROJECT_OFFICE));
      if (card !== undefined) {
        const lunaProjectOffice = card as LunaProjectOffice;
        if (lunaProjectOffice.resourceCount > 0) {
          lunaProjectOffice.resourceCount--;
          return true;
        }
      }
      return false;
    }) || false;
  }

  public play(_player: Player) {
    this.resourceCount = 2;
    return undefined;
  }

  public readonly metadata: CardMetadata = {
    description: 'Requires 2 science tags. / DRAW 5 CARDS DURING THE RESEARCH PHASE FOR THE NEXT 2 GENERATIONS.',
    cardNumber: 'M20',
    renderData: CardRenderer.builder((_b) => {}),
  };
}
