'use client';

import React from "react";
import {
    Selection,
    SortDescriptor,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/table";
import {Button} from "@heroui/button";
import {Input} from "@heroui/input";
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@heroui/dropdown";
import {Pagination} from "@heroui/pagination";
import {ChevronDownIcon, PlusIcon, SearchIcon} from "@/components/icons"

export function capitalize(s: string) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

interface CustomTableProps<T> {
    data: T[];
    columns: { name: string; uid: string; sortable?: boolean }[];
    searchKey: keyof T;
    initialVisibleColumns: string[];
    statusOptions?: { name: string; uid: string }[];
    renderCell: (item: T, columnKey: React.Key) => React.ReactNode;
    onAdd: () => void;
    onDelete: (ids: (string | number)[]) => void;
    onRowAction?: (key: React.Key) => void;
    searchLabel:string;
    selectedKeys: Selection;
    onSelectionChange: (keys: Selection) => void;
}

export function CustomTable<T extends { id: string | number }>({
                                                                   data,
                                                                   columns,
                                                                   searchKey,
                                                                   initialVisibleColumns,
                                                                   statusOptions = [],
                                                                   renderCell,
                                                                   onAdd,
                                                                   onDelete,
                                                                   onRowAction,
                                                                   searchLabel,
                                                                   selectedKeys,
                                                                   onSelectionChange,
                                                               }: CustomTableProps<T>) {
    const [filterValue, setFilterValue] = React.useState("");
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(initialVisibleColumns));
    const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        column: String(searchKey),
        direction: "ascending",
    });
    const [page, setPage] = React.useState(1);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;
        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns, columns]);

    const filteredItems = React.useMemo(() => {
        let filteredItems = [...data];
        if (filterValue) {
            filteredItems = filteredItems.filter((item) =>
                String(item[searchKey]).toLowerCase().includes(filterValue.toLowerCase())
            );
        }

        if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
            filteredItems = filteredItems.filter((item) =>
                Array.from(statusFilter).includes((item as any).statusId),
            );
        }

        return filteredItems;
    }, [data, filterValue, searchKey, statusFilter, statusOptions]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

    const sortedItems = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const items = filteredItems.slice(start, start + rowsPerPage);

        return items.sort((a, b) => {
            const first = a[sortDescriptor.column as keyof T] as any;
            const second = b[sortDescriptor.column as keyof T] as any;
            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [page, filteredItems, rowsPerPage, sortDescriptor]);

    const count = selectedKeys === "all"
        ? sortedItems.length
        : Array.from(selectedKeys).length;

    const handlePrepareDelete = () => {
        const ids = selectedKeys === "all"
            ? sortedItems.map(item => item.id)
            : Array.from(selectedKeys);
        onDelete(ids);
    };

    const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const topContent = React.useMemo(() => (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-3 items-end">
                <Input
                    isClearable
                    className="w-full sm:max-w-[44%]"
                    placeholder={`${searchLabel}で検索…`}
                    startContent={<SearchIcon/>}
                    value={filterValue}
                    onValueChange={(val) => {
                        setFilterValue(val);
                        setPage(1);
                    }}
                />
                <div className="flex gap-3">
                    {statusOptions.length > 0 && (
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDownIcon className="text-small"/>} variant="flat">
                                    ステータス
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="multiple"
                                onSelectionChange={setStatusFilter}
                            >
                                {statusOptions.map((status) => (
                                    <DropdownItem key={status.uid} className="capitalize">
                                        {capitalize(status.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    )}
                    <Dropdown>
                        <DropdownTrigger className="hidden sm:flex">
                            <Button endContent={<ChevronDownIcon className="text-small"/>} variant="flat">
                                カラム
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            disallowEmptySelection
                            closeOnSelect={false}
                            selectedKeys={visibleColumns}
                            selectionMode="multiple"
                            onSelectionChange={setVisibleColumns}
                        >
                            {columns.map((column) => (
                                <DropdownItem key={column.uid} className="capitalize">{column.name}</DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                    <Button color="success" endContent={<PlusIcon/>} onPress={onAdd}>追加</Button>
                    {count > 0 && (
                        <Button onPress={handlePrepareDelete} color="danger">
                            {count}件を削除
                        </Button>
                    )}
                </div>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-small">合計{data.length}件</span>
                <label className="flex items-center text-small">
                    表示行数:
                    <select
                        className="bg-transparent outline-solid outline-transparent text-small"
                        onChange={onRowsPerPageChange}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                    </select>
                </label>
            </div>
        </div>
    ), [
        filterValue,
        statusFilter,
        visibleColumns,
        columns,
        searchKey,
        data.length,
        onRowsPerPageChange,
        count,
        onAdd,
        selectedKeys,
    ]);

    const bottomContent = React.useMemo(() => (
        <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small">
          {selectedKeys === "all"
              ? "全ての項目を選択済み"
              : `${filteredItems.length}件中${selectedKeys.size}件選択`}
        </span>
            <Pagination isCompact showControls color="success" page={page} total={pages} onChange={setPage}/>
            <div className="hidden sm:flex w-[30%] justify-end gap-2">
                <Button isDisabled={pages === 1} size="sm" variant="flat"
                        onPress={() => setPage((p) => Math.max(p - 1, 1))}>前へ</Button>
                <Button isDisabled={pages === 1} size="sm" variant="flat"
                        onPress={() => setPage((p) => Math.min(p + 1, pages))}>次へ</Button>
            </div>
        </div>
    ), [page, pages, selectedKeys]);

    return (
        <>
            <Table
                isHeaderSticky
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                selectedKeys={selectedKeys}
                selectionMode="multiple"
                sortDescriptor={sortDescriptor}
                topContent={topContent}
                topContentPlacement="outside"
                onSelectionChange={onSelectionChange}
                onSortChange={setSortDescriptor}
                color="danger"
                onRowAction={onRowAction}
            >
                <TableHeader columns={headerColumns}>
                    {(column) => (
                        <TableColumn key={column.uid} allowsSorting={column.sortable}>
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={sortedItems} emptyContent="データなし">
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
}