export type TClockifyTimeEntryResponse = {
  id: string;
  description: string;
  billable: boolean;
  isLocked: boolean;
  kioskid: string;
  projectId: string;
  tagIds: string[];
  taskId: string;
  userId: string;
  timeInterval: {
    start: string;
    end: string;
    duration: string;
  };
  workspaceId: string;
  type: string;
  customFieldValues: any[];
};

export type TClockifyGetUserResponse = {
  id: string;
  activeWorkspace: string;
};

export type TClockifyGetProjectResponse = {
  id: string;
  name: string;
};

export type TClockifyGetTagResponse = {
  id: string;
  name: string;
};

export type TClockifyCreateNewTimeEntryParams = {
  body: {
    billable: boolean;
    description: string;
    start: string;
    end?: string;
    projectId?: string;
    tagIds?: string[];
  };
  config: {
    apiKey: string;
    workspaceId: string;
  };
};

export type TClockifyStopRunningTimeEntryParams = {
  userId: string;
  config: {
    apiKey: string;
    workspaceId: string;
  };
  body: {
    end: string;
  };
};

export type TClockifyGetLastTimeEntryParams = {
  apiKey: string;
  workspaceId: string;
  userId: string;
};

export type TClockifyGetAllProjectsParams = {
  apiKey: string;
  workspaceId: string;
};

export type TClockifyGetAllTagsParams = {
  apiKey: string;
  workspaceId: string;
};

export type TClockifyProjectWithClickupList = TClockifyGetProjectResponse & {
  clickupListNames: string[];
};

export type TClockifyGetAllEntriesByTaskId = {
  apiKey: string;
  workspaceId: string;
  userId: string;
  taskId: string;
};

export type TClockifyEditTimeEntryBodyParam = {
  end: string;
  start: string;
  description: string;
  projectId: string;
  tagIds: string[];
  taskId: string;
  customFields: any[];
};

export type TClockifyEditTimeEntryParams = {
  id: string;
  config: {
    apiKey: string;
    workspaceId: string;
  };
  body: TClockifyEditTimeEntryBodyParam;
};

export type TClockifyDeleteTimeEntryParams = {
  config: {
    apiKey: string;
    workspaceId: string;
  };
  id: string;
};
