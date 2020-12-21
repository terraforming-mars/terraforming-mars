import {CorporationCard} from './CorporationCard';
import {Tags} from '../Tags';
import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class InterplanetaryCinematics implements CorporationCard {
    public name = CardName.INTERPLANETARY_CINEMATICS;
    public tags = [Tags.STEEL];
    public startingMegaCredits: number = 30;
    public cardType = CardType.CORPORATION;

    public onCardPlayed(player: Player, _game: Game, card: IProjectCard) {
      if (player.corporationCard !== undefined && player.corporationCard.name === this.name && card.cardType === CardType.EVENT) {
        player.megaCredits += 2;
      }
    }
    public play(player: Player) {
      player.steel = 20;
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'R19',
      description: 'You start with 20 steel and 30 MC.',
      renderData: CardRenderer.builder((b) => {
        b.br.br.br;
        b.megacredits(30).nbsp.steel(20).digit;
        b.corpBox('effect', (ce) => {
          ce.effectBox((eb) => {
            eb.event().played.startEffect.megacredits(2);
            eb.description('Effect: Each time you play an event, you gain 2 MC.');
          });
        });
      }),
    }
}
