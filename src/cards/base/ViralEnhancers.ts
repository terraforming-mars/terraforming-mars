import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {CardName} from '../../CardName';
import {ResourceType} from '../../ResourceType';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class ViralEnhancers implements IProjectCard {
    public cost = 9;
    public tags = [Tags.SCIENCE, Tags.MICROBES];
    public name = CardName.VIRAL_ENHANCERS;
    public cardType = CardType.ACTIVE;

    public onCardPlayed(player: Player, game: Game, card: IProjectCard) {
      const resourceCount = card.tags.filter((tag) => tag === Tags.ANIMAL || tag === Tags.PLANT || tag === Tags.MICROBES).length;
      if (resourceCount === 0) {
        return undefined;
      }

      if (card.resourceType !== ResourceType.ANIMAL && card.resourceType !== ResourceType.MICROBE) {
        player.plants += resourceCount;
        return undefined;
      }

      for (let i = 0; i < resourceCount; i++) {
        game.defer(new DeferredAction(
          player,
          () => new OrOptions(
            new SelectOption('Add resource to card ' + card.name, 'Add resource', () => {
              player.addResourceTo(card);
              return undefined;
            }),
            new SelectOption('Gain plant', 'Save', () => {
              player.plants++;
              return undefined;
            }),
          ),
        ));
      }
      return undefined;
    }

    public play() {
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: '074',
      renderData: CardRenderer.builder((b) => {
        // TODO (chosta): find a way to have an effect on two rows
        b.plants(1).played.slash().microbes(1).played.slash().animals(1).played.br;
        b.effectBox((eb) => {
          eb.empty().startEffect;
          eb.plants(1).slash().microbes(1).asterix().slash().animals(1).asterix();
          eb.description('Effect: When you play a plant, microbe, or an animal tag, including this, gain 1 plant or add 1 resource to THAT CARD.');
        });
      }),
    }
}
