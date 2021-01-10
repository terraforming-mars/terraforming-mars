import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Tags} from '../Tags';
import {ResourceType} from '../../ResourceType';
import {Resources} from '../../Resources';
import {Game} from '../../Game';
import {IProjectCard} from '../IProjectCard';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {CardName} from '../../CardName';
import {IResourceCard} from '../ICard';
import {CardType} from '../CardType';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';


export class Recyclon implements CorporationCard, IResourceCard {
    public name = CardName.RECYCLON;
    public tags = [Tags.MICROBE, Tags.BUILDING];
    public startingMegaCredits: number = 38;
    public resourceType = ResourceType.MICROBE;
    public resourceCount: number = 0;
    public cardType = CardType.CORPORATION;

    public play(player: Player) {
      player.addProduction(Resources.STEEL);
      player.addResourceTo(this);
      return undefined;
    }
    public onCardPlayed(player: Player, _game: Game, card: IProjectCard) {
      if (card.tags.indexOf(Tags.BUILDING) === -1 || !player.isCorporation(this.name)) {
        return undefined;
      }
      if (this.resourceCount < 2) {
        player.addResourceTo(this);
        return undefined;
      }

      const addResource = new SelectOption('Add a microbe resource to this card', 'Add microbe', () => {
        player.addResourceTo(this);
        return undefined;
      });

      const spendResource = new SelectOption('Remove 2 microbes on this card and increase plant production 1 step', 'Remove microbes', () => {
        player.removeResourceFrom(this, 2);
        player.addProduction(Resources.PLANTS);
        return undefined;
      });
      return new OrOptions(spendResource, addResource);
    }

    public metadata: CardMetadata = {
      cardNumber: 'R26',
      description: 'You start with 38 MC and 1 steel production.',
      renderData: CardRenderer.builder((b) => {
        b.br.br;
        b.megacredits(38).nbsp.production((pb) => pb.steel(1));
        b.corpBox('effect', (ce) => {
          ce.effect('When you play a building tag, including this, gain 1 microbe to this card, or remove 2 microbes here and raise your plant production 1 step.', (eb) => {
            eb.building().played.colon().microbes(1).or();
            eb.microbes(2).digit.startEffect.production((pb) => pb.plants(1));
          });
        });
      }),
    }
}
