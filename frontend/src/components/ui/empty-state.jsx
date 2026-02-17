import { FileQuestion } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({ 
  title = "No data available", 
  description = "There are no records to display at the moment.", 
  icon: Icon = FileQuestion,
  className 
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center animate-in fade-in duration-500", className)}>
      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
        <Icon className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-1">{description}</p>
    </div>
  );
}