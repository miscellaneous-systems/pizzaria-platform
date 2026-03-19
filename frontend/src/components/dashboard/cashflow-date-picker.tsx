"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CashflowDatePickerProps {
    initialDate?: string;
}

export function CashflowDatePicker({ initialDate }: CashflowDatePickerProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = e.target.value;
        setSelectedDate(date);
        const params = new URLSearchParams(searchParams.toString());

        if (date) {
            params.set("date", date);
        } else {
            params.delete("date");
        }

        router.push(`/dashboard/cashflow?${params.toString()}`);
    };

    const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];
    
    const [selectedDate, setSelectedDate] = useState(initialDate || today);

    useEffect(() => {
        setSelectedDate(initialDate || today);
    }, [initialDate]);

    return (
        <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="px-3 py-2 bg-gray-800 border border-app-border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
            {initialDate && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        setSelectedDate(today);
                        router.push("/dashboard/cashflow");
                    }}
                    className="text-white hover:text-white"
                >
                    Hoje
                </Button>
            )}
        </div>
    );
}