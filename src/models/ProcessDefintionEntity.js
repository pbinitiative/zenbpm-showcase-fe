export class ProcessDefinitionEntity {
  constructor(
    key,
    version,
    bpmnProcessId,
    bpmnData,
    bpmnChecksum,
    bpmnResourceName
  ) {
    this.key = key;
    this.version = version;
    this.bpmnProcessId = bpmnProcessId;
    this.bpmnData = bpmnData;
    this.bpmnChecksum = bpmnChecksum;
    this.bpmnResourceName = bpmnResourceName;
  }
}
