'use client'

import {VolunteerFormValues, volunteerSchema} from "@/schemas/userSchema";
import {zodResolver} from "@hookform/resolvers/zod";
import {Controller, useForm} from "react-hook-form";
import {useCreateVolunteers, useVolunteers} from "@/hooks/useUsers";
import {Select, SelectItem} from "@heroui/select";
import {Chip} from "@heroui/chip";
import {Avatar} from "@heroui/avatar";
import {useEffect} from "react";

interface AddVolunteerFormProps {
    raceId: string;
    id: string;
    onClose: () => void;
    onLoadingChange: (loading: boolean) => void;
}

export function AddVolunteerForm({ raceId, id, onClose, onLoadingChange }: AddVolunteerFormProps) {
    const { handleSubmit, control } = useForm<VolunteerFormValues>({
        resolver: zodResolver(volunteerSchema),
    });

    const { data: volunteers } = useVolunteers(raceId);
    const { mutate: createVolunteers, isPending } = useCreateVolunteers();

    useEffect(() => {
        onLoadingChange(isPending);
    }, [isPending, onLoadingChange]);

    const onSubmit = (values: VolunteerFormValues) => {
        createVolunteers({
            raceId: raceId,
            volunteerIds: values.volunteerId
        }, {
            onSuccess: (result) => {
                if (!result?.error) {
                    onClose();
                }
            }
        });
    }

    return (
        <form id={id} onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
            <Controller
                name="volunteerId"
                control={control}
                render={({ field, fieldState }) => (
                    <Select
                        label="ボランティア"
                        labelPlacement="outside"
                        placeholder="ボランティアを選択してください"
                        selectionMode="multiple"
                        isMultiline={true}
                        items={volunteers || []}

                        selectedKeys={field.value instanceof Set ? field.value : new Set(field.value)}
                        onSelectionChange={(keys) => field.onChange(keys)}
                        onBlur={field.onBlur}

                        isInvalid={!!fieldState.error}
                        errorMessage={fieldState.error?.message}

                        listboxProps={{
                            emptyContent: "データなし"
                        }}
                        renderValue={(items) => (
                            <div className="flex flex-wrap gap-2">
                                {items.map((item) => (
                                    <Chip key={item.key} size="sm" variant="flat">
                                        {item.data?.fullName}
                                    </Chip>
                                ))}
                            </div>
                        )}
                    >
                        {(volunteer) => (
                            <SelectItem key={volunteer.id} textValue={volunteer.fullName}>
                                <div className="flex gap-2 items-center">
                                    <Avatar
                                        alt={volunteer.fullName}
                                        className="shrink-0"
                                        size="sm"
                                        src={volunteer.avatarUrl || ""}
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-small">{volunteer.fullName}</span>
                                        <span className="text-tiny text-default-400">{volunteer.email}</span>
                                    </div>
                                </div>
                            </SelectItem>
                        )}
                    </Select>
                )}
            />
        </form>
    );
}