'use client'

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@heroui/input";
import {Button} from "@heroui/button";
import {UserFormValues, userSchema} from "@/schemas/userSchema";
import {useEffect, useRef, useState} from "react";
import {useCreateUser} from "@/hooks/useUsers";
import {Avatar} from "@heroui/avatar";
import {Select, SelectItem} from "@heroui/select";

interface AddUserFormProps {
    id: string;
    roles: { id: string, label: string }[];
    onClose: () => void;
    onLoadingChange:  (loading: boolean) => void;
}

export function AddUserForm({id, roles, onClose, onLoadingChange}: AddUserFormProps) {
    const { mutate, isPending } = useCreateUser();
    const {register, handleSubmit, watch, formState: {errors}, reset} = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
    });
    const [preview, setPreview] = useState<string | null>(null);
    const imageFile = watch("avatar_url");
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { ref: registerRef, ...restRegister } = register("avatar_url");

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
            <div className="flex items-center gap-6 m-4">
                <Avatar
                    src={preview || ""}
                    className="w-24 h-24 text-large"
                    isBordered
                    color="primary"
                    showFallback
                    name="User"
                />

                <div className="flex flex-col gap-3">
                    <p className="text-sm font-semibold text-default-700">
                        プロフィール写真
                    </p>

                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={(e) => {
                            registerRef(e);
                            fileInputRef.current = e;
                        }}
                        {...restRegister}
                    />

                    <Button
                        variant="flat"
                        color="primary"
                        size="sm"
                        onPress={() => fileInputRef.current?.click()}
                        className="font-medium"
                    >
                        ファイルを選択
                    </Button>

                    {errors.avatar_url && (
                        <p className="text-tiny text-danger">
                            {errors.avatar_url.message as string}
                        </p>
                    )}

                    <p className="text-tiny text-default-400">
                        JPG, PNG, WebP (最大5MB)
                    </p>
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
            <Select
                label="ロール"
                labelPlacement="outside"
                {...register("roleId")}
                isInvalid={!!errors.roleId}
                errorMessage={errors.roleId?.message}
                listboxProps={{
                    emptyContent: "データなし"
                }}
            >
                {roles.map((item) => (
                    <SelectItem key={item.id}>{item.label}</SelectItem>
                ))}
            </Select>
        </form>
    )
}