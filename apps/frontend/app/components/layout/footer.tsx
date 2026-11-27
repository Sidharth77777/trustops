import Link from "next/link"
import {socialLinks, footerLinks} from "@/lib/data/footer-data"

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 space-y-5">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary font-bold text-primary-foreground">
              T
            </div>
            <span className="font-semibold text-foreground">
              TrustOps
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon

              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="text-muted-foreground transition hover:text-foreground"
                >
                  <Icon size={20} stroke={1.8} />
                </a>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs">
            © {new Date().getFullYear()} TrustOps. All rights reserved
          </span>

          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="transition hover:text-foreground"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <p className="text-xs text-muted-foreground">
          Built for Web3 identity & trust
        </p>

      </div>
    </footer>
  )
}
