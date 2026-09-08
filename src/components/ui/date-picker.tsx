import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface DatePickerProps {
  value?: string
  onChange?: (date: string | undefined) => void
  placeholder?: string
  disabled?: boolean
  required?: boolean
  className?: string
  minDate?: Date
  maxDate?: Date
  hideIcon?: boolean
}

export function DatePicker({
  value,
  onChange,
  placeholder = "DD-MM-YYYY",
  disabled,
  required,
  className,
  minDate,
  maxDate,
  hideIcon = false
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  )
  const [open, setOpen] = React.useState(false)

  // Sync internal state with external value prop
  React.useEffect(() => {
    if (value) {
      const parsedDate = new Date(value);
      if (!isNaN(parsedDate.getTime())) {
        setDate(parsedDate);
      }
    } else {
      setDate(undefined);
    }
  }, [value]);

  const dateValue = value ? new Date(value) : date;

  // Construct disabled prop
  let disabledProp: any = disabled;
  if (!disabled && (minDate || maxDate)) {
    disabledProp = {};
    if (minDate) disabledProp.before = minDate;
    if (maxDate) disabledProp.after = maxDate;
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left bg-white min-h-10 px-3 py-2 rounded-md border border-slate-200 hover:!bg-slate-50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all text-sm text-slate-900 disabled:bg-slate-50 disabled:text-slate-500 capitalize font-normal",
            !dateValue ? "text-slate-400 hover:!text-slate-400" : "hover:!text-slate-900",
            className
          )}
        >
          {!hideIcon && <CalendarIcon className="mr-2 h-4 w-4" />}
          {dateValue && !isNaN(dateValue.getTime()) ? format(dateValue, "dd-MM-yyyy") : <span>{placeholder || "DD-MM-YYYY"}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-[9999]" align="start">
        <Calendar
          mode="single"
          selected={dateValue}
          onSelect={(date) => {
            if (date) {
              const year = date.getFullYear()
              const month = String(date.getMonth() + 1).padStart(2, "0")
              const day = String(date.getDate()).padStart(2, "0")
              onChange?.(`${year}-${month}-${day}`)
            } else {
              onChange?.(undefined)
            }
            setOpen(false)
          }}
          disabled={disabledProp}
          captionLayout="dropdown"
          startMonth={new Date(1950, 0)}
          endMonth={new Date(2050, 11)}
        />
      </PopoverContent>
    </Popover>
  )
}
