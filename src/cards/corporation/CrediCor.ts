import {CorporationCard} from './CorporationCard';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {StandardProjectCard} from '../standardProjects/StandardProjectCard';

export class CrediCor implements CorporationCard {
  public get name() {
    return CardName.CREDICOR;
  }
  public get tags() {
    return [];
  }
  public get startingMegaCredits() {
    return 57;
  }
  public get cardType() {
    return CardType.CORPORATION;
  }
  public onCardPlayed(player: Player, _game: Game, card: IProjectCard) {
    if (player.corporationCard !== undefined && player.corporationCard.name === this.name && card.cost >= 20) {
      player.megaCredits += 4;
    }
  }
  public onStandardProject(player: Player, project: StandardProjectCard) {
    if (project.cost >= 20) {
      player.megaCredits += 4;
    }
  }
  public play() {
    return undefined;
  }
  public get metadata() {
    return {
      cardNumber: 'R08',
      description: 'You start with 57 MC.',
      renderData: CardRenderer.builder((b) => {
        b.br.br.br;
        b.megacredits(57);
        b.corpBox('effect', (ce) => {
          ce.effectBox((eb) => {
            eb.minus().megacredits(20).startEffect.megacredits(4);
            eb.description('Effect: After you pay for a card or standard project with a basic cost of 20MC or more, you gain 4MC.');
          });
        });
      }),
    };
  }
}
