import { Resend } from 'resend';
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { email, fullName, participantId, runnetId, event, race } = await request.json();

        const subject = `【重要】大会参加証（QRコード）のご案内 - ${fullName} 様`;

        const html = `
          <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-size: 600px; margin: auto; color: #333; line-height: 1.6;">
            <h2 style="color: #0070f3; border-bottom: 2px solid #0070f3; padding-bottom: 10px;">
              大会参加証の発行について
            </h2>

            <p>${fullName} 様</p>

            <p>この度は、本大会にお申込みいただき誠にありがとうございます。<br>
            大会当日の受付で使用する「参加証（QRコード）」の準備が整いましたので、ご案内申し上げます。</p>

            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #ddd;">
              <p style="margin-top: 0;"><strong>■ 当日の受付方法</strong></p>
              <p style="font-size: 14px;">以下のボタンをクリックしてQRコードを表示し、受付スタッフにご提示ください。</p>

              <div style="text-align: center; margin: 25px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/pass/${race}/${participantId}" 
                   style="background-color: #0070f3; color: white; padding: 15px 30px; border-radius: 5px; text-decoration: none; font-weight: bold; display: inline-block;">
                  参加証（QRコード）を表示する
                </a>
              </div>

              <p style="font-size: 12px; color: #666; margin-bottom: 0;">
                ※会場の電波状況により表示に時間がかかる場合があります。<br>
                事前にこのページを<strong>スクリーンショット（画面保存）</strong>しておくことを強くお勧めいたします。
              </p>
            </div>

            <p><strong>■ 大会詳細</strong></p>
            <ul style="font-size: 14px; list-style: none; padding-left: 0;">
              <li>・お名前：${fullName} 様</li>
              <li>・RUNNET ID：${runnetId}</li>
            </ul>

            <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />

            <p style="font-size: 12px; color: #999;">
              ※本メールは送信専用です。心当たりのない場合は破棄してください。<br>
              大会事務局：[${event} / ${race}]
            </p>
         </div>`;

        const { error } = await resend.emails.send({
            from: 'Course <onboarding@resend.dev>',
            to: [email],
            subject: subject,
            html: html
        });

        if (error) return NextResponse.json({ error }, { status: 400 });

        return NextResponse.json({ message: "メールを送信しました！" });
    } catch(error: any) {
        return NextResponse.json({ error: "エラー" }, { status: 500 });
    }
}