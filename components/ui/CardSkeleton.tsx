import {Skeleton} from "@heroui/skeleton";
import {Card, CardBody} from "@heroui/card";

export const CardSkeleton = ({ bgColor } : { bgColor: "primary" | "warning" }) => {
    const bgClasses = {
        primary: "bg-primary/20",
        warning: "bg-warning/20",
    };

    return (
        <Card className={`border-none ${bgClasses[bgColor]} shadow-none`}>
            <CardBody className="p-4">
                <Skeleton className="w-20 h-3 rounded-lg mb-2" />
                <div className="flex items-baseline gap-2">
                    <Skeleton className="w-24 h-8 rounded-lg" />
                    <Skeleton className="w-12 h-5 rounded-lg" />
                </div>
                <div className="mt-3">
                    <Skeleton className="w-full h-3 rounded-full" />
                </div>
            </CardBody>
        </Card>
    );
};