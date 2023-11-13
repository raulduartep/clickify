export type TTimeEntryResponse = {
  id: string;
  description: string;
  billable: boolean;
  timeInterval: {
    start: string;
    end: string;
    duration: string;
  };
  workspaceId: string;
};

export type TGetUserResponse = {
  id: string;
  activeWorkspace: string;
};

export type TGetProjectResponse = {
  id: string;
  name: string;
};

type TCreateNewTimeEntryParams = {
  body: {
    billable: boolean;
    description: string;
    start: string;
    projectId?: string;
  };
  config: {
    apiKey: string;
    workspaceId: string;
  };
};

type TStopRunningTimeEntryParams = {
  userId: string;
  config: {
    apiKey: string;
    workspaceId: string;
  };
  body: {
    end: string;
  };
};

type TGetLastTimeEntryParams = {
  apiKey: string;
  workspaceId: string;
  userId: string;
};

type TGetAllProjectsParams = {
  apiKey: string;
  workspaceId: string;
};

const buildTimeEntry = (data: any): TTimeEntryResponse => ({
  billable: data.billable,
  description: data.description,
  id: data.id,
  timeInterval: data.timeInterval,
  workspaceId: data.workspaceId,
});

export const createNewTimeEntry = async ({
  body,
  config,
}: TCreateNewTimeEntryParams) => {
  const response = await fetch(
    `https://api.clockify.me/api/v1/workspaces/${config.workspaceId}/time-entries`,
    {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "X-Api-Key": config.apiKey,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error creating time entry");
  }

  const data = await response.json();

  return buildTimeEntry(data);
};

export const stopRunningTimeEntry = async ({
  userId,
  config,
  body,
}: TStopRunningTimeEntryParams) => {
  const response = await fetch(
    `https://api.clockify.me/api/v1/workspaces/${config.workspaceId}/user/${userId}/time-entries`,
    {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: {
        "X-Api-Key": config.apiKey,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error updating time entry");
  }

  const data = await response.json();
  return buildTimeEntry(data);
};

export const getUser = async (apiKey: string) => {
  const response = await fetch(`https://api.clockify.me/api/v1/user`, {
    method: "GET",
    headers: {
      "X-Api-Key": apiKey,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error getting user");
  }

  const data = await response.json();
  return {
    activeWorkspace: data.activeWorkspace,
    id: data.id,
  } as TGetUserResponse;
};

export const getLastTimeEntry = async ({
  apiKey,
  userId,
  workspaceId,
}: TGetLastTimeEntryParams) => {
  const response = await fetch(
    `https://api.clockify.me/api/v1/workspaces/${workspaceId}/user/${userId}/time-entries?page-size=1`,
    {
      method: "GET",
      headers: {
        "X-Api-Key": apiKey,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error getting last time entry");
  }

  const data = await response.json();
  return buildTimeEntry(data[0]);
};

export const getAllProjects = async ({
  apiKey,
  workspaceId,
}: TGetAllProjectsParams) => {
  const response = await fetch(
    `  https://api.clockify.me/api/v1/workspaces/${workspaceId}/projects`,
    {
      method: "GET",
      headers: {
        "X-Api-Key": apiKey,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error getting all projects");
  }

  const data = (await response.json()) as any[];
  return data.map<TGetProjectResponse>((item) => ({
    id: item.id,
    name: item.name,
  }));
};
