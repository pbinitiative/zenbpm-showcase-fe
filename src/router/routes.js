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
        path: "process-instances",
        component: () => import("pages/ProcessInstancesPage.vue"),
      },
      {
        path: "process-instances/:processInstanceKey",
        component: () => import("pages/ProcessInstanceDetailPage.vue"),
      },
      {
        path: "forms/:formKey",
        component: () => import("pages/FormPage.vue"),
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
