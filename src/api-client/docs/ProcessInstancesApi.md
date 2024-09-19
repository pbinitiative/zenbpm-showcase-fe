# BpmnEngineOpenApi.ProcessInstancesApi

All URIs are relative to *http://localhost:8080*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createProcessInstance**](ProcessInstancesApi.md#createProcessInstance) | **POST** /process-instances | Create a new process instance
[**getActivities**](ProcessInstancesApi.md#getActivities) | **GET** /process-instances/{processInstanceKey}/activities | Get list of activities for a process instance
[**getJobs**](ProcessInstancesApi.md#getJobs) | **GET** /process-instances/{processInstanceKey}/jobs | Get list of jobs for a process instance
[**getProcessInstance**](ProcessInstancesApi.md#getProcessInstance) | **GET** /process-instances/{processInstanceKey} | Get state of a process instance selected by processInstanceId
[**getProcessInstances**](ProcessInstancesApi.md#getProcessInstances) | **GET** /process-instances/ | Get list of running process instances



## createProcessInstance

> ProcessInstance createProcessInstance(createProcessInstanceRequest)

Create a new process instance

### Example

```javascript
import BpmnEngineOpenApi from 'bpmn_engine_open_api';

let apiInstance = new BpmnEngineOpenApi.ProcessInstancesApi();
let createProcessInstanceRequest = new BpmnEngineOpenApi.CreateProcessInstanceRequest(); // CreateProcessInstanceRequest | 
apiInstance.createProcessInstance(createProcessInstanceRequest, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createProcessInstanceRequest** | [**CreateProcessInstanceRequest**](CreateProcessInstanceRequest.md)|  | 

### Return type

[**ProcessInstance**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json


## getActivities

> ActivityPage getActivities(processInstanceKey)

Get list of activities for a process instance

### Example

```javascript
import BpmnEngineOpenApi from 'bpmn_engine_open_api';

let apiInstance = new BpmnEngineOpenApi.ProcessInstancesApi();
let processInstanceKey = 789; // Number | 
apiInstance.getActivities(processInstanceKey, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **processInstanceKey** | **Number**|  | 

### Return type

[**ActivityPage**](ActivityPage.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getJobs

> JobPage getJobs(processInstanceKey)

Get list of jobs for a process instance

### Example

```javascript
import BpmnEngineOpenApi from 'bpmn_engine_open_api';

let apiInstance = new BpmnEngineOpenApi.ProcessInstancesApi();
let processInstanceKey = 789; // Number | 
apiInstance.getJobs(processInstanceKey, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **processInstanceKey** | **Number**|  | 

### Return type

[**JobPage**](JobPage.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getProcessInstance

> ProcessInstance getProcessInstance(processInstanceKey)

Get state of a process instance selected by processInstanceId

### Example

```javascript
import BpmnEngineOpenApi from 'bpmn_engine_open_api';

let apiInstance = new BpmnEngineOpenApi.ProcessInstancesApi();
let processInstanceKey = 789; // Number | 
apiInstance.getProcessInstance(processInstanceKey, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **processInstanceKey** | **Number**|  | 

### Return type

[**ProcessInstance**](ProcessInstance.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getProcessInstances

> GetProcessInstances200Response getProcessInstances(opts)

Get list of running process instances

### Example

```javascript
import BpmnEngineOpenApi from 'bpmn_engine_open_api';

let apiInstance = new BpmnEngineOpenApi.ProcessInstancesApi();
let opts = {
  'processDefinitionKey': 789, // Number | 
  'offset': 0, // Number | 
  'size': 10 // Number | 
};
apiInstance.getProcessInstances(opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **processDefinitionKey** | **Number**|  | [optional] 
 **offset** | **Number**|  | [optional] [default to 0]
 **size** | **Number**|  | [optional] [default to 10]

### Return type

[**GetProcessInstances200Response**](GetProcessInstances200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

