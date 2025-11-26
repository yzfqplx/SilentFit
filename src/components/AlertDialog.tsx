import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface AlertDialogProps {
  message: string | null;
  onConfirm: () => void;
  isOpen: boolean;
}

const CustomAlertDialog: React.FC<AlertDialogProps> = ({ message, onConfirm, isOpen }) => {
  if (!isOpen || !message) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onConfirm}>
      <AlertDialogContent className="max-w-sm p-4 rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>提示</AlertDialogTitle>
          <AlertDialogDescription>
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onConfirm}>确定</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomAlertDialog;
