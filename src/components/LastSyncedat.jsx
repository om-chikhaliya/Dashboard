import { formatDistanceToNow } from "date-fns";

export function LastSyncedat({ syncdate }) {
  return (
    <p className="text-[12px] text-gray-500 mt-1">
      Last Synced at {formatDistanceToNow(new Date(syncdate), { addSuffix: true })}
    </p>
  );
}
