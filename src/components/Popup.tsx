import { useEffect, useState } from "react";
import { IconKey, IconTrash } from "@tabler/icons-react";
import {
  TGetProjectResponse,
  getAllProjects,
  getUser,
} from "../services/clockify";
import { Container } from "./Container";
import { Input } from "./Input";
import { Button } from "./Button";
import { Separator } from "./Separator";

export type TClockifyProjectWithClickupList = TGetProjectResponse & {
  clickupListNames: string[];
};

export const Popup = () => {
  const [apiKey, setApiKey] = useState("");
  const [listName, setListName] = useState("");

  const [apiKeyHasError, setApiKeyHasError] = useState(false);
  const [listNameHasError, setListNameHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);

  const [selectedProject, setSelectedProject] =
    useState<TClockifyProjectWithClickupList>();
  const [projects, setProjects] = useState<TClockifyProjectWithClickupList[]>(
    []
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (apiKey.length <= 0) {
      setApiKeyHasError(true);
      return;
    }

    try {
      setIsLoading(true);
      const user = await getUser(apiKey);
      const projects = await getAllProjects({
        apiKey,
        workspaceId: user.activeWorkspace,
      });
      const formattedProjects = projects.map((project) => ({
        ...project,
        clickupListNames: [],
      }));

      setProjects(formattedProjects);

      await chrome.storage.local.set({
        user,
        apiKey,
        projects: formattedProjects,
      });
    } catch (error: any) {
      console.error("ClickClock Extension Error: " + error.message);
    } finally {
      setIsLoading(false);
      setIsFirstTime(false);
    }
  }

  const handleAddClickupListName = () => {
    if (listName.length <= 0) {
      setListNameHasError(true);
      return;
    }

    const newProjects = projects.map((project) => {
      if (project.id === selectedProject?.id) {
        return {
          ...project,
          clickupListNames: [...project.clickupListNames, listName],
        };
      }

      return project;
    });

    setProjects(newProjects);
    chrome.storage.local.set({ projects: newProjects });
  };

  const handleRemoveClickupListName = (
    project: TClockifyProjectWithClickupList,
    listName: string
  ) => {
    const newProjects = projects.map((item) => {
      if (item.id === project.id) {
        return {
          ...item,
          clickupListNames: item.clickupListNames.filter(
            (name) => name !== listName
          ),
        };
      }

      return item;
    });

    setProjects(newProjects);
    chrome.storage.local.set({ projects: newProjects });
  };

  useEffect(() => {
    chrome.storage.local.get(["apiKey", "projects"], ({ apiKey, projects }) => {
      if (apiKey !== undefined || projects !== undefined) {
        setApiKey(apiKey);
        setIsFirstTime(false);
        setProjects(projects);
      }
    });
  }, []);

  return (
    <Container>
      <div className="min-w-[400px] max-w-[400px] flex flex-col bg-gray-800 px-4 py-3">
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-y-2">
          <Input
            leftIcon={<IconKey />}
            id="api-key"
            placeholder="Your API KEY..."
            type="text"
            autoComplete="off"
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            hasError={apiKeyHasError}
          />

          <Button
            label={isFirstTime ? "Save" : "Update"}
            loading={isLoading}
            type="submit"
          />
        </form>

        <Separator className="my-4" />

        <div className="flex flex-col items-center">
          <p className="text-gray-100 mb-4">Clockify Project by Clickup List</p>

          {projects.length > 0 ? (
            <>
              <div className="flex w-full gap-x-2">
                <Input
                  id="new-list-name"
                  placeholder="Add new Clickup list name"
                  type="text"
                  autoComplete="off"
                  disabled={!selectedProject}
                  value={listName}
                  onChange={(event) => setListName(event.target.value)}
                  hasError={listNameHasError}
                />
                <Button
                  label="Add"
                  variant="outlined"
                  disabled={!selectedProject}
                  onClick={handleAddClickupListName}
                />
              </div>

              <Separator className="my-4" />

              <ul className="max-h-[300px] overflow-y-auto w-full flex flex-col gap-y-2">
                {projects.map((project) => (
                  <li
                    aria-current={selectedProject?.id === project.id}
                    className="text-gray-100 p-3 bg-gray-700 rounded-lg border border-gray-600 flex flex-col gap-y-2 aria-[current=true]:border-green-300"
                    onClick={() => {
                      setSelectedProject(project);
                    }}
                  >
                    <span>{project.name}</span>

                    {project.clickupListNames.length > 0 && (
                      <ul className="flex flex-wrap gap-1">
                        {project.clickupListNames.map((listName) => (
                          <li className="p-2 text-xs text-gray-300 border border-gray-500 rounded-md flex gap-1 items-center">
                            <span>{listName}</span>

                            <button
                              className="p-1 rounded-md hover:bg-brand/10"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleRemoveClickupListName(project, listName);
                              }}
                            >
                              <IconTrash className="w-3 h-3 stroke-brand" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <span className="text-gray-500 text-sm">No projects to show</span>
          )}
        </div>
      </div>
    </Container>
  );
};
