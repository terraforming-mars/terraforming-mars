<template>
    <div class="help-turmoil-parties-container">
      <h2 v-i18n>Political Parties</h2>
      <p v-i18n>The ruling party's bonus applies once, scaled by how well each player matches it. Its policy stays active until a new party takes power.</p>

      <div class="help-parties-grid">
        <div class="help-party-card" v-for="party in parties" :key="party.name">
          <div class="help-party-label">
            <div :class="'card-party card-party--'+partyLogoSlug(party.name)"></div>
            <div :class="'party-name party-name--'+partyNameToCss(party.name)" v-i18n>{{party.name}}</div>
          </div>

          <div class="help-agenda-section">
            <div class="help-agenda-card" v-for="id in party.bonusIds" :key="id">
              <TurmoilAgenda :id="id" />
              <div class="help-agenda-description" v-i18n>{{ agendaDescription(id) }}</div>
            </div>
          </div>

          <div class="help-agenda-divider"></div>

          <div class="help-agenda-section">
            <div class="help-agenda-card" v-for="id in party.policyIds" :key="id">
              <TurmoilAgenda :id="id" />
              <div class="help-agenda-description" v-i18n>{{ agendaDescription(id) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
<script setup lang="ts">
import {computed} from 'vue';
import {PartyName} from '@/common/turmoil/PartyName';
import {agendaInfoById, BONUS_IDS, POLICY_IDS, BonusId, PolicyId} from '@/common/turmoil/Types';
import {getAgendaOrThrow} from '@/client/turmoil/ClientAgendaManifest';
import TurmoilAgenda from '@/client/components/turmoil/TurmoilAgenda.vue';

type PartyHelpEntry = {
  name: PartyName;
  bonusIds: ReadonlyArray<BonusId>;
  policyIds: ReadonlyArray<PolicyId>;
};

const parties = computed<Array<PartyHelpEntry>>(() => {
  return Object.values(PartyName).map((name) => {
    return {
      name,
      bonusIds: BONUS_IDS.filter((id) => agendaInfoById(id).name === name),
      policyIds: POLICY_IDS.filter((id) => agendaInfoById(id).name === name),
    };
  });
});

function agendaDescription(id: BonusId | PolicyId): string {
  return getAgendaOrThrow(id).description;
}

function partyNameToCss(party: PartyName): string {
  return party.toLowerCase().split(' ').join('_');
}

// The real .card-party--<slug> party logo images (cards_v2.less's @parties list) use hyphens,
// unlike every other party-slug class on this page (party-name--mars_first etc, which use
// underscores) - the only place that differs is "mars-first" vs "mars_first".
function partyLogoSlug(party: PartyName): string {
  return partyNameToCss(party).replace('_', '-');
}
</script>
