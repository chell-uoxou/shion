import React from "react";
import { Clock, MapPin } from "lucide-react";
import Image from "next/image";

const MemoryCard = ({
  date = "2025.08.07",
  day = "木曜日",
  title = "タイトル…",
  detail = "詳細文をここに書く…",
  time = "19:00",
  location = "OIC",
  imageUrl = "",
}) => {
  return (
    <div className="max-w-md bg-purple-200 rounded-xl shadow-md p-4 flex items-start space-x-4">
      {/* 左側 日付 */}
      <div className="flex flex-col items-center w-16 text-purple-900">
        <span className="text-sm">{date.slice(0, 7)}</span>
        <span className="text-3xl font-bold">{date.slice(-2)}</span>
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
            <span>{time}</span>
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
