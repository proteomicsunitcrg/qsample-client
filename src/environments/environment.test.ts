export const environment = {
  production: true,
  apiPrefix: window['env']['apiPrefix'] || 'http://qgenerator.crg.eu:8095/',
  local_requests: window['env']['local_requests'] || true,
  nextflow_tower_disable: window['env']['nextflow_tower_disable'] || true,
  qcloud2_disable: window['env']['qcloud2_disable'] || true
};
