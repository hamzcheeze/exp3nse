"use client";

import { useState, useEffect } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
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
        <Table aria-label="Expense Table">
            <TableHeader>
                <TableColumn>Date</TableColumn>
                <TableColumn>Name</TableColumn>
                <TableColumn>Amount</TableColumn>
                <TableColumn>Channel</TableColumn>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                    renderSkeleton()
                ) : (
                    expenses.map((item) => (
                        <TableRow key={item._id.toString()}>
                            <TableCell>{item.date}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.amount}</TableCell>
                            <TableCell>{item.channel}</TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}

