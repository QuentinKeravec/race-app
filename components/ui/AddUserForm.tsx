'use client'

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@heroui/input";
import {UserFormValues, userSchema} from "@/schemas/userSchema";
import {useState, useEffect} from "react";
import {useCreateUser} from "@/hooks/useUsers";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";


interface AddUserFormProps {
    id: string;
    onClose: () => void;
    onLoadingChange:  (loading: boolean) => void;
}

export function AddUserForm({id, onClose, onLoadingChange}: AddUserFormProps) {
    const { mutate, isPending } = useCreateUser();
    const {register, handleSubmit, watch, formState: {errors}, reset} = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
    });
    const [preview, setPreview] = useState<string | null>(null);
    const imageFile = watch("avatar_url");

    useEffect(() => {
        if (imageFile && imageFile.length > 0) {
            const file = imageFile[0];
            const url = URL.createObjectURL(file);
            setPreview(url);

            return () => URL.revokeObjectURL(url);
        }
    }, [imageFile]);

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
            <div className="flex items-center gap-4 m-4">
                <Avatar
                    src={preview || ""}
                    className="w-20 h-20 text-large"
                    isBordered
                    color="success"
                    showFallback
                    name="User"
                />
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium">プロフィール写真</p>
                    <input
                        type="file"
                        accept="image/*"
                        {...register("avatar_url")}
                        className="text-xs file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-success-50 file:text-success-700"
                    />
                </div>
            </div>
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