import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { Save } from "lucide-react";

export function SaveChangesButton() {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} type="submit">
      <Save className="mr-2 h-4 w-4" />
      Save Changes
    </Button>
  );
}
