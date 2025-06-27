
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

const TAB_CONFIG = [
  { value: "applicant", label: "Applicant" },
  { value: "co-applicant", label: "Co-Applicant" },
  { value: "household-members", label: "Household Members" },
  { value: "liabilities", label: "Liabilities" },
  { value: "mortgages", label: "Mortgages" },
  { value: "underwriting", label: "Underwriting" },
  { value: "loanstatus", label: "Loan Status" },
  { value: "drivers", label: "Drivers" },
  { value: "vehiclecoverage", label: "Vehicle Coverage" },
  { value: "homeowners", label: "Homeowners" },
  { value: "renters", label: "Renters" },
  { value: "incomeprotection", label: "Income Protection" },
  { value: "retirement", label: "Retirement" },
  { value: "lineage", label: "Lineage" },
];

const TAB_TRIGGER_CLASSES = "flex-shrink-0 text-base px-4 py-3 whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-md data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-bold text-gray-800";

export function TabsNavigation() {
  return (
    <TabsList className="flex w-full h-auto p-1 bg-gray-100 rounded-lg overflow-x-auto">
      {TAB_CONFIG.map(({ value, label }) => (
        <TabsTrigger 
          key={value}
          value={value} 
          className={TAB_TRIGGER_CLASSES}
        >
          {label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
