# BpmnEngineOpenApi.JobsApi

All URIs are relative to *http://localhost:8080*

Method | HTTP request | Description
------------- | ------------- | -------------
[**completeJob**](JobsApi.md#completeJob) | **POST** /jobs | Complete a job



## completeJob

> completeJob(completeJobRequest)

Complete a job

### Example

```javascript
import BpmnEngineOpenApi from 'bpmn_engine_open_api';

let apiInstance = new BpmnEngineOpenApi.JobsApi();
let completeJobRequest = new BpmnEngineOpenApi.CompleteJobRequest(); // CompleteJobRequest | 
apiInstance.completeJob(completeJobRequest, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **completeJobRequest** | [**CompleteJobRequest**](CompleteJobRequest.md)|  | 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: Not defined

