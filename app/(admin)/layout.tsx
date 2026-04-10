import {createClient} from "@/utils/supabase/server";
import {CustomSidebar} from "@/components/ui/CustomSidebar";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/");
    }

    return (
        <CustomSidebar user={user}>
            {children}
        </CustomSidebar>
    );
}