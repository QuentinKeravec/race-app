'use client'

import {Card, CardBody} from "@heroui/card";
import {Progress} from "@heroui/progress";
import {useVolunteerCount} from "@/hooks/useUsers";
import {CardSkeleton} from "@/components/ui/CardSkeleton";

interface VolunteerCounterProps {
    raceId: string;
}

export default function VolunteerCounter({ raceId }: VolunteerCounterProps) {
    const { data: race, isLoading } = useVolunteerCount(raceId);

    if (isLoading || !race) {
        return <CardSkeleton bgColor="warning" />;
    }

    const progressValue = race?.volunteers
        ? (race.raceVolunteers / race.volunteers) * 100
        : 0;

    return (
        <Card className="border-none bg-warning/40 shadow-none">
            <CardBody className="p-4">
                <p className="text-small font-medium text-warning">ボランティア人数</p>
                <h3 className="text-2xl font-bold">{race?.raceVolunteers} / {race?.volunteers} 名</h3>
                <Progress size="md" value={progressValue} color="warning" className="mt-2" />
            </CardBody>
        </Card>
    )
}