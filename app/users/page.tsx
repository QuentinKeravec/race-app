import {title} from "@/components/primitives";
import {Divider} from "@heroui/divider";
import {Metadata} from "next";
import UserList from "@/components/users/UserList";
import React from "react";
import {getUsers} from "@/utils/users/queries";
import {getRoles} from "@/utils/roles/queries";

export const metadata: Metadata = {
    title: "ユーザー一覧",
    description: "全てのユーザー管理画面",
};

export default async function UsersPage() {
    const [userRes, roleRes] = await Promise.all([
        getUsers(),
        getRoles()
    ]);

    const roleOptions= roleRes.map(role => ({
        name: role.label,
        uid: role.id.toString(),
    }));

    return (
        <section className="flex flex-col gap-6">
            <div className="flex flex-col items-start px-2">
                <h1 className={title({size: "sm"})}>
                    ユーザー一覧
                </h1>
            </div>
            <Divider/>

            <UserList
                initialUsers={userRes}
                roles={roleRes}
                roleOptions={roleOptions}
            />
        </section>
    );
}