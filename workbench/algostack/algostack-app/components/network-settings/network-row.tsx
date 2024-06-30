/* eslint-disable @next/next/no-img-element */
import { IconCheckCircleFilled } from "@/dashboard/icons";

export const NetworkRow = ({ network, isNetworkActive, onClick }) => {
  const hasImage = network.logoUrl && network.logoUrl.trim() !== "";

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-start cursor-pointer hover:bg-gray-100 p-2"
    >
      {hasImage ? (
        <img
          src={network.logoUrl}
          alt={`${network.name} Logo`}
          className="w-8 h-8 mr-2 rounded"
        />
      ) : (
        <div className="w-8 h-8 mr-2 flex items-center justify-center rounded bg-gray-300 text-black text-lg">
          {network.name?.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="flex flex-col flex-1">
        <div className="flex items-center">
          <div className="font-medium truncate">
            {network.name}
          </div>
          {isNetworkActive && (
            <div className="ml-2 text-green-500">
              <IconCheckCircleFilled />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
