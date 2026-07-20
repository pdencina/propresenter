import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">ProPresenter Clone</h1>
        <p className="text-gray-400 text-lg">Software profesional de presentaciones para iglesias</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl w-full">
        <Link
          href="/editor"
          className="btn-primary text-center py-6 text-lg"
        >
          Editor
        </Link>
        <Link
          href="/present/demo"
          className="btn-secondary text-center py-6 text-lg"
        >
          Presentador
        </Link>
        <Link
          href="/remote/demo"
          className="btn-secondary text-center py-6 text-lg"
        >
          Control Remoto
        </Link>
      </div>
    </main>
  );
}
