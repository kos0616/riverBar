// import mitt, { type Emitter } from 'mitt';

// declare module '@vue/runtime-core' {
//   interface ComponentCustomProperties {
//     $bus: typeof emitter;
//   }
// }

export type Events = {
  changeLang: string;
};

// export const emitter: Emitter<Events> = mitt<Events>();

/** 自訂插件，全域bus $bus */
// export default {
//   install: (app: App<Element>, options?: any) => {
//     app.config.globalProperties.$bus = emitter;
//     app.provide($bus, emitter);
//   }
// };
