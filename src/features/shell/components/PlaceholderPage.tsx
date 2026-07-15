import { shellNavItems } from '../navigation';

type PlaceholderPageProps = {
  route: string;
};

export function PlaceholderPage({ route }: PlaceholderPageProps) {
  const item = shellNavItems.find((navItem) => navItem.href === route);
  const Icon = item?.icon;

  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-200">
              {Icon && <Icon className="h-3.5 w-3.5" />}
              Athena OS Module
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {item?.title ?? 'Workspace'}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                {item?.description ?? 'This Athena OS surface is ready for feature work.'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {['Navigation', 'State', 'Implementation'].map((label) => (
            <div key={label} className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-sm font-medium text-zinc-200">{label}</p>
              <p className="mt-2 text-xs leading-5 text-zinc-500">
                Placeholder architecture is connected. Feature logic will arrive in a later pass.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
