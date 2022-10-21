// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiPrefix: window['env']['apiPrefix'] || 'http://localhost:8081/',
  local_requests: window['env']['local_requests'] || true,
  nextflow_tower_disable: window['env']['nextflow_tower_disable'] || true,
  qcloud2_disable: window['env']['qcloud2_disable'] || true
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
