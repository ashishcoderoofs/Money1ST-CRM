
import { ApplicantEmploymentBasic } from "./employment/ApplicantEmploymentBasic";
import { ApplicantEmploymentAddress } from "./employment/ApplicantEmploymentAddress";
import { ApplicantEmploymentDetails } from "./employment/ApplicantEmploymentDetails";
import { ApplicantEmploymentDates } from "./employment/ApplicantEmploymentDates";
import { ApplicantEmploymentIncome } from "./employment/ApplicantEmploymentIncome";
import { ApplicantEmploymentPrevious } from "./employment/ApplicantEmploymentPrevious";

interface ApplicantEmploymentProps {
  form: any;
}

export function ApplicantEmployment({ form }: ApplicantEmploymentProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Employment Data</h3>
      
      <ApplicantEmploymentBasic form={form} />
      <ApplicantEmploymentAddress form={form} />
      <ApplicantEmploymentDetails form={form} />
      <ApplicantEmploymentDates form={form} />
      <ApplicantEmploymentIncome form={form} />
      <ApplicantEmploymentPrevious form={form} />
    </div>
  );
}
