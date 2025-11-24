import { useLocation } from "react-router-dom"

export default function Navbar() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const linkClass = (path: string) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
      isActive(path)
        ? "bg-primary text-primary-foreground shadow-md"
        : "text-foreground/70 hover:text-foreground hover:bg-secondary"
    }`

  return (
    <nav className="bg-card border-b border-border/30 shadow-sm h-16 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between h-full items-center">
          <div className="flex items-center gap-3 min-w-fit">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-lg font-bold text-primary-foreground">R</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-base font-bold text-foreground">ResQ</div>
              <div className="text-xs text-foreground/50 font-medium">Dispatching</div>
            </div>
          </div>
          <div className="flex gap-1">
            <a href="/" className={linkClass("/")}>
              Dashboard
              {isActive("/") && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full"></span>
              )}
            </a>
            <a href="/map" className={linkClass("/map")}>
              Carte
              {isActive("/map") && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full"></span>
              )}
            </a>
            <a href="/fleet" className={linkClass("/fleet")}>
              Flotte
              {isActive("/fleet") && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full"></span>
              )}
            </a>
            <a href="/incidents" className={linkClass("/incidents")}>
              Historique
              {isActive("/incidents") && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full"></span>
              )}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-foreground">Opérateur</div>
              <div className="text-xs text-foreground/60 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                En service
              </div>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center border border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
              <span className="text-sm font-bold text-primary">OP</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
