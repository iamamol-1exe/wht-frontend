const DialogFooter = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col-reverse sm:flex-row sm:justify-center sm:space-x-2">
    {children}
  </div>
);

export default DialogFooter;
