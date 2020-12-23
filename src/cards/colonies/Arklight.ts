import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Tags} from '../Tags';
import {ResourceType} from '../../ResourceType';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../Resources';
import {Game} from '../../Game';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {IResourceCard} from '../ICard';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class Arklight implements CorporationCard, IResourceCard {
    public name = CardName.ARKLIGHT;
    public tags = [Tags.ANIMAL];
    public startingMegaCredits: number = 45;
    public resourceType = ResourceType.ANIMAL;
    public resourceCount: number = 0;
    public cardType = CardType.CORPORATION;

    public play(player: Player) {
      player.addProduction(Resources.MEGACREDITS, 2);
      player.addResourceTo(this);
      return undefined;
    }

    public onCardPlayed(player: Player, _game: Game, card: IProjectCard): void {
      if (player.isCorporation(CardName.ARKLIGHT)) {
        player.addResourceTo(this, card.tags.filter((cardTag) => cardTag === Tags.ANIMAL || cardTag === Tags.PLANT).length);
      }
    }

    public getVictoryPoints(): number {
      return Math.floor(this.resourceCount / 2);
    }

    public metadata: CardMetadata = {
      cardNumber: 'R04',
      description: 'You start with 45 MC. Increase your MC production 2 steps. 1 VP per 2 animals on this card.',
      renderData: CardRenderer.builder((b) => {
        b.megacredits(45).nbsp.productionBox((pb) => pb.megacredits(2));
        b.corpBox('effect', (ce) => {
          ce.effectBox((eb) => {
            eb.animals(1).played.slash().plants(1).played.startEffect.animals(1);
            eb.description('Effect: When you play an animal or plant tag, including this, add 1 animal to this card.');
          });
          ce.vSpace(); // to offset the description to the top a bit so it can be readable
        });
      }),
      victoryPoints: CardRenderDynamicVictoryPoints.animals(1, 2),
    }
}
