import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {CardName} from '../CardName';
import {CardMetadata} from '../cards/CardMetadata';
import {CardRenderer} from '../cards/render/CardRenderer';
import {CardRequirements} from '../cards/CardRequirements';

export class AntiGravityTechnology implements IProjectCard {
  public cost = 14;
  public tags = [Tags.SCIENCE];
  public name = CardName.ANTI_GRAVITY_TECHNOLOGY;
  public cardType = CardType.ACTIVE;
  public canPlay(player: Player): boolean {
    return player.getTagCount(Tags.SCIENCE) >= 7;
  }
  public getCardDiscount() {
    return 2;
  }
  public play() {
    return undefined;
  }
  public getVictoryPoints() {
    return 3;
  }

  public metadata: CardMetadata = {
    description: 'Requires 7 science tags',
    cardNumber: '150',
    requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 7)),
    renderData: CardRenderer.builder((b) => {
      b.effectBox((be) => be.empty().startEffect.megacredits(-2).description('Effect: When you play a card, you pay 2 MC less for it'));
    }),
    victoryPoints: 3,
  };
}
