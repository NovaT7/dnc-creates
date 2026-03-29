import React from 'react';

export default function ProductSkeleton() {
  return (
    <div className="flex flex-col h-full bg-soft-white/40 border border-transparent p-2">
      {/* Image Box */}
      <div className="aspect-square w-full skeleton mb-4 relative rounded-sm" />

      {/* Details Box */}
      <div className="px-2 pb-4 flex flex-col flex-grow items-center text-center">
        {/* Category */}
        <div className="w-1/2 h-3 skeleton mb-3 rounded-sm" />
        {/* Title */}
        <div className="w-3/4 h-4 skeleton mb-4 rounded-sm" />
        {/* Price */}
        <div className="w-1/4 h-4 skeleton mt-auto rounded-sm" />
      </div>
    </div>
  );
}
