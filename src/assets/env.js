(function (window) {
  window['env'] = window['env'] || {};

  // Environment variables
  window['env']['apiPrefix'] = 'http://localhost:8099/';

  let config_url = window['env']['apiPrefix']+"api/config";

  fetch(config_url)
  .then(res => res.json())
  .then(out => {
      if ( out.hasOwnProperty('local_requests') ) {
        window['env']['local_requests'] = out['local_requests'];
      }
      if ( out.hasOwnProperty('qcloud2_disable') ) {
        window['env']['qcloud2_disable'] = out['qcloud2_disable'];
      }
      if ( out.hasOwnProperty('nextflow_tower_disable') ) {
        window['env']['nextflow_tower_disable'] = out['nextflow_tower_disable'];
      }
    }
  ).catch(err => { throw err });

  // Retrieval of messages
  fetch('assets/messages.json').then(response => {
    return response.json();
  }).then(data => {
    window['env']['messages'] = data;
  }).catch(err => {
    // Do something for an error here
  });


})(this)
