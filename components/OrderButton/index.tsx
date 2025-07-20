"use client";

import { useState } from 'react';
import { OrderType } from '@/constants/type';
import data from './data';

interface OrderButtonProps {
  onOrderChange: (type: OrderType) => void;
}

const OrderButton = ({ 
  onOrderChange, 
}: OrderButtonProps) => {
  const [orderType, setOrderType] = useState<OrderType>(OrderType.popularity);

  const handleOrderChange = (type: OrderType) => {
    setOrderType(type);
    onOrderChange(type);
  };

  return (
    <div className="flex justify-center my-5 rounded-3xl border border-gray-500 p-0.5 w-fit mx-auto sm:mx-0">
      {data.map((item) => {
        const color = orderType === item.type ? 'bg-gray-700' : 'bg-black/20';
        return (
        <button 
          key={item.type}
          className={`py-1.5 w-17 text-xs text-white transition-all duration-300 hover:bg-gray-700 first:rounded-l-2xl first:[&>div]:border-l-0 last:rounded-r-2xl last:[&>div]:border-r-0 ${color}`}
          onClick={() => handleOrderChange(item.type)}
        >
          <div className="w-full border-x-1 border-gray-300">{item.name}</div>
        </button>
      )})}
    </div>
  );
};

export default OrderButton;