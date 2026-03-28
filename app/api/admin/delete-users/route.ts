import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const { userIds, imagePaths } = await req.json()

        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        if (imagePaths && imagePaths.length > 0) {
            await supabaseAdmin.storage.from('avatars').remove(imagePaths)
        }

        const deletePromises = userIds.map((id: string) =>
            supabaseAdmin.auth.admin.deleteUser(id)
        )

        await Promise.all(deletePromises)

        return NextResponse.json({ message: "ユーザーを削除しました。" }, { status: 200 })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}