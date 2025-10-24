"use client";

import { useState, useEffect } from "react";
import { useQueryState } from "nuqs";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { CalendarDays } from 'lucide-react';
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { usePropertyStore } from "@/store/usePropertyStore";
 
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Search } from 'lucide-react';
import { toast } from "sonner";
 
const FormSchema = z.object({
  time: z.date({
    required_error: "A date and time is required.",
  }),
  endtime: z.date({
    required_error: "An end date and time is required.",
  }),
});
 
export function SearchFormProperty({ propertyId }: { propertyId: string }) {

  const [dateTime, setDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const router = useRouter();

  const setPropertyId = usePropertyStore((state) => state.setPropertyId);
  const setFromDate = usePropertyStore((state) => state.setFromDate);
  const setToDate = usePropertyStore((state) => state.setToDate);
  const fromDate = usePropertyStore((state) => state.fromDate);
  const toDate = usePropertyStore((state) => state.toDate);
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
 
  function onSubmit(data: z.infer<typeof FormSchema>) {

    setPropertyId(propertyId);

    const params = new URLSearchParams();
    if (data.time) params.set("datetime", data.time.toISOString());
    if (data.endtime) params.set("endtime", data.endtime.toISOString());
    router.push('/checkout/checkout');
  }

  useEffect(() => {
    if (dateTime) {
      const parsed = new Date(dateTime);
      if (!isNaN(parsed.getTime())) {
        form.setValue("time", parsed);
        setFromDate(parsed.toISOString());
      }
    }
    if (endDateTime) {
      const parsedEndTime = new Date(endDateTime);
      if (!isNaN(parsedEndTime.getTime())) {
        form.setValue("endtime", parsedEndTime);
        setToDate(parsedEndTime.toISOString());
      }
    }
  }, [dateTime, endDateTime, form, setFromDate, setToDate]);

  // sync zustand -> form: when fromDate changes elsewhere, reflect it in this form
  useEffect(() => {
    if (fromDate) {
      const parsed = new Date(fromDate);
      if (!isNaN(parsed.getTime())) {
        form.setValue("time", parsed);
        setDateTime(parsed.toISOString());
      }
    }
  }, [fromDate, form]);

  useEffect(() => {
    if (toDate) {
      const parsed = new Date(toDate);
      if (!isNaN(parsed.getTime())) {
        form.setValue("endtime", parsed);
        setEndDateTime(parsed.toISOString());
      }
    }
  }, [toDate, form]);
  
  function handleDateSelect(date: Date | undefined) {
    if (date) {
      form.setValue("time", date);
      setDateTime(date.toISOString());
    }
  }

  function handleTimeChange(type: "hour" | "minute", value: string) {
    const currentDate = form.getValues("time") || new Date();
    let newDate = new Date(currentDate);

    if (type === "hour") {
      const hour = parseInt(value, 10);
      newDate.setHours(hour);
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value, 10));
    }

    form.setValue("time", newDate);
    setDateTime(newDate.toISOString());
  }

  function handleEndDateSelect(endtime: Date | undefined) {
    if (endtime) {
      form.setValue("endtime", endtime);
      setEndDateTime(endtime.toISOString());
    }
  }

  function handleEndTimeChange(type: "hour" | "minute", value: string) {
    const currentDate2 = form.getValues("endtime") || new Date();
    const newEndDate = new Date(currentDate2);

    if (type === "hour") {
      const hour = parseInt(value, 10);
      newEndDate.setHours(hour);
    } else if (type === "minute") {
      newEndDate.setMinutes(parseInt(value, 10));
    }

    form.setValue("endtime", newEndDate);
    setEndDateTime(newEndDate.toISOString());
  }
 
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 gap-2">
          <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Booking start</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "MM/dd/yyyy HH:mm")
                      ) : (
                        <span>MM/DD/YYYY HH:mm</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <div className="sm:flex">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={handleDateSelect}
                      initialFocus
                    />
                    <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                      <ScrollArea className="w-64 sm:w-auto">
                        <div className="flex sm:flex-col p-2">
                          {Array.from({ length: 24 }, (_, i) => i)
                            .reverse()
                            .map((hour) => (
                              <Button
                                key={hour}
                                size="icon"
                                variant={
                                  field.value && field.value.getHours() === hour
                                    ? "default"
                                    : "ghost"
                                }
                                className="sm:w-full shrink-0 aspect-square"
                                onClick={() =>
                                  handleTimeChange("hour", hour.toString())
                                }
                              >
                                {hour}
                              </Button>
                            ))}
                        </div>
                        <ScrollBar
                          orientation="horizontal"
                          className="sm:hidden"
                        />
                      </ScrollArea>
                      <ScrollArea className="w-64 sm:w-auto">
                        <div className="flex sm:flex-col p-2">
                          {Array.from({ length: 2 }, (_, i) => i * 30).map(
                            (minute) => (
                              <Button
                                key={minute}
                                size="icon"
                                variant={
                                  field.value &&
                                  field.value.getMinutes() === minute
                                    ? "default"
                                    : "ghost"
                                }
                                className="sm:w-full shrink-0 aspect-square"
                                onClick={() =>
                                  handleTimeChange("minute", minute.toString())
                                }
                              >
                                {minute.toString().padStart(2, "0")}
                              </Button>
                            )
                          )}
                        </div>
                        <ScrollBar
                          orientation="horizontal"
                          className="sm:hidden"
                        />
                      </ScrollArea>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <FormDescription>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endtime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Booking end</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "MM/dd/yyyy HH:mm")
                      ) : (
                        <span>MM/DD/YYYY HH:mm</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <div className="sm:flex">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={handleEndDateSelect}
                      initialFocus
                    />
                    <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                      <ScrollArea className="w-64 sm:w-auto">
                        <div className="flex sm:flex-col p-2">
                          {Array.from({ length: 24 }, (_, i) => i)
                            .reverse()
                            .map((hour) => (
                              <Button
                                key={hour}
                                size="icon"
                                variant={
                                  field.value && field.value.getHours() === hour
                                    ? "default"
                                    : "ghost"
                                }
                                className="sm:w-full shrink-0 aspect-square"
                                onClick={() =>
                                  handleEndTimeChange("hour", hour.toString())
                                }
                              >
                                {hour}
                              </Button>
                            ))}
                        </div>
                        <ScrollBar
                          orientation="horizontal"
                          className="sm:hidden"
                        />
                      </ScrollArea>
                      <ScrollArea className="w-64 sm:w-auto">
                        <div className="flex sm:flex-col p-2">
                          {Array.from({ length: 2 }, (_, i) => i * 30).map(
                            (minute) => (
                              <Button
                                key={minute}
                                size="icon"
                                variant={
                                  field.value &&
                                  field.value.getMinutes() === minute
                                    ? "default"
                                    : "ghost"
                                }
                                className="sm:w-full shrink-0 aspect-square"
                                onClick={() =>
                                  handleEndTimeChange("minute", minute.toString())
                                }
                              >
                                {minute.toString().padStart(2, "0")}
                              </Button>
                            )
                          )}
                        </div>
                        <ScrollBar
                          orientation="horizontal"
                          className="sm:hidden"
                        />
                      </ScrollArea>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <FormDescription>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant="secondary" size="icon" className="size-8" type="submit">
          <CalendarDays
          />
        </Button>
      </form>
    </Form>
  );
}