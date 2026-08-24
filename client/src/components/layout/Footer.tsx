export default function Footer() {
  return (
    <footer className="mt-24 border-t border-ink-900/10 bg-linen-100">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-ink-900/70">
        <div className="flex flex-col justify-between gap-6 md:flex-row">
          <div>
            <p className="font-serif text-lg text-ink-900">Northloom</p>
            <p className="mt-1 max-w-sm">
              Woven-linen textiles, stoneware, and quiet furniture for a home that wears well.
            </p>
          </div>
          <div className="flex gap-10">
            <div>
              <p className="mb-2 font-medium text-ink-900">Shop</p>
              <p>All products</p>
              <p>Featured</p>
            </div>
            <div>
              <p className="mb-2 font-medium text-ink-900">Account</p>
              <p>Orders</p>
              <p>Profile</p>
            </div>
          </div>
        </div>
        <p className="mt-8 text-xs text-ink-900/50">© {new Date().getFullYear()} Northloom. All rights reserved.</p>
      </div>
    </footer>
  );
}
