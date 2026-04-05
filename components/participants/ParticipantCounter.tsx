'use client'

import {Card, CardBody} from "@heroui/card";
import {Progress} from "@heroui/progress";
import {useParticipantCount} from "@/hooks/useParticipants";

interface ParticipantCounterProps {
    raceId: string;
}

export default function ParticipantCounter({ raceId }: ParticipantCounterProps) {
    const { data: race } = useParticipantCount(raceId);

    const progressValue = race?.registrations
        ? (race.participants / race.registrations) * 100
        : 0;

    return (
        <Card className="border-none bg-primary/40 shadow-none">
            <CardBody className="p-4">
                <p className="text-small font-medium text-primary">申込者数</p>
                <h3 className="text-2xl font-bold">{race?.participants} / {race?.registrations} 名</h3>
                <Progress size="sm" value={progressValue} color="primary" className="mt-2" />
            </CardBody>
        </Card>
    )
}