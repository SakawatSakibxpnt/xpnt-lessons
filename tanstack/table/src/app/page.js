"use client"

import { createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import MockData from "../config/data.json";
import { ArrowUpDown, User } from "lucide-react";
import { useState } from "react";


const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("id", {
    header: ()=>(
      <span className="flex items-center">
        <User className="mr-2" size={16}/> ID
      </span>
    ),
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("name", {
    header: ()=>(
      <span className="flex items-center">
        <User className="mr-2" size={16}/> Name
      </span>
    ),
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("mobile", {
    header: ()=>(
      <span className="flex items-center">
        <User className="mr-2" size={16}/> Mobile
      </span>
    ),
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("email", {
    id: "email",
    header: ()=>(
      <span className="flex items-center">
        <User className="mr-2" size={16}/> Email
      </span>
    ),
    cell: (info) => (
      <span className="text-blue-500">{info.getValue()}</span>
    )
  }),
];

export default function Home() {
  const [data, setData] = useState(()=>[...MockData]);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("")
  
  const table  = useReactTable({
    data: data,
    columns : columns,
    state: {
      sorting: sorting,
      globalFilter: globalFilter
    },
    getCoreRowModel: getCoreRowModel(),

    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel,

  })

  console.log(table)
  return (
    <div className="flex flex-col min-h-screen max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {
              table.getHeaderGroups().map((headerGroup)=>(
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header)=>(
                    <th key={header.id} className="text-gray-600">
                      <div {
                        ...{
                          className: header.column.getCanSort() ? "cursor-pointer select-none flex items-center": "",
                          onClick: header.column.getToggleSortingHandler(),
                        }
                      }>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <ArrowUpDown className="ml-2" size={14} />
                      </div>
                    </th>
                  ))}
                </tr>
              ))
            }
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row)=>(
              <tr key={row.id} className="hover:bg-gray-100">
                {row.getVisibleCells().map((cell)=>(
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

      </div>
      
    </div>
  );
}
