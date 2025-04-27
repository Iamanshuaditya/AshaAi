import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RiExternalLinkLine, RiMapPinLine, RiBuildingLine } from "@remixicon/react";

// Match the JobListing interface defined in the API route
interface JobListing {
    id: string;
    title: string;
    company: string | null;
    location: string | null;
    description: string | null;
    url: string;
}

interface JobCardProps {
    job: JobListing;
}

export function JobCard({ job }: JobCardProps) {
    return (
        <Card className="mb-3 shadow-sm border border-border/50 bg-white hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-primary">
                    {job.title}
                </CardTitle>
                {job.company && (
                    <CardDescription className="flex items-center text-sm text-muted-foreground pt-1">
                        <RiBuildingLine className="mr-1.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
                        {job.company}
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent className="pb-3">
                {job.location && (
                    <div className="flex items-center text-xs text-muted-foreground mb-2">
                        <RiMapPinLine className="mr-1.5 h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                        {job.location}
                    </div>
                )}
                {job.description && (
                    <p className="text-sm text-foreground/90 leading-relaxed line-clamp-3">
                        {job.description}
                    </p>
                )}
            </CardContent>
            <CardFooter className="flex justify-between items-center pt-2 pb-3 px-6">

                <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/90 hover:bg-primary/10">
                    <a href={job.url} target="_blank" rel="noopener noreferrer">
                        View Job
                        <RiExternalLinkLine className="ml-1.5 h-4 w-4" aria-hidden="true" />
                    </a>
                </Button>
            </CardFooter>
        </Card>
    );
} 