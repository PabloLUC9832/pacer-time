"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ChevronDownIcon } from "lucide-react"

type DateTimePickerProps = {
  value?: Date
  onChange?: (date: Date | undefined) => void
  label?: string
}

export function DateTimePicker({ value, onChange, label }: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false)

  const handleDateSelect = (selected: Date | undefined) => {
    if (!selected) {
      onChange?.(undefined)
      setOpen(false)
      return
    }
    // Preservar la hora actual si ya había un valor
    const next = new Date(selected)
    if (value) {
      next.setHours(value.getHours(), value.getMinutes(), value.getSeconds())
    }
    onChange?.(next)
    setOpen(false)
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes, seconds] = e.target.value.split(":").map(Number)
    const next = value ? new Date(value) : new Date()
    next.setHours(hours ?? 0, minutes ?? 0, seconds ?? 0)
    onChange?.(next)
  }

  const timeValue = value
    ? `${String(value.getHours()).padStart(2, "0")}:${String(value.getMinutes()).padStart(2, "0")}:${String(value.getSeconds()).padStart(2, "0")}`
    : "00:00:00"

  return (
    <FieldGroup className="flex-row">
      <Field>
        {label && <FieldLabel>{label}</FieldLabel>}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-44 justify-between font-normal">
              {value ? format(value, "PPP", { locale: es }) : "Seleccionar fecha"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              locale={es}
              timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}
              mode="single"
              selected={value}
              captionLayout="dropdown"
              defaultMonth={value}
              onSelect={handleDateSelect}
            />
          </PopoverContent>
        </Popover>
      </Field>
      <Field className="w-32">
        <FieldLabel>Hora</FieldLabel>
        <Input
          type="time"
          step="1"
          value={timeValue}
          onChange={handleTimeChange}
          className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden"
        />
      </Field>
    </FieldGroup>
  )
}