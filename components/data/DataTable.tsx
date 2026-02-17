'use client';

import { ReactNode } from 'react';

interface TableColumn<T> {
    key: string;
    label: string;
    align?: 'left' | 'center' | 'right';
    width?: string;
    render?: (value: T[keyof T], row: T) => ReactNode;
}

interface DataTableProps<T> {
    data: T[];
    columns: TableColumn<T>[];
    onSort?: (key: string) => void;
    sortKey?: string;
    sortDirection?: 'asc' | 'desc';
    onRowClick?: (row: T) => void;
}

export default function DataTable<T extends Record<string, any>>({
    data,
    columns,
    onSort,
    sortKey,
    sortDirection,
    onRowClick,
}: DataTableProps<T>) {
    return (
        <div className="border border-white/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    {/* Header */}
                    <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    scope="col"
                                    aria-sort={
                                        sortKey === column.key
                                            ? (sortDirection === 'asc' ? 'ascending' : 'descending')
                                            : undefined
                                    }
                                    className={`px-4 py-0 text-[11px] font-bold uppercase tracking-widest text-white/70 whitespace-nowrap ${column.align === 'right'
                                        ? 'text-right'
                                        : column.align === 'center'
                                            ? 'text-center'
                                            : 'text-left'
                                        }`}
                                    style={{ width: column.width }}
                                >
                                    {onSort ? (
                                        <button
                                            onClick={() => onSort(column.key)}
                                            className={`w-full h-full py-4 flex items-center gap-2 hover:text-white transition-colors duration-200 ${column.align === 'right' ? 'justify-end' : ''}`}
                                        >
                                            {column.label}
                                            {sortKey === column.key && (
                                                <span className="text-[#0066FF]" aria-hidden="true">
                                                    {sortDirection === 'asc' ? '↑' : '↓'}
                                                </span>
                                            )}
                                        </button>
                                    ) : (
                                        <div className={`py-4 flex items-center gap-2 ${column.align === 'right' ? 'justify-end' : ''}`}>
                                            {column.label}
                                        </div>
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody>
                        {data.map((row, index) => (
                            <tr
                                key={index}
                                onClick={() => onRowClick?.(row)}
                                className={`border-b border-white/5 transition-all duration-150 ${onRowClick ? 'cursor-pointer hover:bg-white/[0.03]' : ''
                                    }`}
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className={`px-4 py-4 text-sm font-light text-white whitespace-nowrap ${column.align === 'right'
                                            ? 'text-right'
                                            : column.align === 'center'
                                                ? 'text-center'
                                                : 'text-left'
                                            }`}
                                    >
                                        {column.render
                                            ? (column.render as any)(row[column.key], row)
                                            : row[column.key] as ReactNode}
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
