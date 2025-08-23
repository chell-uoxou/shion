import React from "react";
import { Clock, MapPin } from "lucide-react";
import Image from "next/image";

type MemoryCardProps = {
  title: string;
  detail: string | null;
  occurredAt?: string | null;
  location: string;
  imageUrl: string | null;
};

const MemoryCard = (props: MemoryCardProps) => {
  const { occurredAt, title, detail, location, imageUrl } = props;

  const date = occurredAt ? new Date(occurredAt) : null;
  const day = date ? date.toLocaleDateString("ja-JP", { weekday: "long" }) : "";

  return (
    <div className="max-w-md bg-purple-200 rounded-xl shadow-md p-4 flex items-start space-x-4">
      {/* 左側 日付 */}
      <div className="flex flex-col items-center w-16 text-purple-900">
        <span className="text-sm">
          {date?.toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "2-digit",
          })}
        </span>
        <span className="text-3xl font-bold">{date?.getDate()}</span>
        <span className="text-sm">{day}</span>
      </div>

      {/* 中央 タイトル・詳細 */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-purple-900">{title}</h3>
        <p className="text-sm text-purple-800">{detail}</p>

        {/* 時間 & 場所 */}
        <div className="mt-3 flex items-center space-x-3 text-sm text-purple-900">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>
              {date &&
                date?.toLocaleTimeString("ja-JP", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
        </div>
      </div>

      {/* 右側 画像 */}
      <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="thumbnail"
            width={64}
            height={64}
            className="w-full h-full object-cover"
            style={{ objectFit: "cover" }}
          />
        ) : null}
      </div>
    </div>
  );
};

export default MemoryCard;
