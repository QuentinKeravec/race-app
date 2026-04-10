'use client'

import { QRCodeSVG } from "qrcode.react";

export function QRCodeDisplay({ value }: { value: string }) {
    return (
        <QRCodeSVG
            value={value}
            size={200}
            level={"H"}
            imageSettings={{
                src: "/logo-race.png",
                x: undefined,
                y: undefined,
                height: 40,
                width: 40,
                excavate: true,
            }}
        />
    );
}