// provide & inject
import type { InjectionKey, Ref } from 'vue';

export const $gate: InjectionKey<Ref<typeGate | undefined>> = Symbol('');
