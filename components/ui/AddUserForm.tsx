'use client'

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@heroui/input";
import {UserFormValues, userSchema} from "@/schemas/userSchema";
import {useEffect} from "react";
import {useCreateUser} from "@/hooks/useUsers";

interface AddUserFormProps {
    id: string;
    onClose: () => void;
    onLoadingChange:  (loading: boolean) => void;
}

export function AddUserForm({id, onClose, onLoadingChange}: AddUserFormProps) {
    const { mutate, isPending } = useCreateUser();
    const {register, handleSubmit, formState: {errors}, reset} = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
    });

    useEffect(() => {
        onLoadingChange?.(isPending);
    }, [isPending, onLoadingChange]);

    const onSubmit = async (data: UserFormValues) => {
        mutate(data, {
            onSuccess: () => {
                onClose();
                setTimeout(() => reset(), 300);
            }
        });
    };

    return (
        <form id={id} onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
            <Input
                {...register("fullName")}
                isInvalid={!!errors.fullName}
                errorMessage={errors.fullName?.message}
                label="氏名"
                labelPlacement="outside"
                name="fullName"
                type="text"
            />

            <Input
                {...register("email")}
                isInvalid={!!errors.email}
                errorMessage={errors.email?.message}
                label="メール"
                labelPlacement="outside"
                name="email"
                type="text"
            />

            <Input
                {...register("password")}
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message}
                label="パスワード"
                labelPlacement="outside"
                name="password"
                type="password"
            />
        </form>
    )
}