import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const AlertModal = ({ show, title, body, variant = "default", onConfirm }) => {
  return (
    <Dialog open={show} onOpenChange={onConfirm}>
      <DialogContent className="sm:max-w-md rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-gray-700">{body}</div>
        <DialogFooter>
          <Button
            variant={variant}
            onClick={onConfirm}
            className="bg-[#0066cc] 
             hover:bg-[#004a99] 
             text-white 
             px-5"
          >
            Ok
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AlertModal;
