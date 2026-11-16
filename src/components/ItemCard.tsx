import React from 'react';
import { Item } from '../types';
import { usePortal } from '../context/PortalContext';
import { MapPin, Calendar, Tag, CheckCircle2, User, Phone } from 'lucide-react';

interface ItemCardProps {
  item: Item;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const { openItemDetail, openUploaderVerify } = usePortal();

  const isLost = item.status === 'lost';
  const isFound = item.status === 'found';
  const isClaimed = item.status === 'claimed';

  return (
    <div className="group bg-white rounded-2xl border border-gray-200/90 hover:border-gray-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Media / Image Area */}
      <div
        className="relative h-48 w-full bg-gray-100 overflow-hidden cursor-pointer"
        onClick={() => openItemDetail(item)}
      >
        <img
          src={item.imageUrl}
          alt={item.title}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?auto=format&fit=crop&w=600&q=80';
          }}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          {isLost && (
            <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-rose-500/90 text-white backdrop-blur-xs shadow-xs uppercase tracking-wider">
              Lost
            </span>
          )}
          {isFound && (
            <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-emerald-500/90 text-white backdrop-blur-xs shadow-xs uppercase tracking-wider">
              Found
            </span>
          )}
          {isClaimed && (
            <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-purple-600/90 text-white backdrop-blur-xs shadow-xs uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Reunited
            </span>
          )}
        </div>

        {/* Reward pill if any */}
        {item.reward && (
          <div className="absolute top-3 right-3 bg-amber-400 text-amber-950 font-bold text-[11px] px-2 py-0.5 rounded-full shadow-xs">
            Reward: {item.reward}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Tag */}
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 mb-1.5">
            <Tag className="w-3 h-3 text-blue-500" />
            <span>{item.category}</span>
          </div>

          {/* Item Title */}
          <h3
            onClick={() => openItemDetail(item)}
            className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition line-clamp-1 cursor-pointer mb-1.5"
          >
            {item.title}
          </h3>

          {/* Description snippet */}
          <p className="text-xs text-gray-600 line-clamp-2 mb-3">
            {item.description}
          </p>
        </div>

        {/* Location & Date Footer */}
        <div className="pt-3 border-t border-gray-100 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate font-medium">{item.location}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-gray-500 shrink-0">
              <Calendar className="w-3 h-3 text-gray-400" />
              <span>{item.date}</span>
            </div>
          </div>

          {/* Uploader Name */}
          <div className="flex items-center gap-1 text-[11px] text-gray-500">
            <User className="w-3 h-3 text-blue-600 shrink-0" />
            <span className="truncate">Reported by: <strong>{item.reporterName}</strong></span>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => openItemDetail(item)}
              className="flex-1 bg-gray-900 hover:bg-blue-600 text-white text-xs font-semibold py-2 px-3 rounded-lg transition active:scale-95 text-center shadow-xs"
            >
              View Details
            </button>
            {!isClaimed && (
              <button
                onClick={() => openUploaderVerify(item, 'reunite')}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold py-2 px-2.5 rounded-lg transition active:scale-95"
                title="Only original uploader can mark reunited"
              >
                Reunited?
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
