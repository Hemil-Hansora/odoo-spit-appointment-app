import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function CreateServicePage() {
  async function createServiceAction(formData: FormData) {
    "use server";
    console.log("Create service", formData);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create New Service
        </h1>
        <p className="text-muted-foreground">
          Define the details for your new appointment type.
        </p>
      </div>

      <form action={createServiceAction}>
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
            <CardDescription>
              Basic information about the appointment.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Service Name</Label>
              <Input id="name" name="name" placeholder="e.g. Initial Consultation" required />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" placeholder="Describe what this service is about..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Select name="duration" defaultValue="30">
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 min</SelectItem>
                    <SelectItem value="30">30 min</SelectItem>
                    <SelectItem value="45">45 min</SelectItem>
                    <SelectItem value="60">60 min</SelectItem>
                    <SelectItem value="90">90 min</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input id="price" name="price" type="number" placeholder="0" min="0" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6 border-border shadow-sm">
          <CardHeader>
            <CardTitle>Availability & Rules</CardTitle>
            <CardDescription>
              Set when this service can be booked.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="grid gap-2">
                <Label>Weekly Schedule</Label>
                <div className="text-sm text-muted-foreground border border-border p-4 rounded-md bg-muted">
                    <p>Mon - Fri: 9:00 AM - 5:00 PM</p>
                    <p className="mt-1 text-xs text-muted-foreground/70">(Default schedule applied. Edit in settings.)</p>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="capacity">Max Capacity</Label>
                    <Input id="capacity" name="capacity" type="number" defaultValue="1" min="1" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="buffer">Buffer Time (minutes)</Label>
                    <Select name="buffer" defaultValue="0">
                        <SelectTrigger>
                            <SelectValue placeholder="Select buffer" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">None</SelectItem>
                            <SelectItem value="5">5 min</SelectItem>
                            <SelectItem value="10">10 min</SelectItem>
                            <SelectItem value="15">15 min</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
             </div>
          </CardContent>
          <CardFooter className="flex justify-between bg-muted/50 border-t border-border p-6">
            <Button variant="outline" asChild className="border-border text-foreground">
                <Link href="/organiser">Cancel</Link>
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Create Service
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
