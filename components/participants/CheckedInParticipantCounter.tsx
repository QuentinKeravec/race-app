'use client'

import {Card, CardBody} from "@heroui/card";
import {Progress} from "@heroui/progress";
import {useCheckedInParticipantCount} from "@/hooks/useParticipants";
import {CardSkeleton} from "@/components/ui/CardSkeleton";

interface CheckInParticipantCounterProps {
    raceId: string;
}

export default function CheckInParticipantCounter({ raceId }: CheckInParticipantCounterProps) {
    const { data: race, isLoading } = useCheckedInParticipantCount(raceId);

    if (isLoading || !race) {
        return <CardSkeleton bgColor="secondary"/>;
    }

    const progressValue = race?.registrations
        ? (race.participants / race.registrations) * 100
        : 0;

    return (
        <Card className="border-none bg-secondary/40 shadow-none">
            <CardBody className="p-4">
                <p className="text-small font-medium text-secondary">チェックイン状況</p>
                <h3 className="text-2xl font-bold">{race?.participants} / {race?.registrations} 名</h3>
                <Progress size="md" value={progressValue} color="secondary" className="mt-2" />
            </CardBody>
        </Card>
    )
}