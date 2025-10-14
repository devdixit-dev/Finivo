import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CalendarIcon, Download, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useExpense } from '@/contexts/ExpenseContext';
import { exportToCSV, exportToExcel, exportToPDF } from '@/utils/exportUtils';
import { toast } from '@/hooks/use-toast';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExportDialog = ({ open, onOpenChange }: ExportDialogProps) => {
  const { expenses } = useExpense();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel' | 'pdf'>('csv');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    // Filter expenses by date range
    let filteredExpenses = [...expenses];
    
    if (startDate) {
      filteredExpenses = filteredExpenses.filter(
        expense => new Date(expense.date) >= startDate
      );
    }
    
    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      filteredExpenses = filteredExpenses.filter(
        expense => new Date(expense.date) <= endOfDay
      );
    }

    if (filteredExpenses.length === 0) {
      toast({
        title: 'No data to export',
        description: 'No expenses found in the selected date range',
        variant: 'destructive',
      });
      setIsExporting(false);
      return;
    }

    // Sort by date descending
    filteredExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const filename = `expenses_${startDate ? format(startDate, 'yyyyMMdd') : 'all'}_${endDate ? format(endDate, 'yyyyMMdd') : 'all'}`;

    try {
      switch (exportFormat) {
        case 'csv':
          exportToCSV(filteredExpenses, filename);
          break;
        case 'excel':
          exportToExcel(filteredExpenses, filename);
          break;
        case 'pdf':
          exportToPDF(filteredExpenses, filename);
          break;
      }

      toast({
        title: 'Export successful!',
        description: `Exported ${filteredExpenses.length} expenses`,
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'An error occurred while exporting',
        variant: 'destructive',
      });
    }

    setIsExporting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Expenses</DialogTitle>
          <DialogDescription>
            Select a date range and format to export your expenses
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Export Format</Label>
            <RadioGroup value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="font-normal cursor-pointer">CSV (Comma-separated values)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excel" id="excel" />
                <Label htmlFor="excel" className="font-normal cursor-pointer">Excel (.xlsx)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="font-normal cursor-pointer">PDF Document</Label>
              </div>
            </RadioGroup>
          </div>

          <Button
            onClick={handleExport}
            className="w-full bg-gradient-primary"
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
