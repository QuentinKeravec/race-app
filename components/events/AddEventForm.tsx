'use client'

import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@heroui/input";
import {EventFormValues, eventSchema} from "@/schemas/eventSchema";
import {useEffect} from "react";
import {toRomaji} from "wanakana";
import {createEventAction} from "@/app/events/actions";
import {addToast} from "@heroui/toast";

interface AddEventFormProps {
    id: string;
    onClose: () => void;
    onLoadingChange:  (loading: boolean) => void;
}

export function AddEventForm({id, onClose, onLoadingChange}: AddEventFormProps) {
    const {register, handleSubmit, setValue, formState: {errors}, reset, watch, control} = useForm<EventFormValues>({
        resolver: zodResolver(eventSchema),
    });
    const eventName = watch("name");

    useEffect(() => {
        if (eventName) {
            const generatedSlug = toRomaji(eventName)
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '')
                .replace(/-+/g, '-');
            setValue("slug", generatedSlug, { shouldValidate: true });
        }
    }, [eventName, setValue]);

    const onSubmit = async (data: EventFormValues) => {
        onLoadingChange(true);

        try {
            const result = await createEventAction(data);

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
                name="name"
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
        </form>
    )
}