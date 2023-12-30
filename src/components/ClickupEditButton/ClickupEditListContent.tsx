import { Fragment, useMemo } from "react";
import { useCurrentEntriesList } from "../../hooks/useCurrentEntriesList";
import { Button } from "../Button";
import { Separator } from "../Separator";
import { DateHelper, DateLocalHelper } from "../../helpers/DateHelper";
import { Loader } from "../Loader";
import { ClickupEditListContentItem } from "./ClickupEditListContentItem";
import { TClockifyTimeEntryResponse } from "../../@types/services";
import { useClockify } from "../../hooks/useClockify";
import { TClickupVersion } from "../../@types/clickup";

type TProps = {
  onNewEntryClick?: () => void;
  onEdit(entry: TClockifyTimeEntryResponse): void;
  version: TClickupVersion;
};

export const ClickupEditListContent = ({
  onNewEntryClick,
  onEdit,
  version,
}: TProps) => {
  const { data, isLoading, isError, refetch } = useCurrentEntriesList();
  const { deleteTimeEntry } = useClockify(version);

  const totalDuration = useMemo(() => {
    if (!data) return "00:00:00";

    const total = data.reduce((acc, entry) => {
      const formattedStart =
        DateLocalHelper.formatUtcDateTimeToLocalFormattedTime(
          entry.timeInterval.start
        );

      const formattedEnd =
        DateLocalHelper.formatUtcDateTimeToLocalFormattedTime(
          entry.timeInterval.end
        );

      const duration = DateHelper.formattedDuration(
        formattedStart,
        formattedEnd
      ).diffInSeconds;

      return acc + duration;
    }, 0);

    return DateHelper.formatDurationInSeconds(total);
  }, [data]);

  const handleDelete = async (entry: TClockifyTimeEntryResponse) => {
    await deleteTimeEntry(entry.id);
    await refetch();
  };

  return (
    <div className="flex flex-col gap-2 w-full !text-grey-100">
      {isLoading ? (
        <div className="flex w-full justify-center">
          <Loader />
        </div>
      ) : (
        !isError && (
          <Fragment>
            <Button flat label="New Entry" onClick={onNewEntryClick} />

            {data && data.length > 0 && (
              <Fragment>
                <Separator className="my-1.5" />

                <ul className=" flex flex-col gap-1.5">
                  {data?.map((entry, index) => (
                    <Fragment key={index}>
                      <ClickupEditListContentItem
                        entry={entry}
                        onEdit={onEdit}
                        onDelete={handleDelete}
                      />

                      {index < data.length - 1 && <Separator />}
                    </Fragment>
                  ))}
                </ul>

                <Separator />

                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{totalDuration}</span>
                </div>
              </Fragment>
            )}
          </Fragment>
        )
      )}
    </div>
  );
};
