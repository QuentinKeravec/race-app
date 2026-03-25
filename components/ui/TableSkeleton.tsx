import {Skeleton} from "@heroui/skeleton";
import {Card} from "@heroui/card";

export const TableSkeleton = () => {
    return (
        <div className="flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <Skeleton className="w-1/2 h-10 rounded-lg" />

                <div className="flex gap-2">
                    <Skeleton className="w-30 h-10 rounded-lg" />
                    <Skeleton className="w-30 h-10 rounded-lg" />
                    <Skeleton className="w-30 h-10 rounded-lg" />
                </div>
            </div>
            <Card className="p-4 space-y-3" radius="lg">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center w-full space-x-4 py-2">
                        <Skeleton className="flex-1 h-6 rounded-md" />
                        <Skeleton className="flex-1 h-6 rounded-md" />
                        <Skeleton className="w-20 h-6 rounded-md" />
                    </div>
                ))}
            </Card>
        </div>
    );
};