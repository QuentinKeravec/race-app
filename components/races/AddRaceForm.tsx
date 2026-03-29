'use client'

import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Select, SelectItem} from "@heroui/select";
import {Input} from "@heroui/input";
import {Event} from "@/types/event"
import {Statuses} from "@/types/statuses";
import {RaceFormValues, raceSchema} from "@/schemas/raceSchema";
import {useEffect} from "react";
import {toRomaji} from "wanakana";
import {DatePicker} from "@heroui/date-picker";
import {parseAbsoluteToLocal} from "@internationalized/date";
import {createRaceAction} from "@/app/races/actions";
import {addToast} from "@heroui/toast";

interface AddRaceFormProps {
    id: string;
    events: Event[];
    status: Statuses[];
    onClose: () => void;
    onLoadingChange:  (loading: boolean) => void;
}

export function AddRaceForm({id, events, status, onClose, onLoadingChange}: AddRaceFormProps) {
    const {register, handleSubmit, setValue, formState: {errors}, reset, watch, control} = useForm<RaceFormValues>({
        resolver: zodResolver(raceSchema),
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

    const onSubmit = async (data: RaceFormValues) => {
        onLoadingChange(true);

        try {
            const result = await createRaceAction(data);

            if (result?.error) {
                throw new Error(result.error);
            }

            addToast({
                title: "作成完了",
                description: `${data.name} を作成しました。`,
                color: "success",
            });
            onClose();
            setTimeout(() => reset(), 300);

        } catch (err) {
            addToast({
                title: "エラー",
                description: err instanceof Error ? err.message : "予期せぬエラーが発生しました",
                color: "danger",
            });
        } finally {
            onLoadingChange(false);
        }
    };

    return (
        <form id={id} onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
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
                        value={value?.toString() || ""}
                        type="number"
                        label="距離 (m)"
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
                {events.map((event) => (
                    <SelectItem key={event.id}>{event.name}</SelectItem>
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
        </form>
    )
}