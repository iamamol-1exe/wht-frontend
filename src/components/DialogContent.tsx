const DialogContent = ({
  isOpen,
  children,
  className = "",
}: {
  children: React.ReactNode;
  isOpen: boolean;
  className?: string;
}) => (
  <div
    className={`fixed left-[50%] top-[50%] z-50 grid w-full max-w-[400px] translate-x-[-50%] translate-y-[-50%] gap-4 border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 p-6 shadow-2xl backdrop-blur-xl duration-300 sm:rounded-[32px] transition-all ${
      isOpen
        ? "opacity-100 scale-100 translate-y-[-50%]"
        : "opacity-0 scale-90 translate-y-[-40%] pointer-events-none"
    } ${className}`}
  >
    {children}
  </div>
);

export default DialogContent;
