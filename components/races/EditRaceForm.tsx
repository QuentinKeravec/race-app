'use client'

import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Select, SelectItem} from "@heroui/select";
import {Input} from "@heroui/input";
import {Event} from "@/types/event"
import {Statuses} from "@/types/statuses";
import {RaceFormValues, raceSchema} from "@/schemas/raceSchema";
import React, {useEffect} from "react";
import {toRomaji} from "wanakana";
import {DatePicker} from "@heroui/date-picker";
import {parseAbsoluteToLocal} from "@internationalized/date";
import {useUpdateRace} from "@/hooks/useRaces";
import {Button} from "@heroui/button";
import {TransformedRace} from "@/types/race";

interface EditRaceFormProps {
    race: TransformedRace;
    events: Event[];
    status: Statuses[];
}

export function EditRaceForm({race, events, status}: EditRaceFormProps) {
    const {register, handleSubmit, setValue, formState: {errors}, watch, control} = useForm<RaceFormValues>({
        resolver: zodResolver(raceSchema),
        defaultValues: race,
    });
    const raceName = watch("name");

    useEffect(() => {
        if (raceName) {
            const generatedSlug = toRomaji(raceName)
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '')
                .replace(/-+/g, '-');
            setValue("slug", generatedSlug, { shouldValidate: true });
        }
    }, [raceName, setValue]);

    const { mutate: updateRace, isPending } = useUpdateRace();

    const onSubmit = (data: RaceFormValues) => {
        updateRace(
            {
                raceId: race.id,
                data: data
            }
        )
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4 py-5 px-20">
            <Input
                {...register("name")}
                isInvalid={!!errors.name}
                errorMessage={errors.name?.message}
                label="名前"
                labelPlacement="outside"
                type="text"
            />
            <Controller
                name="slug"
                control={control}
                render={({ field }) => (
                    <Input
                        {...field}
                        label="カスタムURL"
                        isInvalid={!!errors.slug}
                        errorMessage={errors.slug?.message}
                        labelPlacement="outside"
                    />
                )}
            />
            <Controller
                name="startTime"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                    <DatePicker
                        {...field}
                        value={value ? parseAbsoluteToLocal(value) : null}
                        onChange={(date) => {
                            onChange(date ? date.toDate().toISOString() : null);
                        }}
                        granularity="minute"
                        label="開始時間"
                        isInvalid={!!errors.startTime}
                        errorMessage={errors.startTime?.message}
                        hideTimeZone
                        showMonthAndYearPickers
                    />
                )}
            />
            <Controller
                name="distanceMeters"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                    <Input
                        {...field}
                        value={value.toString() || ""}
                        type="number"
                        label="距離 (km)"
                        isInvalid={!!errors.distanceMeters}
                        errorMessage={errors.distanceMeters?.message}
                        labelPlacement="outside"
                        onChange={(e) => {
                            const val = e.target.value;
                            onChange(val === "" ? 0 : Number(val));
                        }}
                    />
                )}
            />
            <Select
                label="イベント"
                labelPlacement="outside"
                {...register("eventId")}
                isInvalid={!!errors.eventId}
                errorMessage={errors.eventId?.message}
                listboxProps={{
                    emptyContent: "データなし"
                }}
            >
                {events.map((item) => (
                    <SelectItem key={item.id}>{item.name}</SelectItem>
                ))}
            </Select>
            <Select
                label="ステータス"
                labelPlacement="outside"
                {...register("statusId")}
                isInvalid={!!errors.statusId}
                errorMessage={errors.statusId?.message}
                listboxProps={{
                    emptyContent: "データなし"
                }}
            >
                {status.map((item) => (
                    <SelectItem key={item.id}>{item.label}</SelectItem>
                ))}
            </Select>
            <Button
                color="primary"
                type="submit"
                isLoading={isPending}
                variant="shadow"
            >
                確定
            </Button>
        </form>
    )
}