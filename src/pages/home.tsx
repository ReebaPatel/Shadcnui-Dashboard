"use client";

import { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Combobox } from "@/components/ui/combobox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar"; // Correct import for Calendar
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Chart Data
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

// Chart Configuration
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

// Navigation Links
const navLinks = [
  { href: "#home", label: "Overview" },
  { href: "#about", label: "Customers" },
  { href: "#services", label: "Products" },
  { href: "#contact", label: "Settings" },
];

// Combobox Options
const comboboxOptions = [
  { value: "january", label: "January" },
  { value: "february", label: "February" },
  { value: "march", label: "March" },
  { value: "april", label: "April" },
];

export function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  });

  return (
    <div className={className}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
              "truncate"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(date.from, "PPP") + " - " + format(date.to, "PPP")
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="range"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default function Home() {
  const [selectedOption, setSelectedOption] = useState("");
  const [theme, setTheme] = useState("system");

  // Detect system theme (light/dark)
  const detectSystemTheme = () => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    } else {
      return "light";
    }
  };

  // Apply theme based on selection
  const applyTheme = (theme: string) => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Handle theme changes
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    if (newTheme !== "system") {
      localStorage.setItem("theme", newTheme);
      applyTheme(newTheme);
    } else {
      localStorage.removeItem("theme");
      const systemTheme = detectSystemTheme();
      applyTheme(systemTheme);
    }
  };

  // On initial load, check for saved theme preference or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && savedTheme !== "system") {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      const systemTheme = detectSystemTheme();
      setTheme(systemTheme);
      applyTheme(systemTheme);
    }

    // Listen for system theme changes (if "system" option is selected)
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        const newTheme = e.matches ? "dark" : "light";
        setTheme(newTheme);
        applyTheme(newTheme);
      }
    };
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [theme]);

  return (
    <div>
      {/* Combobox Section */}
      <div className="flex flex-col justify-between lg:flex-row  ">
        <div className="flex flex-row justify-start lg:flex-row gap-4 p-4">
          <div className="w-full">
            <Combobox
              options={comboboxOptions}
              value={selectedOption}
              onChange={setSelectedOption}
            />
            {selectedOption && (
              <p className="mt-2 text-sm text-gray-600">
                Selected:{" "}
                {
                  comboboxOptions.find(
                    (option) => option.value === selectedOption
                  )?.label
                }
              </p>
            )}
          </div>

          {/* Navigation Menu */}
          <NavigationMenu>
            <NavigationMenuList className="flex space-x-4">
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuLink
                    href={link.href}
                    className="text-gray-500 hover:text-black"
                  >
                    {link.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex flex-row justify-end lg:flex-row gap-4 p-4">
          {/* Theme Selector */}
          <Select value={theme} onValueChange={handleThemeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>

          {/* Avatar Section */}
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <Separator />
      <div className="flex flex-row m-4 p-2">
        <h1 className="text-left font-bold justify-start text-4xl">Dashboard</h1>
        <div className="flex items-center w-full justify-end">
          <div className="w-full max-w-xs">
            {" "}
            {/* Added a max-width */}
            <DatePickerWithRange />
          </div>
          <Button variant="outline">Download</Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 p-4 ">
        <Card className="w-full">
          <CardHeader className="text-left">
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription>+20.1% from last month</CardDescription>
          </CardHeader>
          <CardContent className="text-left font-bold text-3xl">
            <p>$45,231.89</p>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader className="text-left">
            <CardTitle>Subscription</CardTitle>
            <CardDescription>+180.1% from last month</CardDescription>
          </CardHeader>
          <CardContent className="text-left font-bold text-3xl">
            <p>+2350</p>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader className="text-left">
            <CardTitle>Sales</CardTitle>
            <CardDescription>+19% from last month</CardDescription>
          </CardHeader>
          <CardContent className="text-left font-bold text-3xl">
            <p>+12,234</p>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader className="text-left">
            <CardTitle>Active Now</CardTitle>
            <CardDescription>+201 since last hour</CardDescription>
          </CardHeader>
          <CardContent className="text-left font-bold text-3xl">
            <p>+573</p>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <div className="flex flex-col lg:flex-row gap-4 p-4">
        {/* Chart Section */}
        <div className="p-4 border rounded-md shadow-md">
          <h2 className="text-lg font-bold mb-2">Monthly Analytics</h2>
          <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="desktop"
                  fill={chartConfig.desktop.color}
                  radius={4}
                >
                  <LabelList dataKey="desktop" position="top" />
                </Bar>
                <Bar
                  dataKey="mobile"
                  fill={chartConfig.mobile.color}
                  radius={4}
                >
                  <LabelList dataKey="mobile" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Table Section */}
        <div className="flex-1 border p-4 rounded-md bg-white shadow-md dark:bg-black dark:text-white">
          <h2 className="text-lg font-bold mb-2">Recent Invoices</h2>
          <Table className="w-full border">
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>INV-001</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Credit Card</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>INV-002</TableCell>
                <TableCell>Pending</TableCell>
                <TableCell>PayPal</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
