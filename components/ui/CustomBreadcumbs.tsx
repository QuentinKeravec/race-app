'use client'

import { Breadcrumbs, BreadcrumbItem } from "@heroui/breadcrumbs";

interface CustomBreadcrumbsProps {
    link?: string;
    parentLabel?: string;
    childrenLabel?: string;
}

export const CustomBreadcrumbs = ({ link, parentLabel, childrenLabel }: CustomBreadcrumbsProps) => {
    return (
        <Breadcrumbs underline="hover" className="mb-6">
            {parentLabel && <BreadcrumbItem href={link}>{parentLabel}</BreadcrumbItem>}
            {childrenLabel && <BreadcrumbItem>{childrenLabel}</BreadcrumbItem>}
        </Breadcrumbs>
    );
};