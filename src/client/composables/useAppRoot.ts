import {getCurrentInstance} from 'vue';
import type App from '@/client/components/App';

export function useAppRoot() {
  return getCurrentInstance()!.proxy!.$root as unknown as InstanceType<typeof App>;
}
