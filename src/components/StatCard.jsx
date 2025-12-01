import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils"; // optional helper if using shadcn

export function StatCard({ title, value, icon: Icon, trend }) {
  const trendColor = trend?.isPositive ? "text-green-600" : "text-red-600";

  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-2xl border border-transparent bg-gradient-to-br from-white/80 to-gray-100/60 dark:from-neutral-800 dark:to-neutral-900 shadow-md backdrop-blur-lg transition-all duration-300 hover:scale-[1.04] hover:shadow-xl hover:border-primary/30"
      )}
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

      <CardContent className="relative z-10 flex items-center justify-between p-5">
        {/* Left Side — Text */}
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {title}
          </p>
          <h2 className="text-3xl font-bold mt-1 text-gray-900 dark:text-gray-100 tracking-tight">
            {value}
          </h2>

          {trend && (
            <p
              className={cn(
                "text-xs mt-1 font-semibold flex items-center gap-1",
                trendColor
              )}
            >
              {trend.isPositive ? "▲" : "▼"} {trend.value}
            </p>
          )}
        </div>

        {/* Right Side — Icon */}
        <div className="group relative">
          <div className="p-4 rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:scale-110">
            <Icon className="w-6 h-6 transition-transform duration-300 group-hover:rotate-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
