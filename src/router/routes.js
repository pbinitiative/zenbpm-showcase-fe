const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      {
        path: "process-definitions",
        component: () => import("pages/ProcessDefinitionsPage.vue"),
      },
      {
        path: "process-definitions/:processDefinitionKey",
        component: () => import("pages/ProcessDefinitionDetailPage.vue"),
      },
      {
        path: "process-definitions/new",
        component: () => import("pages/ProcessDefinitionEditorPage.vue"),
      },
      {
        path: "process-definitions/edit/:processDefinitionKey",
        component: () => import("pages/ProcessDefinitionEditorPage.vue"),
      },
      {
        path: "process-instances",
        component: () => import("pages/ProcessInstancesPage.vue"),
      },
      {
        path: "process-instances/:processInstanceKey",
        component: () => import("pages/ProcessInstanceDetailPage.vue"),
      },
      {
        path: "tasklist/:id?/:action?/",
        component: () => import("pages/FormPage.vue"),
      },
      {
        path: "business-rules",
        component: () => import("pages/BusinessRulesPage.vue"),
      },
      {
        path: "business-rules/:decisionDefinitionKey",
        component: () => import("pages/BusinessRuleDetailPage.vue"),
      },
      {
        path: "business-rules/edit/:decisionDefinitionKey",
        component: () => import("pages/BusinessRuleEditorPage.vue"),
      },
      {
        path: "business-rules/new",
        component: () => import("pages/BusinessRuleEditorPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
