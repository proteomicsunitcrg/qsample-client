export class ServerConfig {
  qcloud2_disable: boolean;
  nextflow_tower_disable: boolean;
  local_requests: boolean;

  constructor(qcloud2_disable: boolean, nextflow_tower_disable: boolean, local_requests: boolean ) {
    this.qcloud2_disable = qcloud2_disable;
    this.nextflow_tower_disable = nextflow_tower_disable;
    this.local_requests = local_requests;
  }
}
