import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardMetadata} from '../CardMetadata';
import {CardType} from '../CardType';
import {CorporationCard} from '../corporation/CorporationCard';
import {IProjectCard} from '../IProjectCard';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../Tags';

export class CrescentResearchAssociation implements CorporationCard {
  public name = CardName.CRESCENT_RESEARCH_ASSOCIATION;
  public tags = [Tags.SCIENCE, Tags.MOON];
  public startingMegaCredits: number = 50;
  public cardType = CardType.CORPORATION;
  public requirements: undefined;

  public play() {
    return undefined;
  }

  public getCardDiscount(player: Player, card: IProjectCard) {
    if (card.tags.indexOf(Tags.MOON) === -1) {
      return 0;
    }
    return player.getTagCount(Tags.MOON, false, true);
  }

  public getVictoryPoints(player: Player) {
    return Math.floor(player.getTagCount(Tags.MOON, true, false) / 3);
  }

  public readonly metadata: CardMetadata = {
    description: 'You start with 50 M€. 1 VP for every 3 Moon tags you have.',
    cardNumber: '',
    renderData: CardRenderer.builder((b) => {
      b.megacredits(50).br;
      b.effect('When you play a moon tag, you pay 1 M€ less for each Moon tag you have.', (eb) => {
        eb.moon().startEffect.megacredits(1).slash().moon();
      });
    }),
    victoryPoints: CardRenderDynamicVictoryPoints.moon(1, 3),
  }
}
