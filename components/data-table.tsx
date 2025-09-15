"use client";

import {
    useState,
    useEffect,
    useMemo
} from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Pagination,
    getKeyValue,
    Skeleton,
} from "@heroui/react";
import { ObjectId } from "mongodb";

interface Expense {
    _id: ObjectId;
    date: string;
    name: string;
    type: string;
    amount: number;
    channel: string;
}

const columns = [
    { key: "_id", label: "ID" },
    { key: "date", label: "Date" },
    { key: "name", label: "Name" },
    { key: "type", label: "Type" },
    { key: "amount", label: "Amount" },
    { key: "channel", label: "Channel" },
];

const renderSkeleton = () => (
    <>
        {Array(20).fill(0).map((_, index) => (
            <TableRow key={`skeleton-${index}`}>
                {Array(4).fill(0).map((_, cellIndex) => (
                    <TableCell key={`cell-${index}-${cellIndex}`}>
                        <Skeleton className="w-full h-8 rounded-lg" />
                    </TableCell>
                ))}
            </TableRow>
        ))}
    </>
);

const getExpensesData = async (): Promise<Expense[]> => {
    const response = await fetch('/api/expense/')
    console.log(response)
    if (!response.ok) {
        throw new Error('Failed to fetch details')
    }
    return response.json()
}

export default function TableData() {
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const rowsPerPage = 20;
    const pages = Math.ceil(expenses.length / rowsPerPage);
    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return expenses.slice(start, end);
    }, [page, expenses]);

    useEffect(() => {
        const loadExpenses = async () => {
            setIsLoading(true);
            try {
                const data = await getExpensesData()
                setExpenses(data)
            } catch (error) {
                console.error('Error loading details:', error)
            } finally {
                setIsLoading(false);
            }
        }
        loadExpenses()
    }, [])

    return (
        <Table
            aria-label="Expense Table"
            bottomContent={
                <div className="flex w-full justify-center">
                    <Pagination
                        isCompact
                        showControls
                        showShadow
                        color="primary"
                        page={page}
                        total={pages}
                        onChange={(page) => setPage(page)}
                    />
                </div>
            }
            classNames={{
                wrapper: "min-h-[222px]",
            }}
        >
            <TableHeader>
                <TableColumn>Date</TableColumn>
                <TableColumn>Name</TableColumn>
                <TableColumn>Amount</TableColumn>
                <TableColumn>Channel</TableColumn>
            </TableHeader>
            <TableBody items={items}>
                {isLoading ? (
                    renderSkeleton()
                ) : ((item => (
                    <TableRow key={item._id.toString()}>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.amount}</TableCell>
                        <TableCell>{item.channel}</TableCell>
                    </TableRow>
                )))}
            </TableBody>
        </Table>
    );
}

