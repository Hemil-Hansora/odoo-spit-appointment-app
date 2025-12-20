import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CalendarPage() {
  // Mock calendar grid for a week view
  const hours = Array.from({ length: 11 }, (_, i) => i + 8); // 8 AM to 6 PM
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Calendar
        </h1>
        <div className="flex gap-2">
          <Button variant="outline">Previous Week</Button>
          <Button variant="outline">Next Week</Button>
        </div>
      </div>

      <Card className="border-border shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border bg-muted/50">
          <div className="grid grid-cols-6 text-center font-medium text-muted-foreground">
            <div className="py-2">Time</div>
            {days.map((day) => (
              <div key={day} className="py-2 border-l border-border">
                {day}
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-6 divide-x divide-border">
            {/* Time Column */}
            <div className="bg-muted/30">
              {hours.map((hour) => (
                <div key={hour} className="h-20 border-b border-border flex items-center justify-center text-sm text-muted-foreground">
                  {hour}:00
                </div>
              ))}
            </div>

            {/* Days Columns */}
            {days.map((day, dayIndex) => (
              <div key={day} className="relative">
                {hours.map((hour) => (
                  <div key={hour} className="h-20 border-b border-border relative group hover:bg-muted transition-colors">
                    {/* Mock Appointment */}
                    {day === "Mon" && hour === 10 && (
                      <div className="absolute inset-1 bg-primary text-primary-foreground text-xs p-2 rounded shadow-sm z-10 overflow-hidden">
                        <div className="font-semibold">Consultation</div>
                        <div className="opacity-75">Alice Johnson</div>
                      </div>
                    )}
                    {day === "Wed" && hour === 14 && (
                      <div className="absolute inset-1 bg-secondary border border-border text-foreground text-xs p-2 rounded shadow-sm z-10 overflow-hidden">
                        <div className="font-semibold">Strategy</div>
                        <div className="opacity-75">Bob Smith</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
