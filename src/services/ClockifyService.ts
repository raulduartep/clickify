import { TClockifyCreateNewTimeEntryParams, TClockifyGetAllProjectsParams, TClockifyGetAllTagsParams, TClockifyGetLastTimeEntryParams, TClockifyGetProjectResponse, TClockifyGetTagResponse, TClockifyGetUserResponse, TClockifyStopRunningTimeEntryParams, TClockifyTimeEntryResponse } from "../@types/services";

export class ClockifyService {
  private static buildUrl(path: string) {
    return `https://api.clockify.me/api/v1/${path}`;
  }

  private static buildTimeEntry(data: any): TClockifyTimeEntryResponse {
    return {
      billable: data.billable,
      description: data.description,
      id: data.id,
      timeInterval: data.timeInterval,
      workspaceId: data.workspaceId,
    }
  }

  static async createNewTimeEntry({
    body,
    config,
  }: TClockifyCreateNewTimeEntryParams): Promise<TClockifyTimeEntryResponse> {
    const response = await fetch(
      this.buildUrl(`workspaces/${config.workspaceId}/time-entries`),
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

    return this.buildTimeEntry(data);
  }

  static async stopRunningTimeEntry({
    userId,
    config,
    body,
  }: TClockifyStopRunningTimeEntryParams): Promise<TClockifyTimeEntryResponse> {
    const response = await fetch(
      this.buildUrl(`workspaces/${config.workspaceId}/user/${userId}/time-entries`),
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
    return this.buildTimeEntry(data);
  }

  static async getUser(apiKey: string): Promise<TClockifyGetUserResponse> {
    const response = await fetch(this.buildUrl("v1/user"), {
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
    };
  }

  static async getLastTimeEntry({
    apiKey,
    userId,
    workspaceId,
  }: TClockifyGetLastTimeEntryParams): Promise<TClockifyTimeEntryResponse> {
    const response = await fetch(
      this.buildUrl(`workspaces/${workspaceId}/user/${userId}/time-entries?page-size=1`),
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
    return this.buildTimeEntry(data[0]);
  }

  static async getAllProjects({
    apiKey,
    workspaceId,
  }: TClockifyGetAllProjectsParams): Promise<TClockifyGetProjectResponse[]> {
    const response = await fetch(
      this.buildUrl(`workspaces/${workspaceId}/projects`),
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

    const data = await response.json()
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
    }));
  }

  static async getAllTags({
    apiKey,
    workspaceId,
  }: TClockifyGetAllTagsParams): Promise<TClockifyGetTagResponse[]> {
    const response = await fetch(
      `https://api.clockify.me/api/v1/workspaces/${workspaceId}/tags?archived=false`,
      {
        method: "GET",
        headers: {
          "X-Api-Key": apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error getting all tags");
    }

    const data = await response.json()
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
    }));
  }
}

