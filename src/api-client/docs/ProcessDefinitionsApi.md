# BpmnEngineOpenApi.ProcessDefinitionsApi

All URIs are relative to *http://localhost:8080*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createProcessDefinition**](ProcessDefinitionsApi.md#createProcessDefinition) | **POST** /process-definitions | Deploy a new process definition
[**getProcessDefinition**](ProcessDefinitionsApi.md#getProcessDefinition) | **GET** /process-definitions/{processDefinitionKey} | Get process definition
[**getProcessDefinitions**](ProcessDefinitionsApi.md#getProcessDefinitions) | **GET** /process-definitions | Get list of process definitions



## createProcessDefinition

> CreateProcessDefinition200Response createProcessDefinition(body)

Deploy a new process definition

### Example

```javascript
import BpmnEngineOpenApi from 'bpmn_engine_open_api';

let apiInstance = new BpmnEngineOpenApi.ProcessDefinitionsApi();
let body = "body_example"; // String | 
apiInstance.createProcessDefinition(body, (error, data, response) => {
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
 **body** | **String**|  | 

### Return type

[**CreateProcessDefinition200Response**](CreateProcessDefinition200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/xml
- **Accept**: application/json


## getProcessDefinition

> ProcessDefinitionDetail getProcessDefinition(processDefinitionKey)

Get process definition

### Example

```javascript
import BpmnEngineOpenApi from 'bpmn_engine_open_api';

let apiInstance = new BpmnEngineOpenApi.ProcessDefinitionsApi();
let processDefinitionKey = 789; // Number | 
apiInstance.getProcessDefinition(processDefinitionKey, (error, data, response) => {
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
 **processDefinitionKey** | **Number**|  | 

### Return type

[**ProcessDefinitionDetail**](ProcessDefinitionDetail.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json


## getProcessDefinitions

> ProcessDefinitionsPage getProcessDefinitions()

Get list of process definitions

### Example

```javascript
import BpmnEngineOpenApi from 'bpmn_engine_open_api';

let apiInstance = new BpmnEngineOpenApi.ProcessDefinitionsApi();
apiInstance.getProcessDefinitions((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**ProcessDefinitionsPage**](ProcessDefinitionsPage.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

