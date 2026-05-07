/**
 * Lightweight expandable panel — replaces MUI Collapse without animation dependencies.
 */
export default function Collapse({
  in: isOpen,
  children,
  unmountOnExit = false,
}) {
  if (!isOpen && unmountOnExit) return null;
  if (!isOpen) return <div className="hidden">{children}</div>;
  return <>{children}</>;
}
