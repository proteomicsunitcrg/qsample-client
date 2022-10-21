export const environment = {
  production: true,
  apiPrefix: window['env']['apiPrefix'] || 'http://qsample.crg.eu/',
  local_requests: window['env']['local_requests'] || false
  nextflow_tower_disable: window['env']['nextflow_tower_disable'] || false
  qcloud2_disable: window['env']['qcloud2_disable'] || false
};
